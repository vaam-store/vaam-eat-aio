import React from 'react';
import { ArrowRight } from 'react-feather';
import { ListItem } from '../list-item/list-item';

interface SettingNavigationItemProps {
  href: string;
  title: string;
  icon?: React.ReactNode;
  description?: string;
}

export function SettingNavigationItem({
  href,
  title,
  icon,
  description,
}: SettingNavigationItemProps) {
  return (
    <ListItem
      href={href}
      title={title}
      icon={icon}
      description={description}
      endIcon={<ArrowRight className='text-primary' />}
    />
  );
}
