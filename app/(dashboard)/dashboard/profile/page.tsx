import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { ProfileContent } from "./profile-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.LOGIN);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account information and preferences</p>
        </div>
        <Button variant="outline" className="rounded-xl text-sm">
          <ExternalLink className="mr-2 size-3.5" /> View Public Profile
        </Button>
      </div>
      <ProfileContent user={user} />
    </div>
  );
}

function ExternalLink(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>; }

import { Button } from "@/components/ui/button";
