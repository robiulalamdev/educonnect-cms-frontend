"use client";

import { useEffect, useState, useCallback } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Loader2, Heart, MessageCircle, UserPlus, X } from "lucide-react";
import { onNewNotification } from "@/lib/socket";

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

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = (await getNotifications(1, 20)) as any;
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unread_count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    const cleanup = onNewNotification((data: any) => {
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: Date.now().toString(),
          type: data.type,
          title: data.title,
          body: data.body,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
    return cleanup;
  }, []);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative size-9 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/10 shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                    ({unreadCount} unread)
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 dark:text-blue-400 h-7"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck className="mr-1 size-3" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-5 text-blue-600 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800/50 ${
                        !notification.is_read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                      onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                    >
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                        !notification.is_read
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.is_read ? "font-semibold" : "font-medium"} text-gray-900 dark:text-white`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {timeAgo(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="size-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-center">
                <a
                  href="/dashboard/notifications"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => setShowDropdown(false)}
                >
                  View all notifications
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
