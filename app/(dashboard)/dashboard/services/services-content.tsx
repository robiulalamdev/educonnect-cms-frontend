"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyServices, createServiceAction, updateServiceAction } from "@/lib/actions/services";
import { getSubjects, getLevels } from "@/lib/actions/education";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/location/location-picker";
import {
  Search, Plus, Pencil, Loader2, BookOpen, Globe, MapPin, DollarSign,
  ChevronLeft, ChevronRight, X, Check,
} from "lucide-react";

interface Service {
  id: string; title: string; description: string; format: string; mode: string; status: string;
  country?: string; city?: string; area?: string; meeting_link?: string;
  joining_fee?: number; monthly_fee?: number; per_session_fee?: number; currency?: string;
  average_rating?: number; total_reviews?: number; created_at: string;
  subjects?: Array<{ subject: { id: string; name: string } }>;
  levels?: Array<{ level: { id: string; name: string } }>;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-[#F0FDF4] text-[#22C55E]",
  DRAFT: "bg-[#FFFBEB] text-[#F59E0B]",
  PAUSED: "bg-[#FFF7ED] text-[#F97316]",
  CLOSED: "bg-[#F3F4F6] text-[#6B7280]",
};

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
  const [subjects, setSubjects] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [showLocation, setShowLocation] = useState(false);
  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");

