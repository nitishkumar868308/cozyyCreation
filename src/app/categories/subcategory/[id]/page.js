"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Sample products
const products = [
    { id: 1, category: "clothing", subCategory: "jeans", name: "Blue Jeans", price: 40, color: "Blue", image: "/products/product1.webp" },
    { id: 2, category: "clothing", subCategory: "jeans", name: "Black Jeans", price: 50, color: "Black", image: "/products/product1.webp" },
    { id: 3, category: "clothing", subCategory: "shirts", name: "White Shirt", price: 35, color: "White", image: "/products/product1.webp" },
    { id: 4, category: "clothing", subCategory: "jeans", name: "Ripped Jeans", price: 60, color: "Blue", image: "/products/product1.webp" },
];

// Filter options
const colors = ["Red", "Blue", "Black", "White"];
const sortOptions = ["Price: Low to High", "Price: High to Low"];
const colorMap = { Red: "#f87171", Blue: "#60a5fa", Black: "#374151", White: "#f9fafb" };

const SubCategoryPage = () => {
    const params = useParams();
    const subCategory = params.id.toLowerCase(); // Ye subcategory name

    const [selectedColor, setSelectedColor] = useState("All");
    const [priceRange, setPriceRange] = useState(100);
    const [sortBy, setSortBy] = useState(sortOptions[0]);

    // Filter products for this subcategory
    let filteredProducts = products.filter(
        (p) =>
            p.subCategory.toLowerCase() === subCategory &&
            (selectedColor === "All" || p.color.toLowerCase() === selectedColor.toLowerCase()) &&
            p.price <= priceRange
    );

    // Sort products
    if (sortBy === "Price: Low to High") filteredProducts.sort((a, b) => a.price - b.price);
    else filteredProducts.sort((a, b) => b.price - a.price);

    if (filteredProducts.length === 0)
        return <p className="text-center mt-20 text-gray-500">No products found in this subcategory.</p>;

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4 bg-white p-6 rounded shadow space-y-6">
                <h2 className="text-xl font-bold">Filters</h2>

                {/* Color Filter */}
                <div>
                    <h3 className="font-semibold mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                        <div
                            onClick={() => setSelectedColor("All")}
                            className={`w-6 h-6 rounded-full border cursor-pointer ${selectedColor === "All" ? "ring-2 ring-blue-500" : "border-gray-300"}`}
                            title="All"
                        ></div>
                        {colors.map((c) => (
                            <div
                                key={c}
                                onClick={() => setSelectedColor(c)}
                                className="w-6 h-6 rounded-full border cursor-pointer"
                                style={{
                                    backgroundColor: colorMap[c],
                                    border: selectedColor === c ? "2px solid #3b82f6" : "1px solid #d1d5db",
                                }}
                                title={c}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div>
                    <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Sort */}
                <div>
                    <h3 className="font-semibold mb-2">Sort By</h3>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded">
                        {sortOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-3/4">
                <h1 className="text-3xl font-bold mb-6">
                    {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
                            <div className="h-72 relative mb-4 rounded overflow-hidden">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-600">${product.price}</p>
                            <p className="text-sm text-gray-400">Color: {product.color}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubCategoryPage;
