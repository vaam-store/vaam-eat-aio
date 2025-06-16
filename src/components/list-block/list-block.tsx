import { Text } from '@app/components/text';
import type { ReactNode } from 'react';

export function ListBlock({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Text size='2xl' bold className='mb-6'>
        {title}
      </Text>
      <ul className='list w-full'>{children}</ul>
    </div>
  );
}
