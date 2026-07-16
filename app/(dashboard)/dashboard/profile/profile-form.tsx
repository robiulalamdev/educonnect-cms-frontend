"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Camera } from "lucide-react";

interface ProfileFormProps {
  user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const initials = user.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Avatar Card */}
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-6 text-center">
          <div className="relative inline-block">
            <Avatar className="size-24">
              {user.avatar?.key ? (
                <img
                  src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${user.avatar.key}`}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-2xl font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <button className="absolute bottom-0 right-0 size-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
              <Camera className="size-4" />
            </button>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {user.full_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
              {user.role}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user.full_name} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} disabled className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue={user.phone || ""} placeholder="+880 1XXXXXXXXX" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Input defaultValue={user.gender || ""} className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Input defaultValue={user.bio || ""} placeholder="Tell us about yourself" className="rounded-xl" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>City</Label>
              <Input defaultValue={user.city || ""} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input defaultValue={user.area || ""} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input defaultValue={user.country || ""} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6" disabled={saving}>
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
