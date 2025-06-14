"use client";

import { Modal, type ModalProps } from "@app/components/modal/modal";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { useSession } from "next-auth/react";

export function ModalAuthPageWrapper({
  children,
  ...restProps
}: PropsWithChildren<Omit<ModalProps, "onCloseAction" | "open" | "children">>) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (!status) {
      return;
    }

    if (status === "authenticated") {
      router.back();
    }
  }, [status, router]);

  if (!status) {
    return null;
  }

  return (
    <Modal {...restProps} open onCloseAction={() => router.back()}>
      {children}
    </Modal>
  );
}
