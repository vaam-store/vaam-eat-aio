import Link from "next/link";
import { Button } from "../button";

export function SettingContent() {
  return (
    <>
      <Button as={Link} href="/vendors/create" prefetch>
        Create a vendot account here
      </Button>
    </>
  );
}
