import { Suspense } from "react";
import { EmailVerificationClient } from "@app/components/settings/EmailVerificationClient";

interface VerifyEmailPageProps {
  searchParams: {
    token?: string;
  };
}

export default function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const token = searchParams.token || null;

  return (
    <Suspense>
      <EmailVerificationClient token={token} />
    </Suspense>
  );
}
