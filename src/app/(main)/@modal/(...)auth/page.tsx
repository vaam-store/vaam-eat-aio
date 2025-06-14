"use client";

import { Login } from "@app/components/auth/login";
import { ModalAuthPageWrapper } from "@app/components/modal";

export default function ModalLoginPage() {
  return (
    <ModalAuthPageWrapper title="Login">
      <Login />
    </ModalAuthPageWrapper>
  );
}
