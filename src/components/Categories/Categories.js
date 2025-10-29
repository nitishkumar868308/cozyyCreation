// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
// import { useDispatch, useSelector } from "react-redux";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(200);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);

//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);

//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Filter products
//     let filteredProducts = products.filter((p) => {
//         const categoryMatch = selectedCategory === "All" || p.categoryId === selectedCategory;
//         const subcategoryMatch = selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;
//         const priceMatch = p.price <= priceRange;
//         return categoryMatch && subcategoryMatch && priceMatch;
//     });

//     // Sort products
//     if (sortBy === "Price: Low to High") filteredProducts.sort((a, b) => a.price - b.price);
//     else filteredProducts.sort((a, b) => b.price - a.price);

//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {!isDesktop && (
//                 <div className="mb-4 flex justify-end">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         {showFilters ? "Hide Filters" : "Show Filters"}
//                     </button>
//                 </div>
//             )}

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"} `}>
//                 {/* Sidebar */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Category & Subcategory */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Category</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     key="all-categories"
//                                     onClick={() => { setSelectedCategory("All"); setSelectedSubcategory("All"); }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""}`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory("All"); }}
//                                             className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""}`}
//                                         >
//                                             {cat.name}
//                                         </div>
//                                         {/* Subcategories */}
//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 {subcategories
//                                                     .filter(sc => sc.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => setSelectedSubcategory(sub.id)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""}`}
//                                                         >
//                                                             {sub.name}
//                                                         </li>
//                                                     ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
//                             <input
//                                 type="range"
//                                 min={0}
//                                 max={200}
//                                 value={priceRange}
//                                 onChange={(e) => setPriceRange(e.target.value)}
//                                 className="w-full"
//                             />
//                         </div>

//                         {/* Sort */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Sort By</h3>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 {sortOptions.map((opt) => (
//                                     <option key={opt} value={opt}>
//                                         {opt}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}

//                 {/* Products */}
//                 <div className="w-full md:w-3/4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                         {filteredProducts.map((product) => (
//                             <div
//                                 key={product.id}
//                                 className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                 onClick={() => router.push(`/product/${product.id}`)}
//                             >
//                                 <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                     {(
//                                         Array.isArray(product.image)
//                                             ? product.image[0]
//                                             : product.image
//                                     ) ? (
//                                         <Image
//                                             src={Array.isArray(product.image) ? product.image[0] : product.image}
//                                             alt={product.name || "Product Image"}
//                                             fill
//                                             className="object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                             No Image
//                                         </div>
//                                     )}
//                                 </div>

//                                 <h3 className="text-lg font-semibold">{product.name}</h3>
//                                 <p className="text-gray-600">{product.currencySymbol}{product.price}</p>
//                                 {/* <p className="text-sm text-gray-400">{product.category?.name}</p>
//                                 <p className="text-sm text-gray-400">{product.subcategory?.name}</p> */}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Categories;



// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);
//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(10000);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 6;
//     const [selectedAlphabet, setSelectedAlphabet] = useState("All");


//     // Fetch data
//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     // Responsive check
//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Set selected category/subcategory from URL
//     useEffect(() => {
//         const categoryQuery = searchParams.get("category") || "All";
//         const subcategoryQuery = searchParams.get("subcategory") || "All";

//         // Category id from name
//         const cat = categories.find((c) => c.name.toLowerCase() === categoryQuery.toLowerCase());
//         setSelectedCategory(cat ? cat.id : "All");

//         // Subcategory id from name
//         const sub = subcategories.find(
//             (s) => s.name.toLowerCase() === subcategoryQuery.toLowerCase() && s.categoryId === (cat ? cat.id : null)
//         );
//         setSelectedSubcategory(sub ? sub.id : "All");
//     }, [searchParams, categories, subcategories]);

//     // Filter and sort products
//     const filteredProducts = products
//         .filter(
//             (p) =>
//                 (selectedCategory === "All" || p.categoryId === selectedCategory) &&
//                 (selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory)
//         )
//         .filter((p) =>
//             selectedAlphabet === "All" ||
//             (p.name && p.name.toLowerCase().startsWith(selectedAlphabet.toLowerCase()))
//         )
//         .filter((p) => p.price <= priceRange)
//         .sort((a, b) => (sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price));

//     const indexOfLast = currentPage * productsPerPage;
//     const indexOfFirst = indexOfLast - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };


