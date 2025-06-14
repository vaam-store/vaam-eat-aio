import type { PropsWithChildren } from "react";

export default function CheckoutLayout({ children }: PropsWithChildren) {
  // Add checkout-specific middleware logic here
  // Removed console log for production
  return <>{children}</>;
}
