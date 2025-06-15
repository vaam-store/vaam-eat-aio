"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SettingCard } from "@app/components/settings/setting-card";

export default function Page() {
  const { data: session } = useSession();
  const isEmailVerified = session?.user?.emailVerified !== null;

  return (
    <SettingCard title="Vendor Management">
      <div className="flex flex-col gap-2">
        <Link href="/vendors" prefetch className="btn btn-info btn-sm">
          View Vendor List
        </Link>
        <Link
          href="/vendors/create"
          prefetch
          className={`btn btn-success btn-sm ${!isEmailVerified ? "btn-disabled" : ""}`}
          aria-disabled={!isEmailVerified}
        >
          Create Vendor Account
        </Link>
        {!isEmailVerified && (
          <p className="text-warning text-sm">
            Email must be verified to create a vendor account.
          </p>
        )}
      </div>
    </SettingCard>
  );
}
