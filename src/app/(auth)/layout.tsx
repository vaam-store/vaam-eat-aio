import { AuthContentWrapper } from '@app/components/auth/auth-content-wrapper';
import { AuthFooter } from '@app/components/auth/auth-footer';
import { AuthHeader } from '@app/components/auth/auth-header';
import { AuthSideSection } from '@app/components/auth/auth-side-section';
import type { PropsWithChildren } from 'react';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className='grid min-h-screen grid-cols-1 md:grid-cols-5 lg:grid-cols-3'>
      <div className='hidden md:col-span-3 md:flex md:items-center md:justify-center lg:col-span-2'>
        <AuthSideSection />
      </div>

      <div className='card bg-base-100 min-h-screen rounded-none md:col-span-2 lg:col-span-1'>
        <div className='card-body flex min-h-screen flex-col justify-between gap-6 p-6 md:p-8'>
          <div>
            <AuthHeader />
            <AuthContentWrapper>{children}</AuthContentWrapper>
          </div>
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
