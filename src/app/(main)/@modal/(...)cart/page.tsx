import { ShoppingCart } from "@app/components/cart";
import { ModalPageWrapper } from "@app/components/modal";

export default function ModalCartPage() {
  return (
    <ModalPageWrapper title="Shopping Cart" position="right">
      <ShoppingCart />
    </ModalPageWrapper>
  );
}
