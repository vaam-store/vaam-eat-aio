"use client";

import { signOut } from "next-auth/react";
import { Button } from "@app/components/button";
import { useRedirects } from "@app/components/auth/utils";

export function Logout() {
  const { redirectUrl } = useRedirects();
  return (
    <>
      <Button
        block
        color="error"
        onClick={() => signOut({ redirectTo: redirectUrl })}
      >
        Sign out
      </Button>
    </>
  );
}
