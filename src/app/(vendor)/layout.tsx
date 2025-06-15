import type { PropsWithChildren } from "react";
import { EmailValidationAuthWrapper } from "@app/components/auth/email-validation-auth-wrapper";
import { VendorHeader } from "@app/components/navigation/vendor-header";
import { Section } from "@app/components/section";
import { AuthWrapper } from "@app/components/auth/auth-wrapper";

export default function VendorLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <AuthWrapper>
      <EmailValidationAuthWrapper>
        <main className="min-h-screen">
          <VendorHeader />

          <Section className="pt-6 pb-16">
            <div id="root-vendor">{children}</div>
          </Section>
        </main>
      </EmailValidationAuthWrapper>
    </AuthWrapper>
  );
}