//     // Handle category click
//     // const handleCategoryClick = (cat) => {
//     //     setSelectedCategory(cat.id);
//     //     setSelectedSubcategory("All");
//     //     router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
//     // };
//     const handleCategoryClick = (cat) => {
//         if (selectedCategory !== cat.id) {
//             // Doosri category select ho rahi hai
//             setSelectedCategory(cat.id);
//             setSelectedSubcategory("All");
//             setCurrentPage(1);
//         } else {
//             // Same category dobara click hua
//             // state change mat karo, bas route refresh karao
//             router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
//             return;
//         }

//         router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`);
//     };

//     // Handle subcategory click
//     const handleSubcategoryClick = (cat, sub) => {
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory(sub.id);
//         setCurrentPage(1);
//         router.push(`/categories?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`);
//     };



//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {!isDesktop && (
//                 <div className="mb-4 flex justify-end">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         {showFilters ? "Hide Filters" : "Show Filters"}
//                     </button>
//                 </div>
//             )}

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
//                 {/* Sidebar Filters */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Categories & Subcategories */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Categories</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     onClick={() => {
//                                         setSelectedCategory("All");
//                                         setSelectedSubcategory("All");
//                                         router.push(`/categories?category=All&subcategory=All`);
//                                     }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
//                                         }`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => handleCategoryClick(cat)}
//                                             className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""
//                                                 }`}
//                                         >
//                                             <span>{cat.name}</span>
//                                             {/* Icon */}
//                                             <span className="text-lg font-bold">
//                                                 {selectedCategory === cat.id ? "−" : "+"}
//                                             </span>
//                                         </div>

//                                         {/* Subcategories */}
//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 {subcategories
//                                                     .filter((s) => s.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => handleSubcategoryClick(cat, sub)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id ? "bg-blue-100 font-semibold" : ""
//                                                                 }`}
//                                                         >
//                                                             {sub.name}
//                                                         </li>
//                                                     ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
//                             <input
//                                 type="range"
//                                 min={0}
//                                 max={200}
//                                 value={priceRange}
//                                 onChange={(e) => setPriceRange(e.target.value)}
//                                 className="w-full"
//                             />
//                         </div>

//                         {/* Sort */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Sort By</h3>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 {sortOptions.map((opt) => (
//                                     <option key={opt} value={opt}>
//                                         {opt}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}

//                 {/* Products Grid */}
//                 <div className="w-full md:w-3/4">
//                     {currentProducts.length > 0 ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                             {currentProducts.map((product) => (
//                                 <div
//                                     key={product.id}
//                                     className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                     onClick={() => router.push(`/product/${product.id}`)}
//                                 >
//                                     <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                         {Array.isArray(product.image) && product.image[0] ? (
//                                             <Image
//                                                 src={product.image[0]}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : product.image ? (
//                                             <Image
//                                                 src={product.image}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : (
//                                             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                                 No Image
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* <div className="space-y-2">
//                                         <h3 className="text-xl font-bold text-gray-900 tracking-tight">
//                                             {product.name}
//                                         </h3>
//                                         <p className="text-lg font-semibold text-gray-600">
//                                             {product.currencySymbol}{product.price}
//                                         </p>
//                                     </div> */}
//                                     {/* <div className="flex items-center justify-between">
//                                         <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
//                                         <span className="bg-blue-100 text-gray-700 font-bold px-3 py-1 rounded-full text-sm">
//                                             {product.currencySymbol}{product.price}
//                                         </span>
//                                     </div> */}
//                                     <div className="flex flex-col">
//                                         <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
//                                         <p className="text-sm text-gray-500">
//                                             Price: <span className="text-xl font-bold text-gray-600">
//                                                 {product.currencySymbol}{product.price}
//                                             </span>
//                                         </p>
//                                     </div>

//                                 </div>
//                             ))}


//                         </div>
//                     ) : (
//                         <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//                             <p className="text-gray-400 text-lg">No products found 😔</p>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 Try changing the category, subcategory, or price filter.
//                             </p>
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                         <button
//                             disabled={currentPage === 1}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === 1
//                                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                 : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Prev
//                         </button>

//                         {Array.from({ length: totalPages }, (_, i) => (
//                             <button
//                                 key={i}
//                                 onClick={() => handlePageChange(i + 1)}
//                                 className={`px-3 py-1 rounded transition ${currentPage === i + 1
//                                     ? "bg-blue-500 text-white font-semibold cursor-default"
//                                     : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                                     }`}
//                             >
//                                 {i + 1}
//                             </button>
//                         ))}

//                         <button
//                             disabled={currentPage === totalPages || totalPages === 0}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
//                                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                 : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Next
//                         </button>
//                     </div>

//                 </div>

