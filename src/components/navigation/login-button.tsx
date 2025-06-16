'use client';

import { Button } from '@app/components/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogIn, LogOut } from 'react-feather';

export function LoginButton() {
  const { status } = useSession();
  return (
    <>
      {status === 'unauthenticated' && (
        <Button
          as={Link}
          href='/auth'
          color='primary'
          className='hidden md:flex'
          shape='circle'
          variant='soft'>
          <LogIn />
        </Button>
      )}

      {status === 'authenticated' && (
        <Button
          as={Link}
          href='/auth/logout'
          color='error'
          className='hidden md:flex'
          shape='circle'
          variant='soft'>
          <LogOut />
        </Button>
      )}
    </>
  );
}
