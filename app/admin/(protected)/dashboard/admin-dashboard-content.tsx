"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, GraduationCap, UserCheck, BookOpen, DollarSign, TrendingUp,
  AlertCircle, CheckCircle, FileText, Star, Layers, Clock, Shield,
  CreditCard, User, UsersRound, ClipboardList, HandMetal, UserPlus,
  Plus, Eye, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { getAdminStats } from "@/lib/actions/dashboard";

interface DashboardStats {
  users: Record<string, number>;
  userStatus: Record<string, number>;
  enrollments: Record<string, number>;
  revenue: { total_approved: number; count: number };
  counts: { services: number; batches: number; posts: number; reviews: number };
  pending_approvals: number;
  monthlyGrowth: { name: string; teachers: number; students: number; guardians: number; total: number; revenue: number }[];
  postBreakdown: Record<string, number>;
  recentActivity: any[];
  topTeachers: any[];
  recentUsers: any[];
}

const PIE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-gray-600 dark:text-gray-400">
          <span className="inline-block size-2 rounded-full mr-1.5" style={{ background: entry.color }} />
          {entry.name}: {typeof entry.value === "number" && entry.name === "revenue" ? `৳${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
};

export function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getAdminStats();
        if (res.success) setStats(res.data);
      } catch {} finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalUsers = stats ? Object.values(stats.users).reduce((a, b) => a + b, 0) : 0;
  const totalEnrollments = stats ? Object.values(stats.enrollments).reduce((a, b) => a + b, 0) : 0;

  // Calculate real month-over-month growth
  const monthlyData = stats?.monthlyGrowth || [];
  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const growthPct = prevMonth && prevMonth.total > 0
    ? (((currentMonth?.total || 0) - prevMonth.total) / prevMonth.total * 100).toFixed(1)
    : "0";
  const growthPositive = Number(growthPct) >= 0;

  // Enrollment breakdown
  const enrollmentEntries = stats?.enrollments ? Object.entries(stats.enrollments) : [];
  const hasEnrollments = enrollmentEntries.length > 0 && totalEnrollments > 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
              <CardContent className="p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                    <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalTeachers = stats?.users?.TEACHER || 0;
  const totalStudents = stats?.users?.STUDENT || 0;
  const totalGuardians = stats?.users?.GUARDIAN || 0;

  // Stat cards matching image
  const statCards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600",
      change: growthPct !== "0" ? `${growthPositive ? "+" : ""}${growthPct}%` : "—",
      changeLabel: "from last month",
      changePositive: growthPositive,
    },
    {
      label: "Total Revenue",
      value: `৳${(stats?.revenue.total_approved || 0).toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600",
      change: "—",
      changeLabel: "all time",
      changePositive: true,
    },
    {
      label: "Enrollments",
      value: totalEnrollments,
      icon: TrendingUp,
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600",
      change: "—",
      changeLabel: "total",
      changePositive: true,
    },
    {
      label: "Pending Approvals",
      value: stats?.pending_approvals || 0,
      icon: AlertCircle,
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
      iconColor: "text-orange-600",
      change: (stats?.pending_approvals ?? 0) > 0 ? "Needs action" : "All clear",
      changeLabel: "",
      changePositive: !stats?.pending_approvals,
    },
  ];

  // User distribution pie data
  const userRolePieData = [
    { name: "Students", value: totalStudents },
    { name: "Teachers", value: totalTeachers },
    { name: "Guardians", value: totalGuardians },
  ].filter((d) => d.value > 0);

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Welcome back! Here&apos;s what&apos;s happening on your platform today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] text-gray-600 dark:text-gray-400">
          <Calendar className="size-4 text-gray-400" />
          <span className="font-medium">{today}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border border-gray-200/80 dark:border-gray-800 rounded-2xl hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${card.iconBg}`}>
                    <Icon className={`size-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 font-medium">{card.label}</p>
                    <p className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight">{card.value}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className={`text-[12px] font-semibold ${card.changePositive ? "text-green-600" : "text-gray-500"}`}>
                    {card.change}
                  </span>
                  <span className="text-[12px] text-gray-400">{card.changeLabel}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart + User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
        {/* Revenue Overview */}
        <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Monthly approved payments</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${growthPositive ? "bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900/30" : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}`}>
                  <TrendingUp className={`size-3.5 ${growthPositive ? "text-green-600" : "text-gray-400"}`} />
                  <span className={`text-[11px] font-bold ${growthPositive ? "text-green-600" : "text-gray-500"}`}>{growthPct}%</span>
                </div>
                <select className="text-[12px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats?.monthlyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, strokeWidth: 2 }} name="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">User Distribution</h3>
            <p className="text-[12px] text-gray-500 mt-0.5 mb-4">By role</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={userRolePieData.length > 0 ? userRolePieData : [{ name: "No Data", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {(userRolePieData.length > 0 ? userRolePieData : [{ name: "No Data", value: 1 }]).map((_, index) => (
                      <Cell key={index} fill={userRolePieData.length > 0 ? PIE_COLORS[index % PIE_COLORS.length] : "#e5e7eb"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {[
                  { name: "Students", count: totalStudents, total: totalUsers, color: PIE_COLORS[0] },
                  { name: "Teachers", count: totalTeachers, total: totalUsers, color: PIE_COLORS[1] },
                  { name: "Guardians", count: totalGuardians, total: totalUsers, color: "#8b5cf6" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="size-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-[13px] text-gray-500 font-medium w-16">{item.name}</span>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{item.count}</span>
                    <span className="text-[12px] text-gray-400">
                      ({item.total > 0 ? ((item.count / item.total) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Signups + Enrollments + Platform Stats + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* User Signups */}
        <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">User Signups</h3>
            <p className="text-[12px] text-gray-500 mt-0.5 mb-4">Last 12 months</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats?.monthlyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="teachers" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Teachers" />
                <Bar dataKey="students" fill="#10b981" radius={[3, 3, 0, 0]} name="Students" />
                <Bar dataKey="guardians" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Guardians" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="size-2 rounded-full bg-blue-500" />Teachers</span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="size-2 rounded-full bg-emerald-500" />Students</span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="size-2 rounded-full bg-purple-500" />Guardians</span>
            </div>
          </CardContent>
        </Card>

        {/* Enrollments */}
        <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Enrollments</h3>
            <p className="text-[12px] text-gray-500 mt-0.5 mb-4">{totalEnrollments} total</p>
            {hasEnrollments ? (
              <div className="space-y-2.5">
                {enrollmentEntries.map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-gray-600 dark:text-gray-400">{status}</span>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <GraduationCap className="size-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-[13px] text-gray-400">No enrollments yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Platform Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-center">
                <BookOpen className="size-5 text-blue-600 mx-auto mb-1.5" />
                <p className="text-[18px] font-bold text-gray-900 dark:text-white">{stats?.counts.services || 0}</p>
                <p className="text-[11px] text-gray-500 font-medium">Courses</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-center">
                <Layers className="size-5 text-purple-600 mx-auto mb-1.5" />
                <p className="text-[18px] font-bold text-gray-900 dark:text-white">{stats?.counts.batches || 0}</p>
                <p className="text-[11px] text-gray-500 font-medium">Batches</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-center">
                <FileText className="size-5 text-green-600 mx-auto mb-1.5" />
                <p className="text-[18px] font-bold text-gray-900 dark:text-white">{stats?.counts.posts || 0}</p>
                <p className="text-[11px] text-gray-500 font-medium">Posts</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 text-center">
                <Star className="size-5 text-yellow-600 mx-auto mb-1.5" />
                <p className="text-[18px] font-bold text-gray-900 dark:text-white">{stats?.counts.reviews || 0}</p>
                <p className="text-[11px] text-gray-500 font-medium">Reviews</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-center">
                <CreditCard className="size-5 text-red-600 mx-auto mb-1.5" />
                <p className="text-[18px] font-bold text-gray-900 dark:text-white">{stats?.revenue.count || 0}</p>
                <p className="text-[11px] text-gray-500 font-medium">Payments</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-center">
                <AlertCircle className="size-5 text-blue-600 mx-auto mb-1.5" />
                <p className="text-[18px] font-bold text-gray-900 dark:text-white">{stats?.pending_approvals || 0}</p>
                <p className="text-[11px] text-gray-500 font-medium">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              <a href="/admin/audit-logs" className="text-[12px] text-blue-600 hover:underline font-medium">View All</a>
            </div>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-1">
                {stats.recentActivity.slice(0, 5).map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex size-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 shrink-0 mt-0.5">
                      <CheckCircle className="size-3.5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-snug">
                        <span className="font-semibold text-gray-900 dark:text-white">{log.admin?.full_name || "System"}</span>
                        {" "}{log.action.replace(/_/g, " ").toLowerCase()}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="size-8 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-[12px] text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Add Teacher", href: "/admin/teachers", icon: GraduationCap, bg: "bg-orange-50 dark:bg-orange-950/50", text: "text-orange-600", border: "border-orange-100 dark:border-orange-900/30" },
              { label: "Add User", href: "/admin/users", icon: UserPlus, bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600", border: "border-blue-100 dark:border-blue-900/30" },
              { label: "Add Admin", href: "/admin/admins", icon: Shield, bg: "bg-red-50 dark:bg-red-950/50", text: "text-red-600", border: "border-red-100 dark:border-red-900/30" },
              { label: "Create Course", href: "/admin/education", icon: BookOpen, bg: "bg-green-50 dark:bg-green-950/50", text: "text-green-600", border: "border-green-100 dark:border-green-900/30" },
              { label: "Create Post", href: "/admin/posts", icon: FileText, bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600", border: "border-blue-100 dark:border-blue-900/30" },
              { label: "View Payments", href: "/admin/payments", icon: CreditCard, bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600", border: "border-blue-100 dark:border-blue-900/30" },
              { label: "Subscriptions", href: "/admin/subscriptions", icon: DollarSign, bg: "bg-green-50 dark:bg-green-950/50", text: "text-green-600", border: "border-green-100 dark:border-green-900/30" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border ${item.border} ${item.bg} hover:shadow-sm transition-all text-[13px] font-semibold ${item.text}`}
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
