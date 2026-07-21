"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAttendanceList, getBatchEnrollments, markBulkAttendance } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, XCircle, Clock, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export default function BatchAttendanceTab() {
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const isTeacher = user?.role === "TEACHER";

  const [attendance, setAttendance] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [markMap, setMarkMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      getAttendanceList(id),
      getBatchEnrollments(id),
    ]).then(([attRes, enrRes]) => {
      if (attRes.success) setAttendance(attRes.data);
      if (enrRes.success) {
        const approved = enrRes.data.filter((e: any) => e.status === "APPROVED");
        setEnrollments(approved);
        // Initialize mark map
        const map: Record<string, string> = {};
        approved.forEach((e: any) => { map[e.student_profile_id] = "PRESENT"; });
        setMarkMap(map);
      }
      setLoading(false);
    });
  }, [id]);

  const handleMarkAll = async () => {
    setSaving(true);
    const records = Object.entries(markMap).map(([student_profile_id, status]) => ({
      student_profile_id,
      status,
    }));
    const res = await markBulkAttendance(id, records, selectedDate);
    if (res.success) {
      toast.success("Attendance marked successfully!");
      // Refresh
      const attRes = await getAttendanceList(id);
      if (attRes.success) setAttendance(attRes.data);
    } else {
      toast.error(res.message || "Failed to mark attendance");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Teacher: Mark Attendance */}
      {isTeacher && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="size-4 text-[#0066FF]" />
              Mark Attendance
            </h3>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto h-9 rounded-lg text-sm"
            />
          </div>

          {enrollments.length === 0 ? (
            <p className="text-sm text-gray-400">No approved students to mark.</p>
          ) : (
            <div className="space-y-2">
              {enrollments.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xs font-bold">
                      {enrollment.student?.user?.full_name?.charAt(0) ?? "?"}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {enrollment.student?.user?.full_name}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {["PRESENT", "ABSENT", "LATE"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setMarkMap((prev) => ({ ...prev, [enrollment.student_profile_id]: status }))}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          markMap[enrollment.student_profile_id] === status
                            ? status === "PRESENT"
                              ? "bg-green-500 text-white"
                              : status === "ABSENT"
                                ? "bg-red-500 text-white"
                                : "bg-amber-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleMarkAll}
                disabled={saving}
                className="mt-4 bg-[#0066FF] hover:bg-blue-600 text-white font-semibold h-10 rounded-xl w-full sm:w-auto"
              >
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save Attendance for {selectedDate}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Records</h3>
        {attendance.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardIcon />
            <p className="text-gray-500 text-sm mt-3">No attendance records yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attendance.map((record: any) => (
              <div key={record.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                <div className="flex items-center gap-3">
                  <StatusIcon status={record.status} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(record.class_date).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {record.note && (
                      <p className="text-[11px] text-gray-500">{record.note}</p>
                    )}
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  record.status === "PRESENT" ? "bg-green-50 text-green-600"
                    : record.status === "ABSENT" ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-600"
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "PRESENT") return <CheckCircle2 className="size-5 text-green-500" />;
  if (status === "ABSENT") return <XCircle className="size-5 text-red-500" />;
  return <Clock className="size-5 text-amber-500" />;
}

function ClipboardIcon() {
  return (
    <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
      <CalendarDays className="size-7 text-gray-400" />
    </div>
  );
}
