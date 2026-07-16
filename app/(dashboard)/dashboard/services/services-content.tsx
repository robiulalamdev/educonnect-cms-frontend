"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyServices, createServiceAction, updateServiceAction } from "@/lib/actions/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  Globe,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X,
  Pause,
  Play,
  AlertCircle,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  format: string;
  mode: string;
  status: string;
  country?: string;
  city?: string;
  area?: string;
  meeting_link?: string;
  joining_fee?: number;
  monthly_fee?: number;
  per_session_fee?: number;
  currency?: string;
  fee_note?: string;
  average_rating?: number;
  total_reviews?: number;
  created_at: string;
  subjects?: Array<{ subject: { id: string; name: string } }>;
  levels?: Array<{ level: { id: string; name: string } }>;
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE": return "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400";
    case "DRAFT": return "bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400";
    case "PAUSED": return "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400";
    case "CLOSED": return "bg-gray-100 dark:bg-gray-800 text-gray-500";
    default: return "bg-gray-100 dark:bg-gray-800 text-gray-500";
  }
}

function getModeIcon(mode: string) {
  switch (mode) {
    case "ONLINE": return Globe;
    case "OFFLINE": return MapPin;
    case "HYBRID": return Globe;
    default: return Globe;
  }
}

export function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadServices = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getMyServices(p, 10)) as any;
      if (res.success) {
        let filtered = res.data;
        if (search) {
          filtered = filtered.filter((s: Service) =>
            s.title.toLowerCase().includes(search.toLowerCase())
          );
        }
        setServices(filtered);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadServices(page);
  }, [page, loadServices]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const result = await createServiceAction(null, formData);
    setCreating(false);
    if (result.success) {
      setShowCreateModal(false);
      loadServices(1);
      setPage(1);
    } else if (result.error) {
      alert(result.error);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingService) return;
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateServiceAction(editingService.id, null, formData);
    setUpdating(false);
    if (result.success) {
      setEditingService(null);
      loadServices(page);
    } else if (result.error) {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Services</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create and manage your coaching services</p>
        </div>
        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20" onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 size-4" /> New Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input placeholder="Search services..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10 h-10 rounded-xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10" />
      </div>

      {/* Services List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
              <BookOpen className="size-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No services yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first coaching service to get started.</p>
            <Button className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 size-4" /> Create Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => {
            const ModeIcon = getModeIcon(service.mode);
            return (
              <Card key={service.id} className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          <ModeIcon className="size-3" />
                          {service.mode}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
                          {service.format}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.description}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                        {service.city && <span className="flex items-center gap-1"><MapPin className="size-3" />{service.city}{service.area ? `, ${service.area}` : ""}</span>}
                        {service.country && <span>{service.country}</span>}
                        {(service.joining_fee || service.monthly_fee || service.per_session_fee) && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="size-3" />
                            {service.monthly_fee ? `${service.currency || "BDT"} ${service.monthly_fee}/mo` :
                             service.per_session_fee ? `${service.currency || "BDT"} ${service.per_session_fee}/session` :
                             service.joining_fee ? `${service.currency || "BDT"} ${service.joining_fee} join` : ""}
                          </span>
                        )}
                        {service.average_rating ? (
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {service.average_rating?.toFixed(1)} ({service.total_reviews} reviews)
                          </span>
                        ) : null}
                      </div>

                      {service.subjects && service.subjects.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {service.subjects.map((s) => (
                            <span key={s.subject.id} className="rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                              {s.subject.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-blue-600" onClick={() => setEditingService(service)}>
                        <Pencil className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreateModal(false)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Service</h2>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setShowCreateModal(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" required placeholder="e.g. Math Tutoring for Class 10" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea name="description" required rows={3} placeholder="Describe your coaching service..." className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Format</Label>
                  <select name="format" required className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm">
                    <option value="BATCH">Batch</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="HOME_PRIVATE">Home Private</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <select name="mode" required className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm">
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="city" placeholder="e.g. Dhaka" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Input name="area" placeholder="e.g. Dhanmondi" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meeting Link (for online)</Label>
                <Input name="meeting_link" placeholder="https://meet.google.com/..." className="rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Joining Fee</Label>
                  <Input name="joining_fee" type="number" placeholder="0" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Fee</Label>
                  <Input name="monthly_fee" type="number" placeholder="0" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Per Session</Label>
                  <Input name="per_session_fee" type="number" placeholder="0" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject IDs (JSON array)</Label>
                <Input name="subject_ids" placeholder='["id1", "id2"]' className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Level IDs (JSON array)</Label>
                <Input name="level_ids" placeholder='["id1", "id2"]' className="rounded-xl" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white" disabled={creating}>
                  {creating ? <><Loader2 className="mr-2 size-4 animate-spin" /> Creating...</> : "Create Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditingService(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Service</h2>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditingService(null)}>
                <X className="size-4" />
              </Button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" defaultValue={editingService.title} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea name="description" defaultValue={editingService.description} required rows={3} className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select name="status" defaultValue={editingService.status} className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm">
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditingService(null)}>Cancel</Button>
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white" disabled={updating}>
                  {updating ? <><Loader2 className="mr-2 size-4 animate-spin" /> Updating...</> : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
