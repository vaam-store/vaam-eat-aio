'use client';

import { useRedirects } from '@app/components/auth/utils';
import { Button } from '@app/components/button';
import { signOut } from 'next-auth/react';

export function Logout() {
  const { redirectUrl } = useRedirects();
  return (
    <>
      <Button
        block
        color='error'
        onClick={() => signOut({ redirectTo: redirectUrl })}>
        Sign out
      </Button>
    </>
  );
}
