import { Star } from 'react-feather';
import { SettingCard } from "./setting-card";

export function StarredProductsVendorsSection() {
  return (
    <SettingCard title="Starred Products / Vendors">
      <ul className="menu bg-base-100 rounded-box">
        <li className="list-row">
          <Star size={16} className="inline mr-2" />
          Your favorite products and vendors will appear here.
        </li>
      </ul>
    </SettingCard>
  );
}