'use client';

import {
  ProductCreateForm,
  type ProductCreateFormValues,
} from '@app/components/vendor-dashboard/product-create-form';
import { api } from '@app/trpc/react';
import Decimal from 'decimal.js';
import { useParams, useRouter } from 'next/navigation';

export default function AddNewProductPage() {
  const router = useRouter();
  const { vendorId } = useParams<{ vendorId: string }>();
  const createProduct = api.zen.product.create.useMutation();

  const handleSubmit = async (values: ProductCreateFormValues) => {
    try {
      // Assuming the tRPC mutation expects vendorId as part of the input object
      const result = await createProduct.mutateAsync({
        data: {
          ...values,
          vendor: {
            connect: {
              id: vendorId,
            },
          },
          primaryLocation: {
            create: {
              ...values.primaryLocation.create,
              address: {
                ...values.primaryLocation.create.address,
                latitude: Decimal(
                  values.primaryLocation.create.address.latitude,
                ),
                longitude: Decimal(
                  values.primaryLocation.create.address.longitude,
                ),
              },
              vendor: {
                connect: {
                  id: vendorId,
                },
              },
            },
          },
        },
      });
      router.push(`/vendors/${vendorId}/products/${result?.id ?? ''}`);
    } catch (error) {
      // TODO
    }
  };

  return <ProductCreateForm onSubmit={handleSubmit} vendorId={vendorId} />;
}
