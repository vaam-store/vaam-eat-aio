'use client';

import { Section } from '@app/components/section';
import { Title } from '@app/components/text';
import { VendorCreationForm } from '@app/components/vendor';
import { api } from '@app/trpc/react';
import { handleTrpcError } from '@app/utils/error-handler';
import type { Prisma } from '@zenstackhq/runtime/models';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VendorCreatePage() {
  const { data } = useSession();
  const router = useRouter();

  const createVendorMutation = api.vendor.create.useMutation({
    onError: (error) => {
      handleTrpcError(error, 'Failed to create vendor. Please try again.');
    },
  });

  const handleSubmit = async (values: Prisma.VendorCreateInput) => {
    const result = await createVendorMutation.mutateAsync({
      data: values,
    });
    router.push(`/vendors/${result.id}`);
  };

  if (!data) {
    return (
      <div>
        <div className='loading loading-spinner loading-lg' />
      </div>
    );
  }

  return (
    <Section className='py-4'>
      <Title size='2xl' className='mb-4'>
        Create New Vendor
      </Title>
      <VendorCreationForm
        onSubmit={handleSubmit}
        initialData={{
          userId: data.user.id,
          name: data.user.name ?? '',
          email: data.user?.email ?? '',
        }}
      />
      {createVendorMutation.isError && (
        <p className='text-error mt-2'>
          Error creating vendor: {createVendorMutation.error?.message}
        </p>
      )}
    </Section>
  );
}
