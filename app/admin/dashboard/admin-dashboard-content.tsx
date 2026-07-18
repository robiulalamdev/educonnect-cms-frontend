"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, UserCheck, BookOpen, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface DashboardStats {
  total_users: number;
  total_teachers: number;
  total_students: number;
  total_guardians: number;
  pending_approvals: number;
  total_services: number;
  total_batches: number;
  total_enrollments: number;
  active_services: number;
  total_revenue: number;
}

export function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/statistics/admin", { credentials: "include" });
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = stats ? [
    { label: "Total Users", value: stats.total_users, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Teachers", value: stats.total_teachers, icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
    { label: "Students", value: stats.total_students, icon: UserCheck, color: "text-green-600 bg-green-50" },
    { label: "Pending Approvals", value: stats.pending_approvals, icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
    { label: "Active Services", value: stats.active_services, icon: BookOpen, color: "text-indigo-600 bg-indigo-50" },
    { label: "Total Enrollments", value: stats.total_enrollments, icon: TrendingUp, color: "text-cyan-600 bg-cyan-50" },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">System overview and management</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 items-center justify-center rounded-xl ${card.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{card.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a href="/admin/teachers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Teacher Approvals</p>
                <p className="text-xs text-gray-500">Review pending teachers</p>
              </div>
            </a>
            <a href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">User Management</p>
                <p className="text-xs text-gray-500">Manage all users</p>
              </div>
            </a>
            <a href="/admin/education" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <BookOpen className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Education</p>
                <p className="text-xs text-gray-500">Levels & subjects</p>
              </div>
            </a>
            <a href="/admin/subscriptions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <DollarSign className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Subscriptions</p>
                <p className="text-xs text-gray-500">Manage packages</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="size-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">System Online</p>
                <p className="text-xs text-gray-500">All services operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Users className="size-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Active Users</p>
                <p className="text-xs text-gray-500">Users currently online</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <TrendingUp className="size-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Growth</p>
                <p className="text-xs text-gray-500">Monthly user growth</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
