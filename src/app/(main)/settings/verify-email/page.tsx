import { AuthWrapper } from "@app/components/auth/auth-wrapper";
import { Section } from "@app/components/section";
import { SettingCard } from "@app/components/settings/setting-card";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@app/trpc/react";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <EmailVerificationContent />
    </Suspense>
  );
}

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyMutation = api.user.verifyEmailToken.useMutation({
    onMutate: () => {
      setVerificationStatus("loading");
    },
    onSuccess: () => {
      setVerificationStatus("success");
    },
    onError: (error) => {
      setVerificationStatus("error");
      setErrorMessage(error.message);
    },
  });

  useEffect(() => {
    if (token && verificationStatus === "idle") {
      verifyMutation.mutate({ token });
    } else if (!token) {
      setVerificationStatus("error");
      setErrorMessage("No verification token found in the URL.");
    }
  }, [token, verificationStatus, verifyMutation]);

  return (
    <AuthWrapper>
      <Section title="Email Verification">
        <SettingCard title="Verification Status">
          {verificationStatus === "loading" && (
            <div className="flex items-center gap-2">
              <div className="loading loading-spinner loading-lg" />
              <p>Verifying your email...</p>
            </div>
          )}
          {verificationStatus === "success" && (
            <p className="text-success">
              Your email has been successfully verified!
            </p>
          )}
          {verificationStatus === "error" && (
            <p className="text-error">
              Email verification failed:{" "}
              {errorMessage || "An unknown error occurred."}
            </p>
          )}
          {verificationStatus === "idle" && !token && (
            <p>
              No verification token found. Please ensure you use the link from
              your email.
            </p>
          )}
        </SettingCard>
      </Section>
    </AuthWrapper>
  );
}