//                 <div className="hidden lg:flex flex-col items-center gap-1 ml-6">
//                     <button
//                         onClick={() => setSelectedAlphabet("All")}
//                         className={`px-2 py-1 text-sm rounded ${selectedAlphabet === "All" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
//                     >
//                         All
//                     </button>
//                     {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
//                         <button
//                             key={letter}
//                             onClick={() => setSelectedAlphabet(letter)}
//                             className={`px-2 py-1 text-sm rounded ${selectedAlphabet === letter ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                         >
//                             {letter}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default Categories;


// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);

//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(10000);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 6;
//     const [selectedAlphabet, setSelectedAlphabet] = useState(null); // null = no alphabet filter

//     // Fetch data
//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     // Responsive check
//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Set selected category/subcategory from URL
//     useEffect(() => {
//         const categoryQuery = searchParams.get("category") || "All";
//         const subcategoryQuery = searchParams.get("subcategory") || "All";

//         const cat = categories.find(
//             (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
//         );
//         setSelectedCategory(cat ? cat.id : "All");

//         const sub = subcategories.find(
//             (s) =>
//                 s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
//                 s.categoryId === (cat ? cat.id : null)
//         );
//         setSelectedSubcategory(sub ? sub.id : "All");
//     }, [searchParams, categories, subcategories]);

//     // Step 1: Category + Subcategory + Price + Sort
//     const baseFiltered = products
//         .filter(
//             (p) =>
//                 (selectedCategory === "All" || p.categoryId === selectedCategory) &&
//                 (selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory)
//         )
//         .filter((p) => p.price <= priceRange)
//         .sort((a, b) =>
//             sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
//         );

//     // Step 2: Available Alphabets from current baseFiltered
//     const availableAlphabets = Array.from(
//         new Set(
//             baseFiltered
//                 .map((p) => p.name?.[0]?.toUpperCase())
//                 .filter((ch) => ch >= "A" && ch <= "Z")
//         )
//     ).sort();

//     // Step 3: Final products (alphabet applied)
//     const filteredProducts = baseFiltered.filter(
//         (p) =>
//             !selectedAlphabet ||
//             (p.name && p.name.toUpperCase().startsWith(selectedAlphabet))
//     );

//     const indexOfLast = currentPage * productsPerPage;
//     const indexOfFirst = indexOfLast - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     // Category Click
//     const handleCategoryClick = (cat) => {
//         setSelectedAlphabet(null); // reset alphabet on category change
//         if (selectedCategory !== cat.id) {
//             setSelectedCategory(cat.id);
//             setSelectedSubcategory("All");
//             setCurrentPage(1);
//         } else {
//             router.push(
//                 `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
//             );
//             return;
//         }
//         router.push(
//             `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
//         );
//     };

//     // Subcategory Click
//     const handleSubcategoryClick = (cat, sub) => {
//         setSelectedAlphabet(null); // reset alphabet on subcategory change
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory(sub.id);
//         setCurrentPage(1);
//         router.push(
//             `/categories?category=${encodeURIComponent(
//                 cat.name
//             )}&subcategory=${encodeURIComponent(sub.name)}`
//         );
//     };

//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {/* Toggle Filters for Mobile */}
//             {!isDesktop && (
//                 <div className="mb-4 flex justify-end">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         {showFilters ? "Hide Filters" : "Show Filters"}
//                     </button>
//                 </div>
//             )}

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
//                 {/* Sidebar Filters */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Categories */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Categories</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     onClick={() => {
//                                         setSelectedCategory("All");
//                                         setSelectedSubcategory("All");
//                                         setSelectedAlphabet(null);
//                                         router.push(`/categories?category=All&subcategory=All`);
//                                     }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All"
//                                             ? "bg-blue-200 font-semibold"
//                                             : ""
//                                         }`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => handleCategoryClick(cat)}
//                                             className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id
//                                                     ? "bg-blue-200 font-semibold"
//                                                     : ""
//                                                 }`}
//                                         >
//                                             <span>{cat.name}</span>
//                                             <span className="text-lg font-bold">
//                                                 {selectedCategory === cat.id ? "−" : "+"}
//                                             </span>
//                                         </div>

//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 {subcategories
//                                                     .filter((s) => s.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => handleSubcategoryClick(cat, sub)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id
//                                                                     ? "bg-blue-100 font-semibold"
//                                                                     : ""
//                                                                 }`}
//                                                         >
//                                                             {sub.name}
//                                                         </li>
//                                                     ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Price: Up to ${priceRange}</h3>
//                             <input
//                                 type="range"
//                                 min={0}
//                                 max={200}
//                                 value={priceRange}
//                                 onChange={(e) => setPriceRange(e.target.value)}
//                                 className="w-full"
//                             />
//                         </div>

//                         {/* Sort */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Sort By</h3>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 {sortOptions.map((opt) => (
//                                     <option key={opt} value={opt}>
//                                         {opt}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}

