"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/contexts/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCalendarEventsAction } from "@/lib/actions/calendar";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Calendar, Loader2, Clock, MapPin, Video } from "lucide-react";

interface CalendarEvent {
  id: string;
  class_date: string;
  start_time: string;
  end_time: string;
  status: string;
  reason?: string;
  batch: {
    id: string;
    name: string;
    service: {
      title: string;
      mode: string;
    };
  };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: "Scheduled", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  COMPLETED: { label: "Completed", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-200 line-through" },
  EXTRA: { label: "Extra Class", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  RESCHEDULED: { label: "Rescheduled", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function CalendarContent() {
  const user = useUser();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = new Date(year, month, 1).toISOString().split("T")[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
      
      const res = await getCalendarEventsAction(startDate, endDate);
      if (res.success) {
        setEvents(res.data || []);
      } else {
        toast.error(res.error || "Failed to load calendar events");
      }
    } catch {
      toast.error("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const getDaysInMonth = () => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = () => new Date(year, month, 1).getDay();

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.class_date.startsWith(dateStr));
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user?.role === "TEACHER" ? "View and manage your class schedule" : "View your class schedule"}
        </p>
      </div>

      {/* Month Navigation */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {MONTHS[month]} {year}
            </h2>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigateMonth(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = isCurrentMonth && today.getDate() === day;
              const isSelected = selectedDate === `${year}-${month}-${day}`;
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : `${year}-${month}-${day}`)}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-start transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isToday
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className={`text-sm ${isSelected ? "text-white" : ""}`}>{day}</span>
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, idx) => {
                        const config = statusConfig[e.status] || statusConfig.SCHEDULED;
                        return (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-white" : e.status === "CANCELLED" ? "bg-red-400" : e.status === "EXTRA" ? "bg-purple-400" : "bg-blue-400"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-blue-600" />
              </div>
            ) : (() => {
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate.split("-")[2]).padStart(2, "0")}`;
              const dayEvents = events.filter((e) => e.class_date.startsWith(dateStr));

              if (dayEvents.length === 0) {
                return (
                  <div className="text-center py-8">
                    <Calendar className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">No classes scheduled</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {dayEvents.map((event) => {
                    const config = statusConfig[event.status] || statusConfig.SCHEDULED;
                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-xl border ${config.bg}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm font-semibold ${config.color}`}>
                              {event.batch.service.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              {event.batch.name}
                            </p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {event.start_time} - {event.end_time}
                          </span>
                          <span className="flex items-center gap-1">
                            {event.batch.service.mode === "ONLINE" ? (
                              <><Video className="size-3" /> Online</>
                            ) : (
                              <><MapPin className="size-3" /> Offline</>
                            )}
                          </span>
                        </div>
                        {event.reason && (
                          <p className="text-xs text-gray-500 mt-2 italic">Reason: {event.reason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-xs">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  key === "CANCELLED" ? "bg-red-400" : key === "EXTRA" ? "bg-purple-400" : key === "RESCHEDULED" ? "bg-amber-400" : "bg-blue-400"
                }`} />
                <span className="text-gray-600 dark:text-gray-400">{config.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
