"use client";

import { ModalPageWrapper } from "@app/components/modal";
import { Logout } from "@app/components/auth/logout";

export default function ModalRegisterPage() {
  return (
    <ModalPageWrapper title="Logout">
      <Logout />
    </ModalPageWrapper>
  );
}
