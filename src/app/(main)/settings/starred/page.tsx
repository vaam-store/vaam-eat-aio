import { Star } from "react-feather";
import { SettingCard } from "@app/components/settings/setting-card";

export default function Page() {
  return (
    <SettingCard title="Starred Products / Vendors">
      <ul className="menu bg-base-100 rounded-box">
        <li className="list-row">
          <Star size={16} className="mr-2 inline" />
          Your favorite products and vendors will appear here.
        </li>
      </ul>
    </SettingCard>
  );
}
