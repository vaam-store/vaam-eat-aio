"use client";

import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { AuthWrapper } from "@app/components/auth/auth-wrapper";
import { useRedirects } from "./utils";

export function EmailValidationAuthWrapper({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPathname = useRef(pathname);
  const { data: session, status } = useSession();
  const { redirectUrl } = useRedirects();

  useEffect(() => {
    if (status === "authenticated" && !session?.user.emailVerified) {
      router.replace(
        `/settings/verify-email?redirect_url=${encodeURIComponent(redirectUrl)}`,
      );
      return;
    }
  }, [status, session, router, currentPathname]);

  if (status !== "authenticated" || !session?.user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}
