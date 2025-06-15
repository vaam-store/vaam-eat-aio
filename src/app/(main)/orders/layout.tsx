import { DefaultDock } from "@app/components/navigation/default-dock";
import { DefaultFooter } from "@app/components/navigation/default-footer";
import type { PropsWithChildren } from "react";
import { DefaultHeader } from "@app/components/navigation/default-header";
import { Section } from "@app/components/section";
import { AuthWrapper } from "@app/components/auth/auth-wrapper";

export default function RootLayout({
  children,
  modal,
}: Readonly<PropsWithChildren<{ modal: React.ReactNode }>>) {
  return (
    <Section className="pt-6 pb-16">
      <AuthWrapper>
        <div id="root-orders">{children}</div>
      </AuthWrapper>
    </Section>
  );
}
