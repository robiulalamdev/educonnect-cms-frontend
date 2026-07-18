"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getEducationData,
  createLevelGroup,
  updateLevelGroup,
  deleteLevelGroup,
  createLevel,
  updateLevel,
  deleteLevel,
  createSubjectCategory,
  updateSubjectCategory,
  deleteSubjectCategory,
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/lib/actions/education-admin";
import {
  BookOpen, Layers, Folder, Plus, Pencil, Trash2, X, Loader2, ChevronDown, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface LevelGroup { id: string; name: string; sort_order: number; is_active: boolean; levels?: Level[] }
interface Level { id: string; group_id: string; name: string; sort_order: number; is_active: boolean }
interface SubjectCategory { id: string; name: string; is_active: boolean; subjects?: Subject[] }
interface Subject { id: string; category_id: string; name: string; is_active: boolean }

export function AdminEducationContent() {
  const [groups, setGroups] = useState<LevelGroup[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"levels" | "subjects">("levels");
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getEducationData();
    setGroups(data.groups);
    setLevels(data.levels);
    setCategories(data.categories);
    setSubjects(data.subjects);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function toggleGroup(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function getLevelsForGroup(groupId: string) {
    return levels.filter((l) => l.group_id === groupId);
  }

  function getSubjectsForCategory(catId: string) {
    return subjects.filter((s) => s.category_id === catId);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const group_id = formData.get("group_id") as string;
    const category_id = formData.get("category_id") as string;

    try {
      switch (modalType) {
        case "create-group":
          await createLevelGroup({ name });
          toast.success("Level group created");
          break;
        case "edit-group":
          await updateLevelGroup(editingItem.id, { name });
          toast.success("Level group updated");
          break;
        case "create-level":
          await createLevel({ group_id, name });
          toast.success("Level created");
          break;
        case "edit-level":
          await updateLevel(editingItem.id, { name });
          toast.success("Level updated");
          break;
        case "create-category":
          await createSubjectCategory({ name });
          toast.success("Category created");
          break;
        case "edit-category":
          await updateSubjectCategory(editingItem.id, { name });
          toast.success("Category updated");
          break;
        case "create-subject":
          await createSubject({ category_id, name });
          toast.success("Subject created");
          break;
        case "edit-subject":
          await updateSubject(editingItem.id, { name });
          toast.success("Subject updated");
          break;
      }
      setModalType(null);
      setEditingItem(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(type: string, id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      switch (type) {
        case "group": await deleteLevelGroup(id); toast.success("Level group deleted"); break;
        case "level": await deleteLevel(id); toast.success("Level deleted"); break;
        case "category": await deleteSubjectCategory(id); toast.success("Category deleted"); break;
        case "subject": await deleteSubject(id); toast.success("Subject deleted"); break;
      }
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Education Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage level groups, levels, subject categories and subjects</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["levels", "subjects"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {t === "levels" ? "Level Groups & Levels" : "Subject Categories & Subjects"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tab === "levels" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setModalType("create-group")}>
              <Plus className="mr-2 size-4" /> New Level Group
            </Button>
          </div>
          {groups.map((group) => (
            <Card key={group.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleGroup(group.id)} className="text-gray-400 hover:text-gray-600">
                    {expandedGroups.has(group.id) ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                  </button>
                  <Layers className="size-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{group.name}</p>
                    <p className="text-xs text-gray-500">{getLevelsForGroup(group.id).length} levels</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${group.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {group.is_active ? "Active" : "Inactive"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => { setEditingItem(group); setModalType("edit-group"); }}>
                      <Pencil className="size-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete("group", group.id)}>
                      <Trash2 className="size-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                {expandedGroups.has(group.id) && (
                  <div className="mt-4 ml-8 space-y-2">
                    {getLevelsForGroup(group.id).map((level) => (
                      <div key={level.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <BookOpen className="size-4 text-gray-400" />
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{level.name}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${level.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {level.is_active ? "Active" : "Inactive"}
                        </span>
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => { setEditingItem(level); setModalType("edit-level"); }}>
                          <Pencil className="size-3 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete("level", level.id)}>
                          <Trash2 className="size-3 text-red-400" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => { setEditingItem({ group_id: group.id }); setModalType("create-level"); }}>
                      <Plus className="mr-1 size-3" /> Add Level
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {groups.length === 0 && (
            <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-16 text-center">
                <Layers className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No level groups</h3>
                <p className="mt-2 text-sm text-gray-500">Create your first level group to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setModalType("create-category")}>
              <Plus className="mr-2 size-4" /> New Category
            </Button>
          </div>
          {categories.map((category) => (
            <Card key={category.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleCategory(category.id)} className="text-gray-400 hover:text-gray-600">
                    {expandedCategories.has(category.id) ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                  </button>
                  <Folder className="size-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{category.name}</p>
                    <p className="text-xs text-gray-500">{getSubjectsForCategory(category.id).length} subjects</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${category.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => { setEditingItem(category); setModalType("edit-category"); }}>
                      <Pencil className="size-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete("category", category.id)}>
                      <Trash2 className="size-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                {expandedCategories.has(category.id) && (
                  <div className="mt-4 ml-8 space-y-2">
                    {getSubjectsForCategory(category.id).map((subject) => (
                      <div key={subject.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <BookOpen className="size-4 text-gray-400" />
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{subject.name}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${subject.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {subject.is_active ? "Active" : "Inactive"}
                        </span>
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => { setEditingItem(subject); setModalType("edit-subject"); }}>
                          <Pencil className="size-3 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete("subject", subject.id)}>
                          <Trash2 className="size-3 text-red-400" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => { setEditingItem({ category_id: category.id }); setModalType("create-subject"); }}>
                      <Plus className="mr-1 size-3" /> Add Subject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {categories.length === 0 && (
            <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-16 text-center">
                <Folder className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No subject categories</h3>
                <p className="mt-2 text-sm text-gray-500">Create your first subject category to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setModalType(null); setEditingItem(null); }}>
          <div className="relative w-full max-w-md rounded-[24px] bg-white dark:bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {modalType.includes("edit") ? "Edit" : "Create"} {modalType.includes("group") ? "Level Group" : modalType.includes("level") ? "Level" : modalType.includes("category") ? "Category" : "Subject"}
              </h2>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => { setModalType(null); setEditingItem(null); }}><X className="size-4" /></Button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium">Name</Label>
                <Input name="name" defaultValue={editingItem?.name || ""} required placeholder="Enter name" className="rounded-full h-11" />
              </div>
              {modalType === "create-level" && (
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Level Group</Label>
                  <select name="group_id" defaultValue={editingItem?.group_id || ""} required className="w-full rounded-full h-11 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 text-sm">
                    <option value="">Select a group</option>
                    {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              )}
              {modalType === "create-subject" && (
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Category</Label>
                  <select name="category_id" defaultValue={editingItem?.category_id || ""} required className="w-full rounded-full h-11 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 text-sm">
                    <option value="">Select a category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-full px-5" onClick={() => { setModalType(null); setEditingItem(null); }}>Cancel</Button>
                <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 size-4 animate-spin" /> Saving...</> : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
