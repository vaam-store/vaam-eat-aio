'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Edit } from 'react-feather';
import { SettingCard } from "./setting-card";

export function UserAccountSection() {
  const { data: session } = useSession();

  return (
    <SettingCard title="User Account">
      <div className="flex items-center gap-4 mb-4">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={session?.user?.image || "/placeholder-avatar.png"} alt="User Avatar" />
          </div>
        </div>
        <div>
          <div className="font-bold">{session?.user?.name || "Guest User"}</div>
          <div className="text-sm opacity-60">Email: {session?.user?.email}</div>
          <div className="text-sm opacity-60">Email Verified: {session?.user?.emailVerified ? <Check size={12} className="inline text-success" /> : "No"}</div>
        </div>
      </div>
      <Link href="/settings/edit-profile" className="btn btn-primary btn-sm">
        <Edit size={16} /> Edit Profile
      </Link>
    </SettingCard>
  );
}