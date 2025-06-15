'use client';

import { UserAccountSection } from "./user-account-section";
import { KycEmailSection } from "./kyc-email-section";
import { VendorManagementSection } from "./vendor-management-section";
import { ImportantLinksSection } from "./important-links-section";
import { ShareSection } from "./share-section";
import { StarredProductsVendorsSection } from "./starred-products-vendors-section";
import { WishlistsSection } from "./wishlists-section";

export function SettingContent() {
  return (
    <div className="md:grid md:grid-cols-2 md:gap-4 p-4">
      <UserAccountSection />
      <KycEmailSection />
      <VendorManagementSection />
      <ImportantLinksSection />
      <ShareSection />
      <StarredProductsVendorsSection />
      <WishlistsSection />
    </div>
  );
}
