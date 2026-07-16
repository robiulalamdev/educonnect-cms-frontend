"use client";

import { useState, useRef, useCallback, useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageCropModal } from "@/components/social/image-crop-modal";
import { uploadAvatarAction } from "@/lib/actions/auth";
import { Loader2, Camera, User, Mail, Phone, MapPin, FileText, AtSign, Check, X, Save } from "lucide-react";

interface ProfileFormProps { user: any; }

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [username, setUsername] = useState(user.email?.split("@")[0] || "");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarState, avatarFormAction] = useActionState(uploadAvatarAction, {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const initials = user.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarUrl = avatarPreview || avatarState?.avatarUrl || (user.avatar?.key
    ? `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${user.avatar.key}`
    : null);

  function handleAvatarClick() { fileInputRef.current?.click(); }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) { setRawImage(URL.createObjectURL(file)); setShowCrop(true); }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleCropComplete = useCallback(async (blob: Blob) => {
    setAvatarPreview(URL.createObjectURL(blob));
    setShowCrop(false);
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      avatarFormAction(formData);
    } catch (err) { console.error(err); }
    finally { setUploadingAvatar(false); }
  }, [avatarFormAction]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      // Collect form data
      const form = formRef.current;
      if (!form) return;
      const formData = new FormData(form);

      const res = await fetch("/api/v1/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.get("full_name"),
          phone: formData.get("phone"),
          bio: formData.get("bio"),
          city: formData.get("city"),
          area: formData.get("area"),
          country: formData.get("country"),
        }),
        credentials: "include",
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  function handleUsernameChange(value: string) {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(clean);
    if (clean.length < 3) { setUsernameStatus("idle"); return; }
    setUsernameStatus("checking");
    clearTimeout((window as any).__usernameTimeout);
    (window as any).__usernameTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/user/?search=${clean}`, { credentials: "include" });
        const data = await res.json();
        const taken = data.data?.some((u: any) => u.email?.split("@")[0] === clean && u.id !== user.id);
        setUsernameStatus(taken ? "taken" : "available");
      } catch { setUsernameStatus("idle"); }
    }, 500);
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px] bg-white dark:bg-gray-900">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block group cursor-pointer" onClick={handleAvatarClick}>
              <div className="size-28 rounded-full overflow-hidden ring-4 ring-[#EFF6FF] dark:ring-blue-950/50">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#3B82F6]">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadingAvatar ? <Loader2 className="size-6 text-white animate-spin" /> : <Camera className="size-6 text-white" />}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h3>
            <p className="mt-1 text-sm text-gray-500">@{username}</p>
            <div className="mt-4"><span className="inline-flex items-center rounded-full bg-[#0066FF]/10 px-4 py-1.5 text-xs font-semibold text-[#0066FF]">{user.role}</span></div>
            {uploadingAvatar && <p className="mt-3 text-xs text-gray-400 flex items-center justify-center gap-1"><Loader2 className="size-3 animate-spin" /> Uploading...</p>}
            {avatarState?.error && <p className="mt-2 text-xs text-red-500">{avatarState.error}</p>}
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 rounded-[24px] bg-white dark:bg-gray-900">
          <CardHeader className="pb-4"><CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</CardTitle></CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><User className="size-3.5" /> Full Name</Label><Input name="full_name" defaultValue={user.full_name} className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><AtSign className="size-3.5" /> Username</Label>
                  <div className="relative">
                    <Input value={username} onChange={(e) => handleUsernameChange(e.target.value)} placeholder="unique-username" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20 pr-10" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{usernameStatus === "checking" && <Loader2 className="size-4 text-gray-400 animate-spin" />}{usernameStatus === "available" && <Check className="size-4 text-green-500" />}{usernameStatus === "taken" && <X className="size-4 text-red-500" />}</div>
                  </div>
                  {usernameStatus === "taken" && <p className="text-xs text-red-500">Username already taken</p>}
                  {usernameStatus === "available" && <p className="text-xs text-green-500">Username available</p>}
                </div>
                <div className="space-y-2"><Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><Mail className="size-3.5" /> Email</Label><Input defaultValue={user.email} disabled className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><Phone className="size-3.5" /> Phone</Label><Input name="phone" defaultValue={user.phone || ""} placeholder="+880 1XXXXXXXXX" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
              </div>
              <div className="space-y-2"><Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><FileText className="size-3.5" /> Bio</Label><textarea name="bio" defaultValue={user.bio || ""} placeholder="Tell us about yourself" rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] resize-none" /></div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2"><Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><MapPin className="size-3.5" /> City</Label><Input name="city" defaultValue={user.city || ""} placeholder="Dhaka" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
                <div className="space-y-2"><Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Area</Label><Input name="area" defaultValue={user.area || ""} placeholder="Dhanmondi" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
                <div className="space-y-2"><Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Country</Label><Input name="country" defaultValue={user.country || ""} placeholder="Bangladesh" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 h-11 shadow-lg shadow-blue-500/20 disabled:opacity-50" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : saved ? <Check className="mr-2 size-4" /> : <Save className="mr-2 size-4" />}
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {showCrop && rawImage && <ImageCropModal open={showCrop} imageSrc={rawImage} onClose={() => { setShowCrop(false); setRawImage(null); }} onCrop={handleCropComplete} />}
    </>
  );
}
