import { AuthWrapper } from "@app/components/auth/auth-wrapper";
import type { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
