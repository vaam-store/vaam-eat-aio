import { EmailVerificationClient } from '@app/components/settings/email-verification-client';
import { Suspense } from 'react';

interface VerifyEmailPageProps {
  searchParams: {
    token?: string;
  };
}

export default function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const token = searchParams.token ?? null;

  return (
    <Suspense>
      <EmailVerificationClient token={token} />
    </Suspense>
  );
}
