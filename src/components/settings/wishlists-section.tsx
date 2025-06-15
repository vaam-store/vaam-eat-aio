import { List } from 'react-feather';
import { SettingCard } from "./setting-card";
import Link from 'next/link';

export function WishlistsSection() {
  return (
    <SettingCard title="Wishlists">
      <ul className="menu bg-base-100 rounded-box">
        <Link href='/settings/whishlist' className="list-row">
          <List size={16} className="inline mr-2" />
          Manage your wishlists here.
        </Link>
      </ul>
    </SettingCard>
  );
}