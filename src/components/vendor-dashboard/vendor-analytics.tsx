import { Section } from '@app/components/section';
import { Text } from '@app/components/text';
import { Title } from '@app/components/text/title';
import { useCountOrders } from '@app/hooks/use-orders';
import { useCountProducts } from '@app/hooks/use-products';

interface VendorAnalyticsProps {
  vendorId: string;
}

export function VendorAnalytics({ vendorId }: VendorAnalyticsProps) {
  const { orderCount } = useCountOrders({
    where: { vendor: { id: vendorId } },
  });
  const { productCount } = useCountProducts({
    where: { vendor: { id: vendorId } },
  });

  return (
    <Section className='mb-8 border border-base-300 rounded-box p-6'>
      <Title as='h2' className='mb-4'>
        Analytics Overview
      </Title>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='card border border-base-300 bg-base-100 p-4'>
          <Text as='h3' className='text-lg font-semibold'>
            Total Products
          </Text>
          <Text className='text-3xl font-bold'>{productCount}</Text>
        </div>
        <div className='card border border-base-300 bg-base-100 p-4'>
          <Text as='h3' className='text-lg font-semibold'>
            Total Orders
          </Text>
          <Text className='text-3xl font-bold'>{orderCount}</Text>
        </div>
        <div className='card border border-base-300 bg-base-100 p-4'>
          <Text as='h3' className='text-lg font-semibold'>
            Recent Performance
          </Text>
          <Text className='text-3xl font-bold text-success'>+15%</Text>
        </div>
      </div>
    </Section>
  );
}
