import { DefaultDock } from "@app/components/navigation/default-dock";
import { DefaultFooter } from "@app/components/navigation/default-footer";
import type { PropsWithChildren } from "react";
import { DefaultHeader } from "@app/components/navigation/default-header";
import { Section } from "@app/components/section";

export default function RootLayout({
  children,
  modal,
}: Readonly<PropsWithChildren<{ modal: React.ReactNode }>>) {
  return (
    <Section className="pt-6 pb-12">
      <div id="root-settings">{children}</div>
    </Section>
  );
}
