import React from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
    { id: 1, name: "Red T-shirt", price: 25, category: "Candles", subCategory: "Scented", color: "Red", image: "/products/product1.webp" },
    { id: 2, name: "Blue Jeans", price: 40, category: "Clothing", subCategory: "Jeans", color: "Blue", image: "/products/product1.webp" },
    { id: 3, name: "Black Cap", price: 15, category: "Accessories", subCategory: "Caps", color: "Black", image: "/products/product1.webp" },
    { id: 4, name: "Sneakers", price: 60, category: "Footwear", subCategory: "Shoes", color: "White", image: "/products/product1.webp" },
    { id: 5, name: "Jacket", price: 80, category: "Clothing", subCategory: "Jackets", color: "Black", image: "/products/product1.webp" },
];

const AllProduct = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/categories/${product.category.toLowerCase()}`}
                        className="rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer"
                    >
                        <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
                            <Image
                                src={product.image}
                                alt={product.category}
                                fill
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <p className="mt-4 text-center text-gray-800 font-semibold text-lg hover:text-blue-600 transition-colors duration-200">
                            {product.category}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AllProduct;
