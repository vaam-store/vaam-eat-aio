"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type DockLinkProps = PropsWithChildren<{
  href: string;
}>;

export function DockLink({ href, children }: DockLinkProps) {
  const current = usePathname();
  const active = useMemo(() => current === href, [current, href]);

  return (
    <Link href={href} prefetch className={twMerge(active && "dock-active")}>
      {children}
    </Link>
  );
}
