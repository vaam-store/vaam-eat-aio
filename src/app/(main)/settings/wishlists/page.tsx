import { List } from "react-feather";
import { SettingCard } from "@app/components/settings/setting-card";
import Link from "next/link";

export default function Page() {
  return (
    <SettingCard title="Wishlists">
      <ul className="menu bg-base-100 rounded-box">
        <Link href="/settings/whishlist" className="list-row">
          <List size={16} className="mr-2 inline" />
          Manage your wishlists here.
        </Link>
      </ul>
    </SettingCard>
  );
}
