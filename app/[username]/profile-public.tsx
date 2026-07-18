"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Award, Calendar, MapPin, Mail, Phone, User, Globe, Users, GraduationCap, Hash, Clock, MessageSquare, Bell, Home, Settings, Search, Sun, ChevronRight, FileText, Crown, Star, TrendingUp, Heart, Lightbulb } from "lucide-react";
import Link from "next/link";

interface ProfilePublicProps { user: any; posts?: any[]; }

function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }

const tabs = ["Overview", "Academics", "Activity", "Achievements", "Messages"];

export function ProfilePublic({ user, posts = [] }: ProfilePublicProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const avatarUrl = user.avatar?.key
    ? `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${user.avatar.key}`
    : null;
  const initials = getInitials(user.full_name || "U");
  const username = user.email?.split("@")[0] || user.full_name?.toLowerCase().replace(/\s+/g, "") || "user";
  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  const uniqueSubjects = [...new Set(posts.flatMap((p: any) => p.subjects?.map((s: any) => s.subject?.name).filter(Boolean) || []))];
  const subjectCount = uniqueSubjects.length;

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#16161D] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-[1280px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0066FF] text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-4"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg></div>
            <span className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">EduConnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {["Home", "Courses", "Schools", "About"].map((tab, i) => (
              <a key={tab} href="#" className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${i === 0 ? "text-[#0066FF] bg-[#0066FF]/8" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{tab}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <div className="pl-10 pr-8 h-9 w-56 rounded-full bg-gray-100 dark:bg-gray-800/80 flex items-center text-[13px] text-gray-400">Search...</div>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
            <button className="size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors text-[15px]">🌙</button>
            <button className="relative size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
              <Bell className="size-[18px] text-gray-500 dark:text-gray-400" />
            </button>
            <Link href="/login"><Button variant="outline" size="sm" className="rounded-full px-5 h-9 text-[13px] font-semibold border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white">Login</Button></Link>
          </div>
        </div>
      </nav>

      {/* Profile Hero */}
      <div className="bg-white dark:bg-[#16161D] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="relative">
            {/* Gradient Background */}
            <div className="h-48 rounded-b-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-40" />
            </div>

            {/* Profile Content */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="size-[140px] rounded-full overflow-hidden ring-4 ring-white dark:ring-[#16161D] shadow-xl">
                    {avatarUrl ? <img src={avatarUrl} alt={user.full_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#3B82F6]"><span className="text-3xl font-bold text-white">{initials}</span></div>}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.full_name}</h1>
                    <svg className="size-5 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{username}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-[#0066FF]/10 px-3 py-1 text-xs font-semibold text-[#0066FF]">{user.role || "Student"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{user.email || "Contact via message"}</span>
                    <span className="flex items-center gap-1.5"><Phone className="size-3.5" />{user.phone || "01751299132"}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{user.city ? `${user.city}, ${user.country || "Bangladesh"}` : "Dhaka, Bangladesh"}</span>
                  </div>
                </div>

                {/* Member Since Card */}
                <div className="shrink-0 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Member Since</p><p className="font-semibold text-gray-900 dark:text-white">{memberSince || "April 2024"}</p></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-4 text-gray-400" />
                    <div><p className="text-xs text-gray-500">Role</p><p className="font-semibold text-gray-900 dark:text-white">{user.role || "Student"}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200/80 dark:border-gray-800/80 -mb-px">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 text-[14px] font-medium border-b-2 transition-all ${
                  activeTab === tab ? "border-[#0066FF] text-[#0066FF]" : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}>
                {tab === "Overview" && <User className="size-4" />}
                {tab === "Academics" && <BookOpen className="size-4" />}
                {tab === "Activity" && <Clock className="size-4" />}
                {tab === "Achievements" && <Award className="size-4" />}
                {tab === "Messages" && <MessageSquare className="size-4" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {activeTab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left - About & Academic */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Me */}
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <User className="size-5 text-[#0066FF]" /> About Me
                  </h3>
                  <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    Hi! I&apos;m {user.full_name}, a passionate learner who loves to explore new things and improve every day. Currently focusing on my studies and building skills for the future.
                  </p>
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InfoItem icon={Calendar} label="Date of Birth" value="Jan 15, 2004" />
                    <InfoItem icon={User} label="Gender" value={user.gender || "Male"} />
                    <InfoItem icon={Globe} label="Nationality" value={user.country || "Bangladeshi"} />
                    <InfoItem icon={Users} label="Guardian" value="Abdul Kalam" />
                    <InfoItem icon={Phone} label="Guardian Phone" value="01700000000" />
                    <InfoItem icon={Users} label="Relationship" value="Father" />
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <GraduationCap className="size-5 text-[#0066FF]" /> Academic Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InfoItem icon={GraduationCap} label="Current Institution" value="Dhanmondi Govt. College" />
                    <InfoItem icon={Hash} label="Class / Grade" value="HSC - 2026" />
                    <InfoItem icon={BookOpen} label="Group / Department" value="Science" />
                    <InfoItem icon={User} label="Student ID" value="2026-1256" />
                    <InfoItem icon={FileText} label="Roll Number" value="125678" />
                    <InfoItem icon={Calendar} label="Session" value="2024-2026" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Clock className="size-5 text-[#0066FF]" /> Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
                          <FileText className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Posted a new update</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{post.content?.replace(/<[^>]*>/g, "").slice(0, 100)}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {posts.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right - Stats & Contact */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <BarChart3Icon className="size-5 text-[#0066FF]" /> Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <StatItem icon={BookOpen} color="blue" label="Posts" value={posts.length.toString()} />
                    <StatItem icon={CheckCircle} color="green" label="Completed Courses" value="0" />
                    <StatItem icon={Award} color="amber" label="Certificates" value="0" />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Phone className="size-5 text-[#0066FF]" /> Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0"><Mail className="size-4" /></div>
                      <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-900 dark:text-white">{user.email || "robiulalamdev@gmail.com"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 shrink-0"><Phone className="size-4" /></div>
                      <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone || "01751299132"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 shrink-0"><MapPin className="size-4" /></div>
                      <div><p className="text-xs text-gray-500">Address</p><p className="text-sm font-medium text-gray-900 dark:text-white">{user.area ? `${user.area}, ${user.city || "Dhaka"}, ${user.country || "Bangladesh"}` : "Dhanmondi, Dhaka, Bangladesh"}</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "Academics" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <GraduationCap className="size-5 text-[#0066FF]" /> Academic Profile
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InfoItem icon={GraduationCap} label="Current Institution" value="Dhanmondi Govt. College" />
                    <InfoItem icon={Hash} label="Class / Grade" value="HSC - 2026" />
                    <InfoItem icon={BookOpen} label="Group / Department" value="Science" />
                    <InfoItem icon={User} label="Student ID" value="2026-1256" />
                    <InfoItem icon={FileText} label="Roll Number" value="125678" />
                    <InfoItem icon={Calendar} label="Session" value="2024-2026" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <BookOpen className="size-5 text-[#0066FF]" /> Enrolled Courses
                  </h3>
                  {posts.length > 0 ? (
                    <div className="space-y-3">
                      {uniqueSubjects.slice(0, 5).map((subject: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                              <BookOpen className="size-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{subject}</p>
                              <p className="text-xs text-gray-500">Active enrollment</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">Enrolled</span>
                        </div>
                      ))}
                      {subjectCount === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">No courses enrolled yet</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No course data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <BarChart3Icon className="size-5 text-[#0066FF]" /> Academic Stats
                  </h3>
                  <div className="space-y-4">
                    <StatItem icon={BookOpen} color="blue" label="Subjects" value={String(subjectCount)} />
                    <StatItem icon={FileText} color="green" label="Posts Shared" value={posts.length.toString()} />
                    <StatItem icon={Award} color="amber" label="Completed" value="0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Calendar className="size-5 text-[#0066FF]" /> Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Morning Batch</p>
                      <p className="text-xs text-gray-500 mt-0.5">8:00 AM - 10:00 AM</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Evening Batch</p>
                      <p className="text-xs text-gray-500 mt-0.5">4:00 PM - 6:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="space-y-4">
            {posts.length > 0 ? posts.map((post) => (
              <Card key={post.id} className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Published a post</p>
                        <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {post.title && <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">{post.title}</p>}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-3">{post.content?.replace(/<[^>]*>/g, "").slice(0, 200)}</p>
                      {post.media?.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                          <FileText className="size-3.5" /> {post.media.length} image{post.media.length > 1 ? "s" : ""}
                        </div>
                      )}
                      {post.subjects?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {post.subjects.map((s: any) => (
                            <span key={s.subject.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[11px] font-medium text-[#0066FF]">
                              <Hash className="size-3" />{s.subject.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-16 text-center">
                  <Clock className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No activity yet</h3>
                  <p className="mt-2 text-sm text-gray-500">This user hasn&apos;t posted anything yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "Achievements" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
                    <Award className="size-5 text-[#0066FF]" /> Achievements & Badges
                  </h3>
                  {posts.length >= 1 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <AchievementBadge icon={FileText} label="First Post" desc="Published first post" color="blue" earned />
                      {posts.length >= 5 && <AchievementBadge icon={TrendingUpIcon} label="Active Creator" desc="Published 5+ posts" color="green" earned />}
                      {posts.length >= 10 && <AchievementBadge icon={StarIcon} label="Star Contributor" desc="Published 10+ posts" color="amber" earned />}
                      <AchievementBadge icon={BookOpen} label="Learner" desc="Enrolled in courses" color="purple" earned={posts.some((p: any) => p.subjects?.length > 0)} />
                      <AchievementBadge icon={UsersIcon} label="Community Member" desc="Joined the community" color="indigo" earned />
                      <AchievementBadge icon={AwardIcon} label="Top Performer" desc="Outstanding contribution" color="rose" earned={false} />
                      <AchievementBadge icon={GraduationCap} label="Scholar" desc="Completed all courses" color="teal" earned={false} />
                      <AchievementBadge icon={HeartIcon} label="Supporter" desc="Helped 10 students" color="pink" earned={false} />
                      <AchievementBadge icon={LightBulbIcon} label="Innovator" desc="Shared unique content" color="orange" earned={false} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No achievements yet. Start posting to earn badges!</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <BarChart3Icon className="size-5 text-[#0066FF]" /> Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Complete</span>
                        <span className="text-sm font-bold text-[#0066FF]">60%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full rounded-full bg-[#0066FF] transition-all" style={{ width: "60%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Level</span>
                        <span className="text-sm font-bold text-green-500">{posts.length > 0 ? "Active" : "Inactive"}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${Math.min(100, posts.length * 20)}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
                <CardContent className="p-6 text-center">
                  <Crown className="size-10 text-[#0066FF] mx-auto" />
                  <h3 className="mt-3 text-[15px] font-bold text-gray-900 dark:text-white">Unlock More</h3>
                  <p className="mt-1 text-[13px] text-gray-500">Upgrade to Pro for exclusive badges</p>
                  <Button className="mt-4 w-full rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white h-9 text-[13px] font-semibold">Upgrade Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "Messages" && (
          <div className="max-w-2xl mx-auto">
            <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-[#16161D]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                  <MessageSquare className="size-5 text-[#0066FF]" /> Send a Message
                </h3>
                <p className="text-sm text-gray-500 mb-5">Send a direct message to {user.full_name}</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm text-gray-500">{user.email || "Not available"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 shrink-0">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-sm text-gray-500">{user.phone || "Not available"}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/dashboard/messages">
                    <Button className="w-full rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white h-11 text-[14px] font-semibold shadow-lg shadow-blue-500/20">
                      <MessageSquare className="mr-2 size-4" /> Open Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 dark:border-gray-800/80 mt-8">
        <div className="max-w-[1280px] mx-auto px-4 py-6 flex items-center justify-between text-xs text-gray-400">
          <span>&copy; 2024 EduConnect. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-400 shrink-0">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, color, label, value }: { icon: any; color: string; label: string; value: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950/50 text-blue-600",
    green: "bg-green-50 dark:bg-green-950/50 text-green-600",
    amber: "bg-amber-50 dark:bg-amber-950/50 text-amber-600",
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`flex size-10 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-[12px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function BarChart3Icon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>; }

function AchievementBadge({ icon: Icon, label, desc, color, earned }: { icon: any; label: string; desc: string; color: string; earned: boolean }) {
  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600", ring: "ring-blue-200 dark:ring-blue-800" },
    green: { bg: "bg-green-50 dark:bg-green-950/50", text: "text-green-600", ring: "ring-green-200 dark:ring-green-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-600", ring: "ring-amber-200 dark:ring-amber-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-950/50", text: "text-purple-600", ring: "ring-purple-200 dark:ring-purple-800" },
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/50", text: "text-indigo-600", ring: "ring-indigo-200 dark:ring-indigo-800" },
    rose: { bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-600", ring: "ring-rose-200 dark:ring-rose-800" },
    teal: { bg: "bg-teal-50 dark:bg-teal-950/50", text: "text-teal-600", ring: "ring-teal-200 dark:ring-teal-800" },
    pink: { bg: "bg-pink-50 dark:bg-pink-950/50", text: "text-pink-600", ring: "ring-pink-200 dark:ring-pink-800" },
    orange: { bg: "bg-orange-50 dark:bg-orange-950/50", text: "text-orange-600", ring: "ring-orange-200 dark:ring-orange-800" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all ${earned ? `border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-[#16161D]` : `border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30 opacity-50`}`}>
      <div className={`flex size-12 items-center justify-center rounded-2xl ${c.bg} ${c.text} ${earned ? "" : "grayscale"}`}>
        <Icon className="size-6" />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-bold text-gray-900 dark:text-white">{label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
      </div>
      {earned && <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/50 px-2 py-0.5 text-[10px] font-bold text-green-600"><CheckCircle className="size-3" /> Earned</span>}
      {!earned && <span className="text-[10px] text-gray-400 font-medium">Locked</span>}
    </div>
  );
}

function TrendingUpIcon(props: any) { return <TrendingUp className={props.className} />; }
function StarIcon(props: any) { return <Star className={props.className} />; }
function UsersIcon(props: any) { return <Users className={props.className} />; }
function AwardIcon(props: any) { return <Award className={props.className} />; }
function HeartIcon(props: any) { return <Heart className={props.className} />; }
function LightBulbIcon(props: any) { return <Lightbulb className={props.className} />; }
