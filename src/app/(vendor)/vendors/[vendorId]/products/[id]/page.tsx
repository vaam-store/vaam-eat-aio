'use client';

import ProductEditForm, {
  type ProductEditFormValues,
} from '@app/components/vendor-dashboard/product-edit-form';
import { useProduct, useUpdateProduct } from '@app/hooks/use-products';
import { useParams, useRouter } from 'next/navigation';

type Params = {
  vendorId: string;
  id: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const { vendorId, id } = useParams<Params>();

  const { product, isLoading, error } = useProduct({
    id,
  });
  const { updateProduct } = useUpdateProduct();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <span
          className='loading loading-spinner loading-md'
          aria-label='Loading...'
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='alert alert-error my-8 max-w-xl mx-auto'>
        <span>{error?.message ?? 'Failed to load product data.'}</span>
      </div>
    );
  }

  const initialValues: ProductEditFormValues = {
    name: product.name ?? '',
    slug: product.slug ?? '',
    description: product.description ?? '',
    price: product.price ? product.price.toNumber() : 0,
    available: product.available,
    categoryId: product.categoryId,
    // Assuming data.tags and data.images are correctly typed by useQuery with includes
    tags: product.tags?.map((tag) => tag.id) ?? [],
    images:
      product.images?.map((image) => ({
        url: image.url,
        altText: image.altText ?? '',
      })) ?? [],
    thumbnail: product.thumbnail?.url ?? null,
  };

  const handleSubmit = async (values: ProductEditFormValues) => {
    try {
      await updateProduct(id, {
        ...values,
        price: values.price, // Ensure price is passed correctly if it's a Decimal or needs conversion
        images: {
          // Ensure data.images is accessed safely, assuming it's an array from the query
          create:
            values.images?.filter(
              (img) =>
                !product.images?.some(
                  (existingImg) => existingImg.url === img.url,
                ),
            ) ?? [],
          deleteMany:
            product.images
              ?.filter(
                (existingImg) =>
                  !values.images?.some((img) => img.url === existingImg.url),
              )
              .map((img) => ({ id: img.id })) || [],
        },
        tags: {
          // Ensure values.tags is an array of strings (IDs)
          set: values.tags?.map((tagId) => ({ id: tagId })) || [],
        },
        thumbnail: values.thumbnail
          ? {
              connect: { url: values.thumbnail }, // Assuming thumbnail URL is unique for connection
            }
          : { disconnect: true },
      });
      router.push(`/vendors/${vendorId}/selling/products`);
    } catch (error) {
      // Optionally handle error (e.g., show notification)
      // No-op: ProductForm may have its own error handling
    }
  };

  return (
    <ProductEditForm initialValues={initialValues} onSubmit={handleSubmit} />
  );
}
