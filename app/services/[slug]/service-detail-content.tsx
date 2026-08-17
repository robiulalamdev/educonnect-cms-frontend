"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  MapPin, Clock, Star, Users, BookOpen, Globe, Home, Monitor,
  ChevronRight, MessageSquare, Calendar, GraduationCap, ArrowLeft,
  Share2, Bookmark, CheckCircle
} from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";

interface ServiceDetailProps {
  service: any;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};

export function ServiceDetailContent({ service }: ServiceDetailProps) {
  const [showShare, setShowShare] = useState(false);

  const teacher = service.teacher;
  const subjects = service.subjects?.map((s: any) => s.subject) || [];
  const levels = service.levels?.map((l: any) => l.level) || [];
  const batches = service.batches || [];
  const paymentMethods = service.payment_methods || [];

  const formatFee = (fee: number | null, label: string) => {
    if (!fee) return null;
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-[14px] text-gray-500">{label}</span>
        <span className="text-[14px] font-bold text-gray-900 dark:text-white">৳{fee}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#16161D] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-[1280px] mx-auto px-4 h-[56px] flex items-center gap-4">
          <Link href="/search" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-gray-900 dark:text-white truncate">
              {service.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: service.title, url: window.location.href });
                }
              }}
              className="size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <Share2 className="size-4 text-gray-500" />
            </button>
            <button className="size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
              <Bookmark className="size-4 text-gray-500" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-full lg:max-w-[1000px] mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-green-50 text-green-600">
                  {service.format}
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600">
                  {service.mode}
                </span>
                {service.status === "ACTIVE" && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                    Active
                  </span>
                )}
              </div>
              <h1 className="text-[24px] font-bold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h1>
              <div className="flex items-center gap-4 text-[13px] text-gray-500">
                {service.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{Number(service.average_rating).toFixed(1)}</span>
                    <span>({service.total_reviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span>{[service.area, service.city, service.state].filter(Boolean).join(", ")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {subjects.map((s: any) => (
                <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 text-[12px] font-medium text-[#0066FF]">
                  <BookOpen className="size-3" />
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {/* Levels */}
          {levels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {levels.map((l: any) => (
                <span key={l.id} className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 text-[12px] font-medium text-purple-600">
                  <GraduationCap className="size-3" />
                  {l.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {service.description && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-2">About this service</h3>
              <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>
          )}

          {/* Fee Note */}
          {service.fee_note && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
              <p className="text-[13px] text-amber-700 dark:text-amber-400">{service.fee_note}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meeting Info */}
            {(service.meeting_platform || service.meeting_link) && (
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Monitor className="size-4 text-[#0066FF]" /> Online Meeting
                </h3>
                <div className="space-y-2 text-[13px]">
                  {service.meeting_platform && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Platform:</span> {service.meeting_platform}
                    </div>
                  )}
                  {service.meeting_link && (
                    <a
                      href={service.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0066FF] hover:underline"
                    >
                      Join Meeting Link <ChevronRight className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Batches */}
            {batches.length > 0 && (
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="size-4 text-[#0066FF]" /> Batches ({batches.length})
                </h3>
                <div className="space-y-3">
                  {batches.map((batch: any) => (
                    <div
                      key={batch.id}
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">{batch.name}</h4>
                          {batch.description && (
                            <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">{batch.description}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          batch.status === "ONGOING" ? "bg-green-50 text-green-600" :
                          batch.status === "UPCOMING" ? "bg-blue-50 text-blue-600" :
                          batch.status === "COMPLETED" ? "bg-gray-100 text-gray-500" :
                          "bg-red-50 text-red-500"
                        }`}>
                          {batch.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[12px] text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>{batch.enrolled_count || 0}/{batch.max_students} students</span>
                        </div>
                        {batch.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>Starts {new Date(batch.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {batch.schedules?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {batch.schedules.map((sch: any, i: number) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                              <Clock className="size-2.5" />
                              {DAY_LABELS[sch.day] || sch.day} {sch.start_time?.slice(0, 5)}-{sch.end_time?.slice(0, 5)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {paymentMethods.length > 0 && (
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3">Payment Methods</h3>
                <div className="space-y-3">
                  {paymentMethods.map((pm: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold text-gray-900 dark:text-white">{pm.method}</span>
                      </div>
                      {pm.account_name && (
                        <p className="text-[12px] text-gray-500">Account: {pm.account_name}</p>
                      )}
                      {pm.account_number && (
                        <p className="text-[12px] text-gray-500">Number: {pm.account_number}</p>
                      )}
                      {pm.instructions && (
                        <p className="text-[12px] text-gray-400 mt-1">{pm.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fee Card */}
            <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3">Pricing</h3>
              <div className="space-y-1">
                {formatFee(service.joining_fee, "Joining Fee")}
                {formatFee(service.monthly_fee, "Monthly Fee")}
                {formatFee(service.per_session_fee, "Per Session")}
                {!service.joining_fee && !service.monthly_fee && !service.per_session_fee && (
                  <p className="text-[14px] font-bold text-green-600">Free</p>
                )}
              </div>
              <p className="text-[12px] text-gray-400 mt-2">Currency: {service.currency || "BDT"}</p>
            </div>

            {/* Teacher Card */}
            {teacher && (
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Teacher</h3>
                <Link href={`/${teacher.id}`} className="flex items-center gap-3 group">
                  <Avatar className="size-12">
                    {teacher.avatar?.key ? (
                      <img src={getCloudinaryUrl(teacher.avatar.key, { w: 96, h: 96 })} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <AvatarFallback className="text-[14px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0066FF]">
                        {getInitials(teacher.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white group-hover:text-[#0066FF] transition-colors">
                      {teacher.full_name}
                    </p>
                    <p className="text-[12px] text-gray-400">View Profile</p>
                  </div>
                </Link>

                <Link href={`/feed`}>
                  <Button className="mt-4 w-full rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white h-10 text-[13px] font-semibold shadow-lg shadow-blue-500/20">
                    <MessageSquare className="size-4 mr-2" />
                    Message Teacher
                  </Button>
                </Link>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3">Quick Info</h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="size-4 text-green-500 shrink-0" />
                  <span>{service.format === "BATCH" ? "Group Classes" : service.format === "INDIVIDUAL" ? "1-on-1 Tutoring" : "Home Tutoring"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="size-4 text-green-500 shrink-0" />
                  <span>{service.mode === "ONLINE" ? "Online Classes" : service.mode === "OFFLINE" ? "In-Person Classes" : "Online + In-Person"}</span>
                </div>
                {batches.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="size-4 text-green-500 shrink-0" />
                    <span>{batches.length} batch{batches.length !== 1 ? "es" : ""} available</span>
                  </div>
                )}
                {subjects.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="size-4 text-green-500 shrink-0" />
                    <span>{subjects.length} subject{subjects.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
