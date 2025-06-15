"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Mail } from "react-feather";
import { SettingCard } from "@app/components/settings/setting-card";

export default function Page() {
  const { data: session } = useSession();
  const isEmailVerified = session?.user?.emailVerified !== null;

  return (
    <SettingCard title="KYC (Email Setup)">
      <p className="mb-4">
        Current Email Verification Status:{" "}
        {isEmailVerified ? (
          <Check size={16} className="text-success inline" />
        ) : (
          "Not Verified"
        )}
      </p>
      {!isEmailVerified && (
        <Link
          href="/settings/verify-email"
          className="btn btn-secondary btn-sm"
        >
          <Mail size={16} /> Verify Email
        </Link>
      )}
    </SettingCard>
  );
}
