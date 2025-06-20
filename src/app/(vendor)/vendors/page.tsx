'use client';

import { useVendors } from '@app/hooks/use-vendors';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorsPage() {
  const router = useRouter();
  const { vendors } = useVendors({ where: { members: { some: {} } } });

  useEffect(() => {
    const vendorId = vendors?.[0].id;
    if (vendorId) {
      router.replace(`/vendors/${vendorId}`);
    } else if (vendors && vendors.length === 0) {
      router.replace('/vendors/create');
    }
  }, [vendors, router]);

  return <div className='loading loading-spinner loading-xl' />;
}
