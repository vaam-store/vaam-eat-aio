import { Button } from '@app/components/button';
import { ListBlock } from '@app/components/list-block';
import { ListItem } from '@app/components/list-item/list-item';
import { Section } from '@app/components/section';
import { Text } from '@app/components/text';
import { Title } from '@app/components/text/title';
import { useProducts } from '@app/hooks/use-products';
import Link from 'next/link';

interface VendorProductManagementProps {
  vendorId: string;
}

export function VendorProductManagement({
  vendorId,
}: VendorProductManagementProps) {
  const { products } = useProducts({
    where: {
      vendor: {
        id: vendorId,
      },
    },
  });

  return (
    <Section className='mb-8 border border-base-300 rounded-box p-6'>
      <Title as='h2' className='mb-4'>
        Product Management
      </Title>
      <div className='flex justify-between items-center mb-4'>
        <Text as='h3' className='text-lg font-semibold'>
          Your Products
        </Text>
        <Link href={`/vendors/${vendorId}/selling/products/new`} passHref>
          <Button color='primary'>Add New Product</Button>
        </Link>
      </div>
      <ListBlock title='Product List'>
        {products.length === 0 ? (
          <ListItem title='No products found.' />
        ) : (
          products.map((product) => (
            <ListItem
              key={product.id}
              title={product.name}
              endIcon={
                <div>
                  <Button
                    as={Link}
                    variant='ghost'
                    size='sm'
                    className='mr-2'
                    href={`/vendors/${vendorId}/selling/products/${product.id}`}>
                    Edit
                  </Button>

                  <Button variant='ghost' size='sm' color='error'>
                    Delete
                  </Button>
                </div>
              }
            />
          ))
        )}
      </ListBlock>
    </Section>
  );
}
