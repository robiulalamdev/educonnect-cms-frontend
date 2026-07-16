"use client";

import { useEffect, useState, useCallback } from "react";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/lib/actions/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  CheckCheck,
  Trash2, Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "POST_LIKED": return Heart;
    case "NEW_COMMENT":
    case "NEW_REPLY": return MessageCircle;
    case "NEW_FOLLOWER": return UserPlus;
    default: return Bell;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case "POST_LIKED": return "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400";
    case "NEW_COMMENT":
    case "NEW_REPLY": return "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400";
    case "NEW_FOLLOWER": return "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400";
    default: return "bg-gray-100 dark:bg-gray-800 text-gray-500";
  }
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getNotifications(p, 20)) as any;
      if (res.success) {
        setNotifications(res.data);
        setMeta(res.meta);
        setUnreadCount(res.unread_count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page);
  }, [page, loadNotifications]);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  async function handleDelete(id: string) {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-blue-600 dark:text-blue-400"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="mr-1.5 size-3.5" />
            Mark all as read
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
              <Bell className="size-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You&apos;re all caught up!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            return (
              <Card
                key={notification.id}
                className={`border-0 shadow-sm rounded-2xl transition-all duration-200 ${
                  !notification.is_read
                    ? "bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50"
                    : "dark:bg-gray-900 dark:border dark:border-gray-800"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.is_read ? "font-semibold" : "font-medium"} text-gray-900 dark:text-white`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {notification.body}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-gray-400 hover:text-blue-600"
                          onClick={() => handleMarkRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
