'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef } from 'react';

export function AuthWrapper({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPathname = useRef(pathname);
  const { status } = useSession();

  useEffect(() => {
    if (!status) {
      return;
    }

    if (status === 'unauthenticated') {
      router.replace(
        `/auth?redirect_url=${encodeURIComponent(currentPathname.current)}`,
      );
      return;
    }
  }, [status, router, currentPathname]);

  if (status !== 'authenticated') {
    return null;
  }

  return <>{children}</>;
}
