'use client';

import { AuthWrapper } from '@app/components/auth/auth-wrapper';
import { ListBlock } from '@app/components/list-block';
import { ListItem } from '@app/components/list-item';
import { SettingNavigationItem } from '@app/components/settings/setting-navigation-item';
import { SettingShare } from '@app/components/settings/setting-share';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import {
  ArrowRight,
  Briefcase,
  Link2,
  List,
  Mail,
  Map,
  Star,
  User,
} from 'react-feather';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const isEmailVerified = session?.user?.emailVerified !== null;

  const handleVendorClick = () => {
    if (isEmailVerified) {
      router.push('/vendors');
    } else {
      router.push('/settings/kyc');
    }
  };

  return (
    <Suspense>
      <AuthWrapper>
        <ListBlock title='Settings'>
          <SettingNavigationItem
            href='/settings/account'
            title='User Account'
            description='Manage your profile information'
            icon={<User />}
          />
          <SettingNavigationItem
            href='/settings/kyc'
            title='Email Setup'
            description='Verify your email for full access'
            icon={<Mail />}
          />
          <SettingNavigationItem
            href='/settings/wishlists'
            title='Wishlists'
            description='Organize your favorite items'
            icon={<List />}
          />
          <SettingNavigationItem
            href='/settings/cache'
            title='Offline Map Cache'
            description='Manage offline map downloads for your region'
            icon={<Map />}
          />
          <SettingNavigationItem
            href='/settings/starred'
            title='Starred Products / Vendors'
            description='View your starred products and vendors'
            icon={<Star />}
          />
        </ListBlock>

        <ListBlock title='Miscellanous' className='mt-4'>
          <SettingShare />
          <ListItem
            as='button'
            type='button'
            title='Vendor Management'
            description='Manage your vendor accounts and products'
            icon={<Briefcase />}
            endIcon={<ArrowRight className='text-primary' />}
            onClick={handleVendorClick}
          />
        </ListBlock>

        <ListBlock title='Links' className='mt-4'>
          <SettingNavigationItem
            href='/res/privacy'
            title='Privacy policy'
            icon={<Link2 />}
          />
          <SettingNavigationItem
            href='/res/tos'
            title='Terms of Service'
            icon={<Link2 />}
          />
          <SettingNavigationItem
            href='/res/contact'
            title='Contact'
            icon={<Link2 />}
          />
          <SettingNavigationItem href='/res/faq' title='FAQ' icon={<Link2 />} />
        </ListBlock>
      </AuthWrapper>
    </Suspense>
  );
}
