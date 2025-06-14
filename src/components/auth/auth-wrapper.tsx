"use client";

import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function AuthWrapper({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPathname] = useState(pathname);
  const { status } = useSession();

  useEffect(() => {
    if (!status) {
      return;
    }

    if (status === "unauthenticated") {
      router.replace(
        `/auth?redirect_url=${encodeURIComponent(currentPathname)}`,
      );
      return;
    }
  }, [status, router, currentPathname]);

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
