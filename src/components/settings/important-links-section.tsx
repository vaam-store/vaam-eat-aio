import Link from "next/link";
import { SettingCard } from "./setting-card";

export function ImportantLinksSection() {
  return (
    <SettingCard title="Important Links">
      <ul className="menu bg-base-100 rounded-box">
        <li><Link href="/res/privacy" prefetch>Privacy Policy</Link></li>
        <li><Link href="/res/tos" prefetch>Terms of Service</Link></li>
        <li><Link href="/res/contact" prefetch>Contact Us</Link></li>
        <li><Link href="/res/faq" prefetch>FAQ</Link></li>
      </ul>
    </SettingCard>
  );
}