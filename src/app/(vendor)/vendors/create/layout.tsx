import { VendorHeader } from '@app/components/navigation/vendor-header';
import type { PropsWithChildren } from 'react';

export default function CreateVendorLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <VendorHeader />
      <div id='root-vendor'>{children}</div>
    </>
  );
}
