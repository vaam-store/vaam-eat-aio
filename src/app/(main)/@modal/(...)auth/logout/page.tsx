"use client";

import { ModalPageWrapper } from "@app/components/modal";
import { Logout } from "@app/components/auth/logout";
import { Suspense } from "react";

export default function ModalRegisterPage() {
  return (
    <ModalPageWrapper title="Logout">
      <Suspense>
        <Logout />
      </Suspense>
    </ModalPageWrapper>
  );
}
