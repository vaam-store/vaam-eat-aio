"use client";

import { signIn } from "next-auth/webauthn";
import { useRedirects } from "@app/components/auth/utils";

export function Login() {
  const { redirectUrl } = useRedirects();

  return (
    <form
      key="adorsys"
      action={async () => {
        await signIn("keycloak", { redirectTo: redirectUrl });
      }}
    >
      <button type="submit" className="btn btn-primary">
        <span>Sign in</span>
      </button>
    </form>
  );
}
