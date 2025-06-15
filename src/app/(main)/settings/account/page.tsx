"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Check, Edit } from "react-feather";
import { SettingCard } from "@app/components/settings/setting-card";

export default function Page() {
  const { data: session } = useSession();

  return (
    <SettingCard title="User Account">
      <div className="mb-4 flex items-center gap-4">
        <div className="avatar">
          <div className="relative w-12 overflow-hidden rounded-full">
            <Image
              src={session?.user?.image ?? "/placeholder-avatar.jpg"}
              alt="User Avatar"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div>
          <div className="font-bold">{session?.user?.name ?? "Guest User"}</div>
          <div className="text-sm opacity-60">
            Email: {session?.user?.email}
          </div>
          <div className="text-sm opacity-60">
            Email Verified:{" "}
            {session?.user?.emailVerified ? (
              <Check size={12} className="text-success inline" />
            ) : (
              "No"
            )}
          </div>
        </div>
      </div>
      <Link href="/settings/edit-profile" className="btn btn-primary btn-sm">
        <Edit size={16} /> Edit Profile
      </Link>
    </SettingCard>
  );
}
