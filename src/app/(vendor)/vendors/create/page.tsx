'use client';

import { VendorCreationForm } from '@app/components/vendor';
import { api } from '@app/trpc/react';
import { handleTrpcError } from '@app/utils/error-handler';
import { type Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';

export default function VendorCreatePage() {
  const { data } = useSession();

  const createVendorMutation = api.zen.vendor.create.useMutation({
    onError: (error) => {
      handleTrpcError(error, 'Failed to create vendor. Please try again.');
    },
  });

  const handleSubmit = async (values: Prisma.VendorCreateInput) => {
    await createVendorMutation.mutateAsync({
      data: { ...values, createdById: data?.user?.id } as any, // Ensure createdById is passed
    });
  };

  if (!data) {
    return (
      <div>
        <div className='loading loading-spinner loading-lg' />
      </div>
    );
  }

  return (
    <>
      <h1 className='mb-4 text-2xl font-bold'>Create New Vendor</h1>
      <VendorCreationForm
        onSubmit={handleSubmit}
        initialData={{ userId: data.user.id, name: data.user.name ?? '' }}
      />
      {createVendorMutation.isError && (
        <p className='text-error mt-2'>
          Error creating vendor: {createVendorMutation.error?.message}
        </p>
      )}
    </>
  );
}
