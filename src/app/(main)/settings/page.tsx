import { AuthWrapper } from '@app/components/auth/auth-wrapper';
import { ListBlock } from '@app/components/list-block';
import { SettingNavigationItem } from '@app/components/settings/setting-navigation-item';
import { SettingShare } from '@app/components/settings/setting-share';
import { Suspense } from 'react';
import { Briefcase, Link2, List, Mail, Star, User } from 'react-feather';

export default function SettingsPage() {
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
            href='/settings/starred'
            title='Starred Products / Vendors'
            description='View your starred products and vendors'
            icon={<Star />}
          />
        </ListBlock>

        <ListBlock title='Miscellanous' className='mt-4'>
          <SettingShare />
          <SettingNavigationItem
            href='/settings/vendor-management'
            title='Vendor Management'
            description='Manage your vendor accounts and products'
            icon={<Briefcase />}
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
