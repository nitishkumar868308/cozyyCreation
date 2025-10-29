"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { fetchTags } from "@/app/redux/slices/tag/tagSlice";

const SearchPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const modalRef = useRef(null);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const { tags, } = useSelector((state) => state.tags);
    const { products } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);
    console.log("products", products)

    // Fetch data
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
        dispatch(fetchTags())
    }, [dispatch]);

    // Close modal on click outside or Esc key
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [open]);

    // Combine and filter results
    // const combinedResults = [
    //     ...(products || []).map((item) => ({ ...item, type: "Product" })),
    //     ...(subcategories || []).map((item) => ({ ...item, type: "Subcategory" })),
    //     ...(categories || []).map((item) => ({ ...item, type: "Category" })),
    //     ...(tags || []).map((item) => ({ ...item, type: "Tag" })),
    // ];

    // const normalizedQuery = query.trim().replace(/\s+/g, " ").toLowerCase();

    // const filtered =
    //     normalizedQuery === ""
    //         ? []
    //         : combinedResults.filter((item) =>
    //             item.name.toLowerCase().includes(normalizedQuery)
    //         );
    // Combine and filter results
    const combinedResults = [
        ...(tags || []).map((item) => ({ ...item, type: "Tag" })),
        ...(products || []).map((item) => ({ ...item, type: "Product" })),
        ...(subcategories || []).map((item) => ({ ...item, type: "Subcategory" })),
        ...(categories || []).map((item) => ({ ...item, type: "Category" })),
        
    ];

    // Normalize query
    const normalizedQuery = query.trim().replace(/\s+/g, " ").toLowerCase();
    const queryWords = normalizedQuery.split(" ").filter(Boolean);

    // Smart match function 🔍
    const matchesQuery = (item) => {
        const textFields = [
            item.name,
            item.description,
            item.category?.name,
            item.subcategory?.name,
            Array.isArray(item.tags)
                ? item.tags.map((t) => (typeof t === "string" ? t : t.name)).join(" ")
                : "",
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        // ✅ Flexible matching — allows partial but strong relevance
        const matchCount = queryWords.filter((word) =>
            textFields.includes(word)
        ).length;

        // at least half the words should match
        return matchCount >= Math.ceil(queryWords.length / 2);
    };

    // Apply filter
    const filtered =
        normalizedQuery === ""
            ? []
            : combinedResults.filter((item) => matchesQuery(item));


    console.log("filtered", filtered)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("baseUrl", baseUrl)

    console.log("filtered", filtered)

    return (
        <>
            {/* Search Button */}
            <button
                className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition text-[#f3ce8e] font-medium"
                onClick={() => setOpen(true)}
            >
                <Search className="h-6 w-6" />
                <span className="hidden md:inline">Search</span>
            </button>

            {/* Search Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-sm bg-black/30 pt-24 transition-all duration-300">
                    <div
                        ref={modalRef}
                        className="w-11/12 md:w-2/3 lg:w-1/2 bg-white rounded-2xl shadow-xl p-6 relative animate-slideDown"
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-0 right-2 text-gray-600 hover:text-red-500 text-3xl font-bold cursor-pointer"
                            onClick={() => {
                                setOpen(false);
                                setQuery("");
                            }}
                        >
                            &times;
                        </button>

                        {/* Search Input */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-400 transition">
                            <Search className="h-6 w-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for products, categories, subcategories, tags..."
                                className="w-full text-lg focus:outline-none px-2 py-2 text-black"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        {/* Search Results */}
                        {query && (
                            <div className="mt-4 bg-gray-50 rounded-xl shadow-inner max-h-[24rem] overflow-y-auto">
                                {filtered.length > 0 ? (
                                    filtered.map((item) => (
                                        <div
                                            key={item.id + item.type}
                                            onClick={() => {
                                                let url = "";

                                                if (item.type === "Category") {
                                                    url = `/categories?category=${encodeURIComponent(item.name)}&&subcategory=All`;
                                                } else if (item.type === "Subcategory") {
                                                    url = `/categories?category=${encodeURIComponent(item.category?.name || "")}&&subcategory=${encodeURIComponent(item.name)}`;
                                                } else if (item.type === "Tag") {
                                                    url = `/categories?tag=${encodeURIComponent(item.name)}`;
                                                }
                                                else if (item.type === "Product") {
                                                    url = `/product/${item.id}`;
                                                }


                                                router.push(url);
                                                setQuery("");
                                                setOpen(false);
                                            }}



                                            className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-gray-100 cursor-pointer rounded-xl transition"
                                        >
                                            {/* Text */}
                                            <div className="flex flex-col">
                                                <div className="font-semibold text-black text-lg">{item.name}</div>
                                                <div className="text-gray-500 text-sm mt-1">{item.type}</div>
                                            </div>

                                            {/* Image */}
                                            {item.image && (
                                                <div className="w-16 h-16 relative flex-shrink-0">
                                                    <Image
                                                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded-xl"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-4 text-gray-500 flex items-center gap-2">
                                        <span>No results found</span>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
};

export default SearchPage;
