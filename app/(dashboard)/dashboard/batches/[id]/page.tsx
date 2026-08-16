"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBatchDetails, getBatchEnrollments } from "@/lib/actions/classroom";
import { Calendar, Clock, MapPin, Users, Loader2 } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";

const DAY_LABELS: Record<string, string> = {
  SATURDAY: "Sat", SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue",
  WEDNESDAY: "Wed", THURSDAY: "Thu", FRIDAY: "Fri",
};

export default function BatchOverviewTab() {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBatchDetails(id),
      getBatchEnrollments(id),
    ]).then(([batchRes, enrollRes]) => {
      if (batchRes.success) setBatch(batchRes.data);
      if (enrollRes.success) setEnrollments(enrollRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  if (!batch) {
    return <p className="text-gray-500 text-center py-16">Batch not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      {batch.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{batch.description}</p>
        </div>
      )}

      {/* Weekly Schedule */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Weekly Schedule</h3>
        {batch.schedule?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {batch.schedule.map((s: any) => (
              <div key={s.day} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="size-9 rounded-lg bg-[#0066FF]/10 flex items-center justify-center">
                  <Calendar className="size-4 text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {DAY_LABELS[s.day] || s.day}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="size-3" /> {s.start_time} – {s.end_time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No schedule set yet.</p>
        )}
      </div>

      {/* Enrolled Students */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="size-4 text-[#0066FF]" />
          Enrolled Students ({enrollments.length})
        </h3>
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enrollments
              .filter((e: any) => e.status === "APPROVED")
              .map((enrollment: any) => (
              <div key={enrollment.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                {enrollment.student?.user?.avatar?.key ? (
                  <img
                    src={getCloudinaryUrl(enrollment.student.user.avatar.key, { w: 40, h: 40 })}
                    className="size-9 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xs font-bold">
                    {enrollment.student?.user?.full_name?.charAt(0) ?? "?"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {enrollment.student?.user?.full_name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Joined {enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : "—"}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  enrollment.status === "APPROVED" 
                    ? "bg-green-50 text-green-600" 
                    : "bg-amber-50 text-amber-600"
                }`}>
                  {enrollment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No students enrolled yet.</p>
        )}
      </div>
    </div>
  );
}
