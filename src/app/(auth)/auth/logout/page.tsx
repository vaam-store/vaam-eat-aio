import { Logout } from '@app/components/auth/logout';
import { auth } from '@app/server/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function LogoutPage() {
  const session = await auth();
  if (!session) {
    return redirect('/');
  }

  return (
    <div className='py-4'>
      <Suspense>
        <Logout />
      </Suspense>
    </div>
  );
}