//                 {/* Products Grid */}
//                 <div className="w-full md:w-3/4">
//                     {currentProducts.length > 0 ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                             {currentProducts.map((product) => (
//                                 <div
//                                     key={product.id}
//                                     className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                     onClick={() => router.push(`/product/${product.id}`)}
//                                 >
//                                     <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                         {Array.isArray(product.image) && product.image[0] ? (
//                                             <Image
//                                                 src={product.image[0]}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : product.image ? (
//                                             <Image
//                                                 src={product.image}
//                                                 alt={product.name || "Product Image"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         ) : (
//                                             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                                 No Image
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="flex flex-col">
//                                         <h3 className="text-lg font-semibold text-gray-900">
//                                             {product.name}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             Price:{" "}
//                                             <span className="text-xl font-bold text-gray-600">
//                                                 {product.currencySymbol}
//                                                 {product.price}
//                                             </span>
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//                             <p className="text-gray-400 text-lg">No products found 😔</p>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 Try changing the category, subcategory, price, or alphabet
//                                 filter.
//                             </p>
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                         <button
//                             disabled={currentPage === 1}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === 1
//                                     ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                     : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Prev
//                         </button>

//                         {Array.from({ length: totalPages }, (_, i) => (
//                             <button
//                                 key={i}
//                                 onClick={() => handlePageChange(i + 1)}
//                                 className={`px-3 py-1 rounded transition ${currentPage === i + 1
//                                         ? "bg-blue-500 text-white font-semibold cursor-default"
//                                         : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                                     }`}
//                             >
//                                 {i + 1}
//                             </button>
//                         ))}

//                         <button
//                             disabled={currentPage === totalPages || totalPages === 0}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
//                                     ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                     : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                 }`}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>

//                 {/* Dynamic Alphabet Sidebar */}
//                 <div className="hidden lg:flex flex-col items-center gap-1 ml-6">
//                     {availableAlphabets.map((letter) => (
//                         <button
//                             key={letter}
//                             onClick={() => setSelectedAlphabet(letter)}
//                             className={`px-2 py-1 text-sm rounded ${selectedAlphabet === letter
//                                     ? "bg-blue-500 text-white"
//                                     : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                         >
//                             {letter}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Categories;


// "use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";

// const sortOptions = ["Price: Low to High", "Price: High to Low"];

// const Categories = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const dispatch = useDispatch();
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const { categories } = useSelector((state) => state.category);

//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("All");
//     const [priceRange, setPriceRange] = useState(10000);
//     const [sortBy, setSortBy] = useState(sortOptions[0]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const productsPerPage = 6;
//     const [selectedAlphabet, setSelectedAlphabet] = useState(null);

//     // Fetch Data
//     useEffect(() => {
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     // Responsive Check
//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Set from URL
//     useEffect(() => {
//         const categoryQuery = searchParams.get("category") || "All";
//         const subcategoryQuery = searchParams.get("subcategory") || "All";

//         const cat = categories.find(
//             (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
//         );
//         setSelectedCategory(cat ? cat.id : "All");

//         const sub = subcategories.find(
//             (s) =>
//                 s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
//                 s.categoryId === (cat ? cat.id : null)
//         );
//         setSelectedSubcategory(sub ? sub.id : "All");
//     }, [searchParams, categories, subcategories]);

//     // Step 1: Decide viewMode
//     let viewMode = "products";
//     if (selectedCategory !== "All" && selectedSubcategory === "All") {
//         viewMode = "subcategories";
//     }

//     // Step 2: Filter Products
//     let baseFiltered = [];
//     if (viewMode === "products") {
//         baseFiltered = products
//             .filter((p) =>
//                 selectedCategory === "All"
//                     ? true
//                     : p.categoryId === selectedCategory &&
//                     (selectedSubcategory === "All" ||
//                         p.subcategoryId === selectedSubcategory)
//             )
//             .filter((p) => p.price <= priceRange)
//             .sort((a, b) =>
//                 sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
//             );
//     }

//     // Step 3: Alphabets
//     const availableAlphabets =
//         viewMode === "products"
//             ? Array.from(
//                 new Set(
//                     baseFiltered
//                         .map((p) => p.name?.[0]?.toUpperCase())
//                         .filter((ch) => ch >= "A" && ch <= "Z")
//                 )
//             ).sort()
//             : [];

//     // Step 4: Apply Alphabet Filter
//     const filteredProducts =
//         viewMode === "products"
//             ? baseFiltered.filter(
//                 (p) =>
//                     !selectedAlphabet ||
//                     (p.name && p.name.toUpperCase().startsWith(selectedAlphabet))
//             )
//             : [];

