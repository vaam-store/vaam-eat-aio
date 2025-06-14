"use client";

import { useRouter } from "next/navigation";
import { useRedirects } from "@app/components/auth/utils";

export function Logout() {
  const router = useRouter();
  const { redirectUrl, nextQueryString, queryString } = useRedirects();

  return <>Logout</>;
}
