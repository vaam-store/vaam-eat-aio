"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { VendorCreationForm } from "@app/components/vendor/vendor-creation-form";
import { api } from "@app/trpc/react";
import { handleTrpcError } from "@app/utils/error-handler";
import { type Prisma } from "@prisma/client";
import { Section } from "@app/components/section/section";

export default function VendorCreatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const createVendorMutation = api.zen.vendor.create.useMutation({
    onSuccess: (data) => {
      router.push(`/vendor/${data?.id}`);
    },
    onError: (error) => {
      handleTrpcError(error, "Failed to create vendor. Please try again.");
    },
  });

  const handleSubmit = async (values: Prisma.VendorCreateInput) => {
    await createVendorMutation.mutateAsync({
      data: values as any,
    });
  };

  if (status === "loading") {
    return (
      <Section>
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Section>
    );
  }

  if (status === "unauthenticated" || !session?.user?.id) {
    router.push("/auth"); // Or a more appropriate unauthenticated page/modal
    return (
      <Section>
        <p>Redirecting to login...</p>
      </Section>
    );
  }

  const userId = session.user.id;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Create New Vendor</h1>
      <VendorCreationForm onSubmit={handleSubmit} userId={userId} />
      {createVendorMutation.isError && (
        <p className="text-error mt-2">
          Error creating vendor: {createVendorMutation.error?.message}
        </p>
      )}
    </>
  );
}
