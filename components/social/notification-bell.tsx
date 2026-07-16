"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Loader2, Heart, MessageCircle, UserPlus, X } from "lucide-react";
import { onNewNotification } from "@/lib/socket";

interface Notification {
  id: string; type: string; title: string; body: string;
  reference_type?: string; reference_id?: string; is_read: boolean; created_at: string;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "POST_LIKED": return Heart;
    case "NEW_COMMENT": case "NEW_REPLY": return MessageCircle;
    case "NEW_FOLLOWER": return UserPlus;
    default: return Bell;
  }
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "now"; const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const res = (await getNotifications(1, 20)) as any;
      if (res.success) { setNotifications(res.data); setUnreadCount(res.unread_count); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  // Real-time notifications
  useEffect(() => {
    const cleanup = onNewNotification((data: any) => {
      setUnreadCount((p) => p + 1);
      setNotifications((p) => [{ id: Date.now().toString(), type: data.type, title: data.title, body: data.body, is_read: false, created_at: new Date().toISOString() }, ...p]);
    });
    return cleanup;
  }, []);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((p) => p.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((p) => Math.max(0, p - 1));
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
      >
        <Bell className="size-[18px] text-gray-500 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-[20px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Notifications {unreadCount > 0 && <span className="font-normal text-gray-400 ml-1">({unreadCount})</span>}
            </h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-[#0066FF] hover:text-[#0052CC]">Mark all read</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="size-5 text-[#0066FF] animate-spin" /></div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto size-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = getNotificationIcon(n.type);
                return (
                  <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800/50 transition-colors ${!n.is_read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${!n.is_read ? "bg-[#0066FF]/10 text-[#0066FF]" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                      <Icon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] ${!n.is_read ? "font-semibold" : "font-medium"} text-gray-900 dark:text-white`}>{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && <div className="size-2 rounded-full bg-[#0066FF] shrink-0 mt-1.5" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
