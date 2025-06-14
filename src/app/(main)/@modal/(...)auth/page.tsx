"use client";

import { Login } from "@app/components/auth/login";
import { ModalAuthPageWrapper } from "@app/components/modal";
import { Suspense } from "react";

export default function ModalLoginPage() {
  return (
    <ModalAuthPageWrapper title="Login">
      <Suspense>
        <Login />
      </Suspense>
    </ModalAuthPageWrapper>
  );
}
