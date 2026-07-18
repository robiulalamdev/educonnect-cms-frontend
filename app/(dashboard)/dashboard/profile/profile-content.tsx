"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageCropModal } from "@/components/social/image-crop-modal";
import { uploadAvatarAction, updateProfileAction } from "@/lib/actions/auth";
import { LocationPicker } from "@/components/location/location-picker";
import {
  Loader2, Camera, User, Mail, Phone, FileText, AtSign,
  Check, X, Save, RotateCcw, BookOpen, CheckCircle, Award, Calendar,
} from "lucide-react";

interface ProfileContentProps { user: any; }

export function ProfileContent({ user }: ProfileContentProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [username, setUsername] = useState(user.email?.split("@")[0] || "");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [isUploadingAvatar, startAvatarTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Location state
  const [country, setCountry] = useState(user.country || "");
  const [stateVal, setStateVal] = useState(user.state || "");
  const [city, setCity] = useState(user.city || "");
  const [area, setArea] = useState(user.area || "");
  const [addressLine, setAddressLine] = useState(user.address_line || "");

  const initials = user.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarUrl = avatarPreview || (user.avatar?.key
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
    const formData = new FormData();
    formData.append("avatar", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    startAvatarTransition(async () => { await uploadAvatarAction(null, formData); });
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    formData.set("country", country);
    formData.set("state", stateVal);
    formData.set("city", city);
    formData.set("area", area);
    formData.set("address_line", addressLine);
    startSaveTransition(async () => {
      const result = await updateProfileAction(null, formData);
      if (result?.success) { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 2000); }
      else if (result?.error) setSaveError(result.error);
    });
  }

  function handleReset() {
    if (formRef.current) formRef.current.reset();
    setUsername(user.email?.split("@")[0] || "");
    setUsernameStatus("idle");
    setCountry(user.country || "");
    setStateVal(user.state || "");
    setCity(user.city || "");
    setArea(user.area || "");
    setAddressLine(user.address_line || "");
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

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const inputCls = "rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20";

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left — Avatar & Info Card */}
        <Card className="p-0 border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D] overflow-hidden">
          <div className="relative h-24 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="size-[96px] rounded-full overflow-hidden ring-4 ring-white dark:ring-[#16161D]">
                  {avatarUrl
                    ? <img src={avatarUrl} alt={user.full_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#3B82F6]"><span className="text-3xl font-bold text-white">{initials}</span></div>
                  }
                </div>
                <div className="absolute bottom-1 right-1 size-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#16161D]">
                  {isUploadingAvatar ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="pt-14 px-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{username}</p>
            <div className="mt-3"><span className="inline-flex items-center rounded-full bg-[#0066FF]/10 px-4 py-1.5 text-xs font-semibold text-[#0066FF]">{user.role}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-4 px-6 py-5 mt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 mx-auto mb-1.5"><BookOpen className="size-4 text-blue-600" /></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-[11px] text-gray-500">Courses</p>
            </div>
            <div className="text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50 mx-auto mb-1.5"><CheckCircle className="size-4 text-green-600" /></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">28</p>
              <p className="text-[11px] text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50 mx-auto mb-1.5"><Award className="size-4 text-amber-600" /></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-[11px] text-gray-500">Certificates</p>
            </div>
          </div>

          <div className="px-6 pb-4 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600"><Mail className="size-4" /></div>
              <div><p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p><p className="text-[11px] text-gray-500">Email Address</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600"><Phone className="size-4" /></div>
              <div><p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone || "Not set"}</p><p className="text-[11px] text-gray-500">Phone Number</p></div>
            </div>
          </div>

          <div className="px-6 pb-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Calendar className="size-3" /><span>Member since {memberSince}</span>
            </div>
          </div>
        </Card>

        {/* Right — Form */}
        <div className="space-y-6">
          {/* Personal Info Card */}
          <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"><User className="size-4.5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Update your personal details and contact information</p>
                </div>
              </div>

              {saveError && <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600">{saveError}</div>}
              {saveSuccess && <div className="mb-4 rounded-xl bg-green-50 dark:bg-green-950/30 p-3 text-sm text-green-600">Profile updated successfully!</div>}

              <form ref={formRef} onSubmit={handleSave} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><User className="size-3.5" /> Full Name</Label>
                    <Input name="full_name" defaultValue={user.full_name} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><AtSign className="size-3.5" /> Username</Label>
                    <div className="relative">
                      <Input value={username} onChange={(e) => handleUsernameChange(e.target.value)} placeholder="unique-username" className={`${inputCls} pr-10`} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus === "checking" && <Loader2 className="size-4 text-gray-400 animate-spin" />}
                        {usernameStatus === "available" && <Check className="size-4 text-green-500" />}
                        {usernameStatus === "taken" && <X className="size-4 text-red-500" />}
                      </div>
                    </div>
                    {usernameStatus === "taken" && <p className="text-xs text-red-500">Username already taken</p>}
                    {usernameStatus === "available" && <p className="text-xs text-green-500">Username available</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><Mail className="size-3.5" /> Email</Label>
                    <Input defaultValue={user.email} disabled className={`${inputCls} opacity-60`} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><Phone className="size-3.5" /> Phone</Label>
                    <Input name="phone" defaultValue={user.phone || ""} placeholder="+880 1XXXXXXXXX" className={inputCls} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><FileText className="size-3.5" /> Bio</Label>
                  <textarea name="bio" defaultValue={user.bio || ""} placeholder="Tell us about yourself" rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] resize-none" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" className="rounded-xl px-5 h-10" onClick={handleReset}>
                    <RotateCcw className="mr-2 size-3.5" /> Reset
                  </Button>
                  <Button type="submit" className="rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 h-10 shadow-lg shadow-blue-500/20 disabled:opacity-50" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : <Save className="mr-2 size-3.5" />}
                    {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Location Card */}
          <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Location</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Set your location for service discovery</p>
                </div>
              </div>
              <LocationPicker
                country={country}
                state={stateVal}
                city={city}
                area={area}
                addressLine={addressLine}
                onCountryChange={setCountry}
                onStateChange={setStateVal}
                onCityChange={setCity}
                onAreaChange={setArea}
                onAddressLineChange={setAddressLine}
              />
            </div>
          </Card>
        </div>
      </div>

      {showCrop && rawImage && (
        <ImageCropModal open={showCrop} imageSrc={rawImage} onClose={() => { setShowCrop(false); setRawImage(null); }} onCrop={handleCropComplete} />
      )}
    </>
  );
}
