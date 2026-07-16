"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageCropModal } from "@/components/social/image-crop-modal";
import { Loader2, Camera, User, Mail, Phone, MapPin, FileText, AtSign } from "lucide-react";

interface ProfileFormProps { user: any; }

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = user.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  function handleAvatarClick() { fileInputRef.current?.click(); }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRawImage(url);
      setShowCrop(true);
    }
  }

  function handleCropComplete(blob: Blob) {
    const url = URL.createObjectURL(blob);
    setAvatarPreview(url);
    setCroppedBlob(blob);
    setShowCrop(false);
    if (rawImage) URL.revokeObjectURL(rawImage);
    setRawImage(null);
  }

  const avatarUrl = avatarPreview || (user.avatar?.key
    ? `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${user.avatar.key}`
    : null);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px] bg-white dark:bg-gray-900">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="size-28 ring-4 ring-[#EFF6FF] dark:ring-blue-950/50">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#0066FF] to-[#3B82F6] text-white">{initials}</AvatarFallback>
                )}
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="size-6 text-white" />
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">@{user.email?.split("@")[0]}</p>
            <div className="mt-4"><span className="inline-flex items-center rounded-full bg-[#0066FF]/10 px-4 py-1.5 text-xs font-semibold text-[#0066FF]">{user.role}</span></div>
            {croppedBlob && (
              <Button className="mt-4 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-6" disabled={saving}>
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Save Avatar
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 rounded-[24px] bg-white dark:bg-gray-900">
          <CardHeader className="pb-4"><CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><User className="size-3.5" /> Full Name</Label>
                <Input defaultValue={user.full_name} className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><AtSign className="size-3.5" /> Username</Label>
                <Input defaultValue={user.email?.split("@")[0]} placeholder="unique-username" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><Mail className="size-3.5" /> Email</Label>
                <Input defaultValue={user.email} disabled className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><Phone className="size-3.5" /> Phone</Label>
                <Input defaultValue={user.phone || ""} placeholder="+880 1XXXXXXXXX" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><FileText className="size-3.5" /> Bio</Label>
              <textarea defaultValue={user.bio || ""} placeholder="Tell us about yourself" rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] resize-none" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2"><Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400"><MapPin className="size-3.5" /> City</Label><Input defaultValue={user.city || ""} placeholder="Dhaka" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Area</Label><Input defaultValue={user.area || ""} placeholder="Dhanmondi" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Country</Label><Input defaultValue={user.country || ""} placeholder="Bangladesh" className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" /></div>
            </div>
            <div className="flex justify-end pt-2">
              <Button className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 h-11 shadow-lg shadow-blue-500/20" disabled={saving}>{saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null} Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showCrop && rawImage && <ImageCropModal open={showCrop} imageSrc={rawImage} onClose={() => { setShowCrop(false); setRawImage(null); }} onCrop={handleCropComplete} />}
    </>
  );
}
