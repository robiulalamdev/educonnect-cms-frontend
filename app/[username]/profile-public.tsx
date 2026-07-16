"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Award, Calendar, MapPin, Mail, MessageSquare, UserPlus, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProfilePublicProps { user: any; posts?: any[]; }

function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }

export function ProfilePublic({ user, posts: initialPosts = [] }: ProfilePublicProps) {
  const posts = initialPosts;
  const loadingPosts = false;
  const avatarUrl = user.avatar?.key
    ? `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${user.avatar.key}`
    : null;
  const initials = user.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });



  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12]">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#16161D] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-[720px] mx-auto px-4 h-14 flex items-center">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0066FF] text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-4"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg></div>
            <span className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">EduConnect</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[720px] mx-auto px-4 py-6">
        {/* Profile Card */}
        <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D] overflow-hidden">
          <div className="relative h-24 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="size-[96px] rounded-full overflow-hidden ring-4 ring-white dark:ring-[#16161D]">
                {avatarUrl ? <img src={avatarUrl} alt={user.full_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#3B82F6]"><span className="text-3xl font-bold text-white">{getInitials(user.full_name)}</span></div>}
              </div>
            </div>
          </div>
          <div className="pt-14 px-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h1>
            <p className="text-sm text-gray-500">@{user.email?.split("@")[0]}</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#0066FF]/10 px-4 py-1.5 text-xs font-semibold text-[#0066FF]">{user.role}</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              {user.city && <span className="flex items-center gap-1"><MapPin className="size-3" />{user.city}</span>}
              <span className="flex items-center gap-1"><Calendar className="size-3" />Member since {memberSince}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 px-6 py-5 mt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 mx-auto mb-1.5"><BookOpen className="size-4 text-blue-600" /></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{posts.length}</p>
              <p className="text-[11px] text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50 mx-auto mb-1.5"><CheckCircle className="size-4 text-green-600" /></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-[11px] text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50 mx-auto mb-1.5"><Award className="size-4 text-amber-600" /></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-[11px] text-gray-500">Certificates</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <Mail className="size-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
            </div>
          </div>
        </Card>

        {/* User Posts */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Posts</h2>
          {loadingPosts ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5 animate-pulse">
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                  <div className="aspect-[16/10] rounded-2xl bg-gray-200 dark:bg-gray-700 mt-3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl">
              <CardContent className="p-12 text-center">
                <BookOpen className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="mt-3 text-sm text-gray-500">No posts yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="border border-gray-200/80 dark:border-gray-800/80 rounded-2xl overflow-hidden">
                  <CardContent className="p-5">
                    {post.title && <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-1">{post.title}</h3>}
                    <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">{post.content?.replace(/<[^>]*>/g, "").slice(0, 200)}{post.content?.length > 200 ? "..." : ""}</p>
                    {post.media?.length > 0 && (
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <img src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_600/${post.media[0].key}`} alt="" className="w-full aspect-[16/10] object-cover" loading="lazy" />
                      </div>
                    )}
                    <p className="mt-3 text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
