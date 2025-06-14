import { DefaultDock } from "@app/components/navigation/default-dock";
import { DefaultFooter } from "@app/components/navigation/default-footer";
import type { PropsWithChildren } from "react";
import { DefaultHeader } from "@app/components/navigation/default-header";

export default function RootLayout({
  children,
  modal,
}: Readonly<PropsWithChildren<{ modal: React.ReactNode }>>) {
  return (
    <main className="min-h-screen">
      <DefaultHeader />

      <div id="root-child">{children}</div>

      <div id="modal">{modal}</div>

      <div className="hidden md:block">
        <DefaultFooter />
      </div>

      <div className="md:hidden">
        <DefaultDock />
      </div>
    </main>
  );
}
