import { Button } from '@app/components/button';
import { ListBlock } from '@app/components/list-block';
import { ListItem } from '@app/components/list-item/list-item';
import { Text } from '@app/components/text';
import { Title } from '@app/components/text/title';
import { useOrders } from '@app/hooks/use-orders';
import Link from 'next/link';

interface VendorOrdersViewProps {
  vendorId: string;
}

export function VendorOrdersView({ vendorId }: VendorOrdersViewProps) {
  const { orders } = useOrders({ where: { vendor: { id: vendorId } } });
  return (
    <div className='border border-base-300 rounded-box p-6'>
      <Title as='h2' className='mb-4 opacity-70'>
        Orders View
      </Title>
      <Text as='h3' className='text-lg font-semibold mb-4'>
        Recent Orders
      </Text>
      <ListBlock title='Order List'>
        {orders.length === 0 ? (
          <ListItem title='No orders found.' />
        ) : (
          orders.map((order) => (
            <ListItem
              key={order.id}
              title={`Order #${order.id.substring(0, 8)} - $${order.totalPrice.toFixed(2)}`}
              description={`Status: ${order.status} - ${new Date(order.createdAt).toLocaleDateString()}`}
              endIcon={
                <Link href={`/vendors/${vendorId}/orders/${order.id}`} passHref>
                  <Button variant='ghost' size='sm'>
                    View Details
                  </Button>
                </Link>
              }
            />
          ))
        )}
      </ListBlock>
    </div>
  );
}
