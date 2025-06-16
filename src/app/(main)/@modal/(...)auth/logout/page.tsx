'use client';

import { Logout } from '@app/components/auth/logout';
import { ModalPageWrapper } from '@app/components/modal';
import { Suspense } from 'react';

export default function ModalRegisterPage() {
  return (
    <ModalPageWrapper title='Logout'>
      <Suspense>
        <Logout />
      </Suspense>
    </ModalPageWrapper>
  );
}
