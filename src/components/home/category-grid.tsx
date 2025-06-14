"use client";

import { useCategories } from "@app/hooks/use-categories";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function CategoryGrid() {
  const { data } = useCategories({ take: 6 });
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (...kvs: [string, string][]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of kvs) {
        params.set(name, encodeURIComponent(value));
      }

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="ld:grid-cols-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {data.map((cat) => (
        <Link
          href={`/search?${createQueryString(["c_id", cat.id])}`}
          key={cat.id}
          className="card bg-base-200"
        >
          <div className="card-body">
            <h2 className="card-title">{cat.name}</h2>
            <span>{cat.slug}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
