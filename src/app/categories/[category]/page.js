"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader/PageHeader";

const products = [
  { id: 1, category: "candles", name: "scented", image: "/products/product1.webp" },
  { id: 2, category: "candles", name: "unscented", image: "/products/product1.webp" },
  { id: 3, category: "mobiles", name: "jeans", image: "/products/product1.webp" },
  { id: 4, category: "clothing", name: "shirt", image: "/products/product1.webp" },
];

const CategoryPage = () => {
  const { category } = useParams();

  const filteredProducts = products.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );

  if (!filteredProducts.length)
    return <p className="text-center mt-20">No products found.</p>;

  return (
    <>
      <PageHeader />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <Link
              key={p.id}
              href={`/categories/${category.toLowerCase()}/subcategory/${p.name.toLowerCase()}`}
              className="rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full h-72">
                <Image src={p.image} alt={p.name} fill className="object-cover rounded-lg" />
              </div>
              <p className="mt-4 text-center font-semibold">{p.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </>

  );
};

export default CategoryPage;
