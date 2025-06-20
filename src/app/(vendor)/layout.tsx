import { AuthWrapper } from '@app/components/auth/auth-wrapper';
import { EmailValidationAuthWrapper } from '@app/components/auth/email-validation-auth-wrapper';
import type { PropsWithChildren } from 'react';

export default function VendorLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <AuthWrapper>
      <EmailValidationAuthWrapper>
        <div id='root-vendor'>{children}</div>
      </EmailValidationAuthWrapper>
    </AuthWrapper>
  );
}
