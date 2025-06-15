"use client";

import { useEffect, useState } from "react";
import { api } from "@app/trpc/react";

import { SettingCard } from "@app/components/settings/setting-card";
import { AuthWrapper } from "@app/components/auth/auth-wrapper";

interface EmailVerificationClientProps {
  token: string | null;
}

export function EmailVerificationClient({
  token,
}: EmailVerificationClientProps) {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "checking" | "loading" | "success" | "error" | "verified"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: verificationData, isLoading: isVerificationStatusLoading } =
    api.user.getVerificationStatus.useQuery(undefined, {
      staleTime: Infinity, // Email verification status is unlikely to change frequently
      enabled:
        verificationStatus === "idle" || verificationStatus === "checking", // Only fetch if not already verified or in a verification process
      refetchOnWindowFocus: false, // Prevent refetching on window focus
    });

  useEffect(() => {
    if (verificationData?.isVerified) {
      setVerificationStatus("verified");
    } else if (verificationData && !verificationData.isVerified) {
      setVerificationStatus("idle");
    }
  }, [verificationData]);

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
    if (isVerificationStatusLoading) {
      setVerificationStatus("checking");
      return;
    }

    if (verificationData?.isVerified) {
      setVerificationStatus("verified");
      return;
    }

    if (token && verificationStatus === "idle") {
      verifyMutation.mutate({ token });
    } else if (!token && verificationStatus === "idle") {
      setVerificationStatus("error");
      setErrorMessage("No verification token found in the URL.");
    }
  }, [
    token,
    verificationStatus,
    verifyMutation,
    verificationData,
    isVerificationStatusLoading,
  ]);

  return (
    <AuthWrapper>
      <SettingCard title="Verification Status">
        {verificationStatus === "verified" ? (
          <p className="text-success">Your email is already verified!</p>
        ) : verificationStatus === "loading" ? (
          <div className="flex items-center gap-2">
            <div className="loading loading-spinner loading-lg" />
            <p>Verifying your email...</p>
          </div>
        ) : verificationStatus === "success" ? (
          <p className="text-success">
            Your email has been successfully verified!
          </p>
        ) : verificationStatus === "error" ? (
          <p className="text-error">
            Email verification failed:{" "}
            {errorMessage ?? "An unknown error occurred."}
          </p>
        ) : (
          <p>
            No verification token found. Please ensure you use the link from
            your email.
          </p>
        )}
      </SettingCard>
    </AuthWrapper>
  );
}
