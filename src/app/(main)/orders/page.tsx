import { AuthWrapper } from '@app/components/auth/auth-wrapper';
import { UserOrder } from '@app/components/orders/order';
import { Suspense } from 'react';

export default function OrdersPage() {
	return (
		<Suspense>
			<AuthWrapper>
				<UserOrder />
			</AuthWrapper>
		</Suspense>
	);
}
