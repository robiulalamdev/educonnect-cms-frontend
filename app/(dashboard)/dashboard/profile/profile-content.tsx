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
  Check, X, Save, RotateCcw,
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
  const [showLocation, setShowLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    const fd = new FormData();
    fd.append("avatar", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    startAvatarTransition(async () => { await uploadAvatarAction(null, fd); });
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    fd.set("country", country);
    fd.set("state", stateVal);
    fd.set("city", city);
    fd.set("area", area);
    fd.set("address_line", addressLine);
    startSaveTransition(async () => {
      const result = await updateProfileAction(null, fd);
      if (result?.success) { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 2000); }
      else if (result?.error) setSaveError(result.error);
    });
  }

  function handleReset() {
    formRef.current?.reset();
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

  const inputCls = "rounded-xl h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20 text-sm";

  return (
    <>
      <div className="flex gap-6 min-h-0">
        {/* Left — Avatar Card (compact) */}
        <Card className="w-[280px] shrink-0 p-0 border border-gray-200/80 dark:border-gray-800/80 rounded-[20px] bg-white dark:bg-[#16161D] overflow-hidden">
          <div className="relative h-20 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="size-[80px] rounded-full overflow-hidden ring-4 ring-white dark:ring-[#16161D]">
                  {avatarUrl
                    ? <img src={avatarUrl} alt={user.full_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#3B82F6]"><span className="text-2xl font-bold text-white">{initials}</span></div>
                  }
                </div>
                <div className="absolute bottom-0 right-0 size-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#16161D]">
                  {isUploadingAvatar ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />}
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="pt-12 px-4 text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{username}</p>
            <div className="mt-2"><span className="inline-flex items-center rounded-full bg-[#0066FF]/10 px-3 py-1 text-[11px] font-semibold text-[#0066FF]">{user.role}</span></div>
          </div>

          <div className="px-4 pb-4 pt-3 space-y-2">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex size-7 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600"><Mail className="size-3.5" /></div>
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex size-7 items-center justify-center rounded-md bg-green-50 dark:bg-green-950/50 text-green-600"><Phone className="size-3.5" /></div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">{user.phone || "Not set"}</p>
            </div>
          </div>
        </Card>

        {/* Right — Form (compact, no scroll) */}
        <Card className="flex-1 min-w-0 border border-gray-200/80 dark:border-gray-800/80 rounded-[20px] bg-white dark:bg-[#16161D]">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600"><User className="size-4" /></div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Update your details</p>
                </div>
              </div>
              {saveError && <p className="text-xs text-red-500">{saveError}</p>}
              {saveSuccess && <p className="text-xs text-green-500">Saved!</p>}
            </div>

            <form ref={formRef} onSubmit={handleSave} className="space-y-3">
              {/* Row 1: Name + Username */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><User className="size-3" /> Full Name</Label>
                  <Input name="full_name" defaultValue={user.full_name} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><AtSign className="size-3" /> Username</Label>
                  <div className="relative">
                    <Input value={username} onChange={(e) => handleUsernameChange(e.target.value)} placeholder="unique-username" className={`${inputCls} pr-8`} />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && <Loader2 className="size-3.5 text-gray-400 animate-spin" />}
                      {usernameStatus === "available" && <Check className="size-3.5 text-green-500" />}
                      {usernameStatus === "taken" && <X className="size-3.5 text-red-500" />}
                    </div>
                  </div>
                  {usernameStatus === "taken" && <p className="text-[10px] text-red-500">Taken</p>}
                  {usernameStatus === "available" && <p className="text-[10px] text-green-500">Available</p>}
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><Mail className="size-3" /> Email</Label>
                  <Input defaultValue={user.email} disabled className={`${inputCls} opacity-60`} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><Phone className="size-3" /> Phone</Label>
                  <Input name="phone" defaultValue={user.phone || ""} placeholder="+880 1XXXXXXXXX" className={inputCls} />
                </div>
              </div>

              {/* Row 3: Bio */}
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><FileText className="size-3" /> Bio</Label>
                <textarea name="bio" defaultValue={user.bio || ""} placeholder="Tell us about yourself" rows={2} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] resize-none" />
              </div>

              {/* Location Toggle */}
              <div>
                <button type="button" onClick={() => setShowLocation(!showLocation)} className="flex items-center gap-2 text-xs font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {showLocation ? "Hide Location" : "Set Location"}
                  {(country || stateVal || city) && !showLocation && (
                    <span className="text-[10px] text-gray-400 font-normal ml-1">
                      {[country, stateVal, city].filter(Boolean).join(", ")}
                    </span>
                  )}
                </button>
              </div>

              {/* Location (collapsible) */}
              {showLocation && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3">
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
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button type="button" variant="outline" className="rounded-lg px-4 h-9 text-xs" onClick={handleReset}>
                  <RotateCcw className="mr-1.5 size-3" /> Reset
                </Button>
                <Button type="submit" className="rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 h-9 text-xs shadow-md shadow-blue-500/20 disabled:opacity-50" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-1.5 size-3 animate-spin" /> : <Save className="mr-1.5 size-3" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>

      {showCrop && rawImage && (
        <ImageCropModal open={showCrop} imageSrc={rawImage} onClose={() => { setShowCrop(false); setRawImage(null); }} onCrop={handleCropComplete} />
      )}
    </>
  );
}
