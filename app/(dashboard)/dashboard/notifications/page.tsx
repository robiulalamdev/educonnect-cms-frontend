import type { Metadata } from "next";
import { NotificationsList } from "./notifications-list";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your notifications",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Stay updated with your activity
        </p>
      </div>
      <NotificationsList />
    </div>
  );
}