  const loadServices = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getMyServices(p, 10)) as any;
      if (res.success) {
        let filtered = res.data;
        if (search) filtered = filtered.filter((s: Service) => s.title.toLowerCase().includes(search.toLowerCase()));
        setServices(filtered);
        setMeta(res.meta);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { loadServices(page); }, [page, loadServices]);

  useEffect(() => {
    Promise.all([getSubjects(), getLevels()]).then(([s, l]) => {
      setSubjects(s);
      setLevels(l);
    });
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    formData.set("subject_ids", JSON.stringify(selectedSubjects));
    formData.set("level_ids", JSON.stringify(selectedLevels));
    formData.set("country", country);
    formData.set("state", stateVal);
    formData.set("city", city);
    formData.set("area", area);
    formData.set("address_line", addressLine);
    const result = await createServiceAction(null, formData);
    setCreating(false);
    if (result.success) { setShowCreateModal(false); loadServices(1); setPage(1); setSelectedSubjects([]); setSelectedLevels([]); setShowLocation(false); setCountry(""); setStateVal(""); setCity(""); setArea(""); setAddressLine(""); }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingService) return;
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateServiceAction(editingService.id, null, formData);
    setUpdating(false);
    if (result.success) { setEditingService(null); loadServices(page); }
  }

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function toggleLevel(id: string) {
    setSelectedLevels((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">My Services</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Manage your coaching services</p>
        </div>
        <Button className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20 px-5" onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 size-4" /> New Service
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
        <Input placeholder="Search services..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10 h-10 rounded-full bg-[#F3F4F6] dark:bg-gray-800 border-0 text-sm" />
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-6 animate-pulse"><div className="h-4 w-48 bg-[#F3F4F6] dark:bg-gray-800 rounded-full mb-3" /><div className="h-3 w-full bg-[#F3F4F6] dark:bg-gray-800 rounded-full mb-2" /><div className="h-3 w-3/4 bg-[#F3F4F6] dark:bg-gray-800 rounded-full" /></div>)}</div>
      ) : services.length === 0 ? (
        <EmptyState onAdd={() => setShowCreateModal(true)} />
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="group border border-[#E5E7EB] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[service.status] || ""}`}>{service.status}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] dark:bg-blue-950/50 px-2.5 py-0.5 text-[11px] font-medium text-[#2563EB] dark:text-blue-400"><Globe className="size-3" />{service.mode}</span>
                      <span className="inline-flex items-center rounded-full bg-[#FAF5FF] dark:bg-purple-950/50 px-2.5 py-0.5 text-[11px] font-medium text-[#9333EA] dark:text-purple-400">{service.format}</span>
                    </div>
                    <h3 className="text-[17px] font-semibold text-[#111827] dark:text-white">{service.title}</h3>
                    <p className="mt-1 text-[14px] text-[#6B7280] line-clamp-2 leading-relaxed">{service.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-[#9CA3AF]">
                      {service.city && <span className="flex items-center gap-1"><MapPin className="size-3" />{service.city}{service.area ? `, ${service.area}` : ""}</span>}
                      {service.monthly_fee && <span className="flex items-center gap-1"><DollarSign className="size-3" />{service.currency || "BDT"} {service.monthly_fee}/mo</span>}
                      {service.average_rating ? <span className="flex items-center gap-1"><span className="text-[#F59E0B]">★</span>{service.average_rating.toFixed(1)}</span> : null}
                    </div>
                    {service.subjects && service.subjects.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {service.subjects.map((s) => (
                          <span key={s.subject.id} className="rounded-full bg-[#EFF6FF] dark:bg-blue-950/50 px-2.5 py-0.5 text-[11px] font-medium text-[#2563EB] dark:text-blue-400">{s.subject.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="size-9 rounded-full text-[#9CA3AF] hover:text-[#2563EB] opacity-0 group-hover:opacity-100 transition-all" onClick={() => {
                    setEditingService(service);
                    setCountry(service.country || "");
                    setStateVal("");
                    setCity(service.city || "");
                    setArea(service.area || "");
                    setAddressLine("");
                    setShowLocation(!!service.city);
                  }}>
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm text-[#6B7280]">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}><ChevronRight className="size-4" /></Button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCreateModal(false)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] bg-white dark:bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between rounded-t-[24px] z-10">
              <h2 className="text-lg font-bold text-[#111827] dark:text-white">Create Service</h2>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setShowCreateModal(false)}><X className="size-4" /></Button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Title</Label>
                <Input name="title" required placeholder="e.g. Math Tutoring for Class 10" className="rounded-full h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Description</Label>
                <textarea name="description" required rows={3} placeholder="Describe your coaching service..." className="w-full rounded-[16px] border border-[#E5E7EB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Format</Label>
                  <select name="format" required className="w-full rounded-full h-11 border border-[#E5E7EB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                    <option value="BATCH">Batch</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="HOME_PRIVATE">Home Private</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Mode</Label>
                  <select name="mode" required className="w-full rounded-full h-11 border border-[#E5E7EB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Subjects</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {subjects.map((s: any) => (
                    <button key={s.id} type="button" onClick={() => toggleSubject(s.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium border transition-all ${
                        selectedSubjects.includes(s.id)
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white dark:bg-gray-800 text-[#374151] dark:text-gray-300 border-[#E5E7EB] dark:border-gray-700 hover:border-[#2563EB]/50"
                      }`}>
                      {selectedSubjects.includes(s.id) && <Check className="size-3" />}
                      {s.name}
                    </button>
                  ))}
                  {subjects.length === 0 && <p className="text-sm text-[#9CA3AF]">Loading subjects...</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Levels</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {levels.map((l: any) => (
                    <button key={l.id} type="button" onClick={() => toggleLevel(l.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium border transition-all ${
                        selectedLevels.includes(l.id)
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white dark:bg-gray-800 text-[#374151] dark:text-gray-300 border-[#E5E7EB] dark:border-gray-700 hover:border-[#2563EB]/50"
                      }`}>
                      {selectedLevels.includes(l.id) && <Check className="size-3" />}
                      {l.name}
                    </button>
                  ))}
                  {levels.length === 0 && <p className="text-sm text-[#9CA3AF]">Loading levels...</p>}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Location <span className="text-gray-400 font-normal">(optional)</span></Label>
                  <button type="button" onClick={() => setShowLocation(!showLocation)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${showLocation ? "bg-[#2563EB] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                    <MapPin className="size-3" /> {showLocation ? "Location Set" : "Set Location"}
                  </button>
                </div>
                {showLocation && (
                  <div className="rounded-2xl border border-[#E5E7EB] dark:border-gray-700 p-4">
                    <LocationPicker country={country} state={stateVal} city={city} area={area} addressLine={addressLine}
                      onCountryChange={setCountry} onStateChange={setStateVal} onCityChange={setCity} onAreaChange={setArea} onAddressLineChange={setAddressLine} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Joining Fee</Label>
                  <Input name="joining_fee" type="number" placeholder="0" className="rounded-full h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Monthly Fee</Label>
                  <Input name="monthly_fee" type="number" placeholder="0" className="rounded-full h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#374151] dark:text-gray-300">Per Session</Label>
                  <Input name="per_session_fee" type="number" placeholder="0" className="rounded-full h-11" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-full px-5" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6" disabled={creating}>
                  {creating ? <><Loader2 className="mr-2 size-4 animate-spin" /> Creating...</> : "Create Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setEditingService(null)}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[24px] bg-white dark:bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-between rounded-t-[24px] z-10">
              <h2 className="text-lg font-bold text-[#111827] dark:text-white">Edit Service</h2>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setEditingService(null)}><X className="size-4" /></Button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium">Title</Label>
                <Input name="title" defaultValue={editingService.title} required className="rounded-full h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium">Description</Label>
                <textarea name="description" defaultValue={editingService.description} required rows={3} className="w-full rounded-[16px] border border-[#E5E7EB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium">Status</Label>
                <select name="status" defaultValue={editingService.status} className="w-full rounded-full h-11 border border-[#E5E7EB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[13px] font-medium">Location <span className="text-gray-400 font-normal">(optional)</span></Label>
                  <button type="button" onClick={() => setShowLocation(!showLocation)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${showLocation ? "bg-[#2563EB] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                    <MapPin className="size-3" /> {showLocation ? "Location Set" : "Set Location"}
                  </button>
                </div>
                {showLocation && (
                  <div className="rounded-2xl border border-[#E5E7EB] dark:border-gray-700 p-4">
                    <LocationPicker country={country} state={stateVal} city={city} area={area} addressLine={addressLine}
                      onCountryChange={setCountry} onStateChange={setStateVal} onCityChange={setCity} onAreaChange={setArea} onAddressLineChange={setAddressLine} />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-full px-5" onClick={() => setEditingService(null)}>Cancel</Button>
                <Button type="submit" className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6" disabled={updating}>
                  {updating ? <><Loader2 className="mr-2 size-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-16 text-center">
      <BookOpen className="size-12 text-[#D1D5DB] dark:text-gray-700 mx-auto" />
      <h3 className="mt-4 text-[17px] font-semibold text-[#111827] dark:text-white">No services yet</h3>
      <p className="mt-2 text-[15px] text-[#6B7280]">Create your first coaching service to get started.</p>
      <Button className="mt-6 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6" onClick={onAdd}>
        <Plus className="mr-2 size-4" /> Create Service
      </Button>
    </div>
  );
}
