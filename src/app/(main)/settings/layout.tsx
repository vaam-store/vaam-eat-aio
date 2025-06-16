import { AuthWrapper } from '@app/components/auth/auth-wrapper';
import { Section } from '@app/components/section';
import type { PropsWithChildren } from 'react';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Section className='pt-6 pb-16'>
      <AuthWrapper>
        <div id='root-settings'>{children}</div>
      </AuthWrapper>
    </Section>
  );
}