//     const indexOfLast = currentPage * productsPerPage;
//     const indexOfFirst = indexOfLast - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     // Handlers
//     const handleCategoryClick = (cat) => {
//         setSelectedAlphabet(null);
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory("All");
//         setCurrentPage(1);
//         router.push(
//             `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
//         );
//     };

//     const handleSubcategoryClick = (cat, sub) => {
//         setSelectedAlphabet(null);
//         setSelectedCategory(cat.id);
//         setSelectedSubcategory(sub.id);
//         setCurrentPage(1);
//         router.push(
//             `/categories?category=${encodeURIComponent(
//                 cat.name
//             )}&subcategory=${encodeURIComponent(sub.name)}`
//         );
//     };

//     return (
//         <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro">
//             {/* Mobile Filters Toggle */}
//             {!isDesktop && (
//                 <div className="mb-4 flex justify-end">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                     >
//                         {showFilters ? "Hide Filters" : "Show Filters"}
//                     </button>
//                 </div>
//             )}

//             <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
//                 {/* Sidebar */}
//                 {(isDesktop || showFilters) && (
//                     <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
//                         <h2 className="text-xl font-bold">Filters</h2>

//                         {/* Categories */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Categories</h3>
//                             <ul className="flex flex-col gap-2">
//                                 <li
//                                     onClick={() => {
//                                         setSelectedCategory("All");
//                                         setSelectedSubcategory("All");
//                                         setSelectedAlphabet(null);
//                                         router.push(`/categories?category=All&subcategory=All`);
//                                     }}
//                                     className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
//                                         }`}
//                                 >
//                                     All
//                                 </li>
//                                 {categories.map((cat) => (
//                                     <li key={cat.id} className="mb-2">
//                                         <div
//                                             onClick={() => handleCategoryClick(cat)}
//                                             className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id
//                                                     ? "bg-blue-200 font-semibold"
//                                                     : ""
//                                                 }`}
//                                         >
//                                             <span>{cat.name}</span>
//                                             <span className="text-lg font-bold">
//                                                 {selectedCategory === cat.id ? "−" : "+"}
//                                             </span>
//                                         </div>

//                                         {selectedCategory === cat.id && (
//                                             <ul className="ml-4 mt-1 flex flex-col gap-1">
//                                                 <li
//                                                     onClick={() =>
//                                                         router.push(
//                                                             `/categories?category=${encodeURIComponent(
//                                                                 cat.name
//                                                             )}&subcategory=All`
//                                                         )
//                                                     }
//                                                     className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === "All" ? "bg-blue-100" : ""
//                                                         }`}
//                                                 >
//                                                     All
//                                                 </li>
//                                                 {subcategories
//                                                     .filter((s) => s.categoryId === cat.id)
//                                                     .map((sub) => (
//                                                         <li
//                                                             key={sub.id}
//                                                             onClick={() => handleSubcategoryClick(cat, sub)}
//                                                             className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id
//                                                                     ? "bg-blue-100 font-semibold"
//                                                                     : ""
//                                                                 }`}
//                                                         >
//                                                             {sub.name}
//                                                         </li>
//                                                     ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <h3 className="font-semibold mb-2">
//                                 Price: Up to ${priceRange}
//                             </h3>
//                             <input
//                                 type="range"
//                                 min={0}
//                                 max={200}
//                                 value={priceRange}
//                                 onChange={(e) => setPriceRange(e.target.value)}
//                                 className="w-full"
//                             />
//                         </div>

//                         {/* Sort */}
//                         <div>
//                             <h3 className="font-semibold mb-2">Sort By</h3>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 {sortOptions.map((opt) => (
//                                     <option key={opt} value={opt}>
//                                         {opt}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}

//                 {/* Content */}
//                 <div className="w-full md:w-3/4">
//                     {/* Case 2: Subcategories view */}
//                     {viewMode === "subcategories" && (
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
//                             {subcategories
//                                 .filter((s) => s.categoryId === selectedCategory)
//                                 .map((sub) => (
//                                     <div
//                                         key={sub.id}
//                                         onClick={() =>
//                                             handleSubcategoryClick(
//                                                 categories.find((c) => c.id === selectedCategory),
//                                                 sub
//                                             )
//                                         }
//                                         className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center"
//                                     >
//                                         <h3 className="text-lg font-semibold text-gray-900">
//                                             {sub.name}
//                                         </h3>
//                                     </div>
//                                 ))}
//                         </div>
//                     )}

