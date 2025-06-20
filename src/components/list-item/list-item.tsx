import React, {
  type ComponentPropsWithoutRef,
  type ElementType,
  type RefObject,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from '../text';

interface ListItemOwnProps {
  title?: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export type ListItemProps<As extends ElementType = 'a'> = ListItemOwnProps &
  ComponentPropsWithoutRef<As> & {
    as?: As;
    ref?: RefObject<As>;
  };

export function ListItem<As extends ElementType = 'a'>({
  title,
  as,
  className,
  description,
  icon,
  endIcon,
  ...props
}: ListItemProps<As>) {
  const Component = as ?? 'a';

  return (
    <Component
      className={twMerge('list-row items-center', className)}
      {...props}>
      {icon}
      <div className='flex-grow text-left'>
        <Text className='font-bold'>{title}</Text>
        {description && (
          <Text className='text-opacity-70 text-sm'>{description}</Text>
        )}
      </div>
      {endIcon}
    </Component>
  );
}

ListItem.defaultProps = { title: '' };
