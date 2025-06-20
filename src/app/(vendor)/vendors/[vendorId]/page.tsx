'use client';

import { Container } from '@app/components/container';
import { Title } from '@app/components/text/title';
import { VendorAnalytics } from '@app/components/vendor-dashboard/vendor-analytics';
import { VendorOrdersView } from '@app/components/vendor-dashboard/vendor-orders-view';
import { VendorProductManagement } from '@app/components/vendor-dashboard/vendor-product-management';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export default function VendorDashboardPage() {
  const { vendorId } = useParams<{ vendorId: string }>();

  return (
    <Container className='py-8'>
      <Title className='mb-6'>Vendor Dashboard</Title>

      <Suspense>
        <VendorAnalytics vendorId={vendorId} />
      </Suspense>

      <Suspense>
        <VendorProductManagement vendorId={vendorId} />
      </Suspense>

      <Suspense>
        <VendorOrdersView vendorId={vendorId} />
      </Suspense>
    </Container>
  );
}