//                     {/* Case 1 & 3: Products */}
//                     {viewMode === "products" && (
//                         <>
//                             {currentProducts.length > 0 ? (
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
//                                     {currentProducts.map((product) => (
//                                         <div
//                                             key={product.id}
//                                             className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
//                                             onClick={() => router.push(`/product/${product.id}`)}
//                                         >
//                                             <div className="h-72 relative mb-4 rounded overflow-hidden">
//                                                 {Array.isArray(product.image) && product.image[0] ? (
//                                                     <Image
//                                                         src={product.image[0]}
//                                                         alt={product.name || "Product Image"}
//                                                         fill
//                                                         className="object-cover"
//                                                     />
//                                                 ) : product.image ? (
//                                                     <Image
//                                                         src={product.image}
//                                                         alt={product.name || "Product Image"}
//                                                         fill
//                                                         className="object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//                                                         No Image
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             <div className="flex flex-col">
//                                                 <h3 className="text-lg font-semibold text-gray-900">
//                                                     {product.name}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-500">
//                                                     Price:{" "}
//                                                     <span className="text-xl font-bold text-gray-600">
//                                                         {product.currencySymbol}
//                                                         {product.price}
//                                                     </span>
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//                                     <p className="text-gray-400 text-lg">No products found 😔</p>
//                                     <p className="text-gray-500 text-sm mt-1">
//                                         Try changing the category, subcategory, price, or alphabet
//                                         filter.
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Pagination */}
//                             <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                                 <button
//                                     disabled={currentPage === 1}
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     className={`px-4 py-2 rounded transition ${currentPage === 1
//                                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                             : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                         }`}
//                                 >
//                                     Prev
//                                 </button>

//                                 {Array.from({ length: totalPages }, (_, i) => (
//                                     <button
//                                         key={i}
//                                         onClick={() => handlePageChange(i + 1)}
//                                         className={`px-3 py-1 rounded transition ${currentPage === i + 1
//                                                 ? "bg-blue-500 text-white font-semibold cursor-default"
//                                                 : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
//                                             }`}
//                                     >
//                                         {i + 1}
//                                     </button>
//                                 ))}

//                                 <button
//                                     disabled={currentPage === totalPages || totalPages === 0}
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
//                                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                             : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
//                                         }`}
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 {/* Alphabets */}
//                 {viewMode === "products" && (
//                     <div className="hidden lg:flex flex-col items-center gap-1 ml-6">
//                         {availableAlphabets.map((letter) => (
//                             <button
//                                 key={letter}
//                                 onClick={() => setSelectedAlphabet(letter)}
//                                 className={`px-2 py-1 text-sm rounded ${selectedAlphabet === letter
//                                         ? "bg-blue-500 text-white"
//                                         : "bg-gray-100 hover:bg-gray-200"
//                                     }`}
//                             >
//                                 {letter}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Categories;


"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchFastProducts } from "@/app/redux/slices/products/productSlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { fetchTags } from "@/app/redux/slices/tag/tagSlice";


const sortOptions = ["Price: Low to High", "Price: High to Low"];

