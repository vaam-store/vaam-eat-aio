"use client";

import { useProducts } from "@app/hooks/use-products";
import Image from "next/image";

export function DishesGrid() {
  const { data } = useProducts();
  return (
    <div className="ld:grid-cols-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.map((product) => (
        <div key={product.id} className="card image-full bg-base-200">
          <figure>
            <Image src={product.thumbnail?.url} alt={product.name} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{product.name}</h2>
            <span>{product.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