const Categories = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);
    const { tags } = useSelector((state) => state.tags);
    const [selectedTag, setSelectedTag] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubcategory, setSelectedSubcategory] = useState("All");
    const highestPrice = products.length
        ? Math.max(...products.map((p) => p.price || 0))
        : 10000;
    const [priceRange, setPriceRange] = useState(highestPrice);
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [showFilters, setShowFilters] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const [selectedAlphabet, setSelectedAlphabet] = useState(null);
    useEffect(() => {
        setPriceRange(highestPrice);
    }, [highestPrice]);
    useEffect(() => {
        dispatch(fetchFastProducts());
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
        dispatch(fetchTags());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const categoryQuery = searchParams.get("category") || "All";
        const subcategoryQuery = searchParams.get("subcategory") || "All";

        const cat = categories.find(
            (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
        );
        setSelectedCategory(cat ? cat.id : "All");

        const sub = subcategories.find(
            (s) =>
                s.name.toLowerCase() === subcategoryQuery.toLowerCase() &&
                s.categoryId === (cat ? cat.id : null)
        );
        setSelectedSubcategory(sub ? sub.id : "All");
    }, [searchParams, categories, subcategories]);

    // Filter products
    // const baseFiltered = products
    //     .filter(
    //         (p) =>
    //             p.active &&
    //             (selectedCategory === "All" || p.categoryId === selectedCategory) &&
    //             (selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory)
    //     )
    //     .filter((p) => p.price <= priceRange)
    //     .sort((a, b) =>
    //         sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
    //     );
    const baseFiltered = products
        .filter((p) => {
            const matchCategory =
                selectedCategory === "All" || p.categoryId === selectedCategory;
            const matchSubcategory =
                selectedSubcategory === "All" || p.subcategoryId === selectedSubcategory;
            const matchTag =
                selectedTag === "All" ||
                (Array.isArray(p.tags)
                    ? p.tags.some(
                        (t) => (String(t?.name || t || "")).toLowerCase() === selectedTag.toLowerCase()
                    )
                    : false);


            return p.active && matchCategory && matchSubcategory && matchTag && p.price <= priceRange;
        })
        .sort((a, b) =>
            sortBy === "Price: Low to High" ? a.price - b.price : b.price - a.price
        );


    // Determine if we should show subcategory cards instead of products
    const showSubcategoryCards =
        selectedCategory !== "All" && selectedSubcategory === "All";

    // Alphabets (dynamic)
    const availableAlphabets = Array.from(
        new Set(
            (showSubcategoryCards
                ? subcategories
                    .filter((s) => s.categoryId === selectedCategory)
                    .map((s) => s.name?.[0]?.toUpperCase())
                : baseFiltered.map((p) => p.name?.[0]?.toUpperCase())
            ).filter((ch) => ch >= "A" && ch <= "Z")
        )
    ).sort();

    // Final products
    const filteredProducts = baseFiltered.filter(
        (p) =>
            !selectedAlphabet ||
            (p.name && p.name.toUpperCase().startsWith(selectedAlphabet))
    );

    const displayedItems = showSubcategoryCards
        ? subcategories
            .filter((s) => s.categoryId === selectedCategory)
            .filter((s) =>
                !selectedAlphabet || (s.name && s.name.toUpperCase().startsWith(selectedAlphabet))
            )
        : filteredProducts;

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Category Click
    const handleCategoryClick = (cat) => {
        setSelectedAlphabet(null);
        setSelectedCategory(cat.id);
        setSelectedSubcategory("All");
        setCurrentPage(1);
        router.push(
            `/categories?category=${encodeURIComponent(cat.name)}&subcategory=All`
        );
    };

    // Subcategory Click
    const handleSubcategoryClick = (cat, sub) => {
        setSelectedAlphabet(null);
        setSelectedCategory(cat.id);
        setSelectedSubcategory(sub.id);
        setCurrentPage(1);
        router.push(
            `/categories?category=${encodeURIComponent(
                cat.name
            )}&subcategory=${encodeURIComponent(sub.name)}`
        );
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSubcategory, priceRange, sortBy, selectedAlphabet, showSubcategoryCards]);

    return (
        <div className="md:flex-row gap-6 p-6 max-w-7xl mx-auto font-functionPro relative">
            {/* Toggle Filters for Mobile */}
            {!isDesktop && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>
            )}

            <div className={`flex ${isDesktop ? "flex-row gap-6" : "flex-col"}`}>
                {/* Sidebar Filters */}
                {(isDesktop || showFilters) && (
                    <div className="w-full md:w-1/4 bg-white p-6 space-y-6 mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">Filters</h2>

                        {/* Categories */}
                        <div>
                            <h3 className="font-semibold mb-2">Categories</h3>
                            <ul className="flex flex-col gap-2">
                                <li
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedSubcategory("All");
                                        setSelectedAlphabet(null);
                                        router.push(`/categories?category=All&subcategory=All`);
                                    }}
                                    className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedCategory === "All" ? "bg-blue-200 font-semibold" : ""
                                        }`}
                                >
                                    All
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id} className="mb-2">
                                        <div
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`cursor-pointer flex items-center justify-between p-2 rounded hover:bg-blue-100 ${selectedCategory === cat.id ? "bg-blue-200 font-semibold" : ""
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-lg font-bold">
                                                {selectedCategory === cat.id ? "−" : "+"}
                                            </span>
                                        </div>

                                        {selectedCategory === cat.id &&
                                            subcategories.filter((s) => s.categoryId === cat.id).length > 0 &&
                                            selectedSubcategory !== "All" && (
                                                <ul className="ml-4 mt-1 flex flex-col gap-1">
                                                    {subcategories
                                                        .filter((s) => s.categoryId === cat.id)
                                                        .map((sub) => (
                                                            <li
                                                                key={sub.id}
                                                                onClick={() => handleSubcategoryClick(cat, sub)}
                                                                className={`cursor-pointer p-1 rounded hover:bg-blue-50 text-sm ${selectedSubcategory === sub.id
                                                                    ? "bg-blue-100 font-semibold"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                {sub.name}
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="font-semibold mb-2">Tags</h3>
                            <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                <li
                                    onClick={() => setSelectedTag("All")}
                                    className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedTag === "All" ? "bg-blue-200 font-semibold" : ""
                                        }`}
                                >
                                    All
                                </li>
                                {tags.map((tag) => (
                                    <li
                                        key={tag.id}
                                        onClick={() => setSelectedTag(tag.name)}
                                        className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${selectedTag === tag.name ? "bg-blue-200 font-semibold" : ""
                                            }`}
                                    >
                                        {tag.name}
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/* Price */}
                        <div>
                            <h3 className="font-semibold mb-2">
                                Price: {products[0]?.currency} {products[0]?.currencySymbol || "₹"}{priceRange}
                            </h3>
                            <input
                                type="range"
                                min={0}
                                max={highestPrice}
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full cursor-pointer accent-gray-500"
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="font-semibold mb-2">Sort By</h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full cursor-pointer p-2 border rounded"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Products or Subcategory Grid */}
                <div className="w-full md:w-3/4 relative">
                    {showSubcategoryCards ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                            {displayedItems.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                                    onClick={() => handleSubcategoryClick(
                                        categories.find(c => c.id === selectedCategory),
                                        sub
                                    )}
                                >
                                    <div className="h-72 relative mb-4 rounded overflow-hidden">
                                        {sub.image ? (
                                            <Image
                                                src={sub.image}
                                                alt={sub.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {sub.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : currentProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
                                    onClick={() => router.push(`/product/${product.id}`)}
                                >
                                    <div className="h-72 relative mb-4 rounded overflow-hidden">
                                        {Array.isArray(product.image) && product.image[0] ? (
                                            <Image
                                                src={product.image[0]}
                                                alt={product.name || "Product Image"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name || "Product Image"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Price:{" "}
                                            <span className="text-xl font-bold text-gray-600">
                                                {product.currency} {product.currencySymbol}{product.price}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-400 text-lg">No products found 😔</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Try changing the category, subcategory, price, or alphabet filter.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {!showSubcategoryCards && (
                        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`px-4 py-2 rounded transition ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                                    }`}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 rounded transition ${currentPage === i + 1
                                        ? "bg-gray-600 text-white font-semibold cursor-default"
                                        : "bg-gray-100 hover:bg-gray-400 cursor-pointer"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`px-4 py-2 rounded transition ${currentPage === totalPages || totalPages === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Dynamic Alphabet Sidebar */}
                {/* {isDesktop && (
                    <div className="hidden md:flex  flex-col gap-4 ml-4 sticky top-20">
                        {availableAlphabets.map((letter) => (
                            <button key={letter} onClick={() => setSelectedAlphabet(letter)} className={`w-8 h-8 cursor-pointer flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300
          ${selectedAlphabet === letter ? "bg-gray-500  text-white shadow-lg scale-110" : "bg-gray-100 hover:bg-gray-200 hover:scale-105"}`}>
                                {letter}
                            </button>
                        ))}
                    </div>
                )} */}
                {isDesktop && (
                    <div className="hidden md:flex flex-col gap-4 ml-4 sticky top-20">
                        {availableAlphabets.map((letter) => {
                            const isSelected = selectedAlphabet === letter;
                            return (
                                <div key={letter} className="relative flex items-center justify-center">
                                    {/* Alphabet Button */}
                                    <button
                                        onClick={() =>
                                            setSelectedAlphabet((prev) => (prev === letter ? null : letter))
                                        }
                                        className={`group w-8 h-8 cursor-pointer flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300
              ${isSelected
                                                ? "bg-gray-500 text-white shadow-lg scale-110"
                                                : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                                            }`}
                                    >
                                        {letter}

                                        {/* Tooltip (only on button hover now) */}
                                        <div className="absolute left-10 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300 whitespace-nowrap">
                                            {isSelected ? "Click again to deselect" : "Click to select"}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}


                {/* Mobile Alphabet Sidebar */}
                {/* {!isDesktop && (
                    <div className="fixed right-0 z-30 cursor-pointer  flex flex-col gap-5 p-1 overflow-y-auto">
                        {availableAlphabets.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => setSelectedAlphabet(letter)}
                                className={`
          text-sm font-semibold t
          ${selectedAlphabet === letter
                                        ? "  "
                                        : "bg-gray-400 text-white"
                                    }
        `}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                )} */}
                {!isDesktop && (
                    <div className="fixed right-0 z-30 cursor-pointer flex flex-col gap-5 p-1 overflow-y-auto">
                        {availableAlphabets.map((letter) => (
                            <button
                                key={letter}
                                onClick={() =>
                                    setSelectedAlphabet((prev) => (prev === letter ? null : letter))
                                }
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300
          ${selectedAlphabet === letter
                                        ? "bg-gray-500 text-white shadow-lg scale-110"
                                        : "bg-gray-400 text-white hover:bg-gray-500 hover:scale-105"
                                    }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Categories;
