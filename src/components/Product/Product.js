// "use client";
// import { useEffect, useRef, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Heart, ShoppingCart } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { HandRaisedIcon } from '@heroicons/react/24/outline';
// import {
//     fetchProducts,
// } from "@/app/redux/slices/products/productSlice";
// import { useSelector, useDispatch } from "react-redux";

// function useInView(threshold = 0.2) {
//     const ref = useRef(null);
//     const [inView, setInView] = useState(false);

//     useEffect(() => {
//         if (!ref.current) return;

//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 setInView(entry.isIntersecting);
//             },
//             { threshold }
//         );

//         observer.observe(ref.current);

//         return () => observer.disconnect();
//     }, [threshold]);

//     return { ref, inView };
// }

// const ProductSlider = () => {
//     const [showDemo, setShowDemo] = useState(true);
//     const router = useRouter();
//     const { ref, inView } = useInView(0.2);
//     const { products, loading } = useSelector((state) => state.products);
//     const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(fetchProducts());
//     }, [dispatch]);
//     useEffect(() => {
//         if (inView) {
//             setShowDemo(true);
//             const timer = setTimeout(() => setShowDemo(false), 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [inView]);
//     console.log("products", products)

//     const handleProductClick = (id) => {
//         router.push(`/product/${id}`);
//     };
//     return (
//         <>
//             <div ref={ref} className="w-full px-4 py-8 relative">
//                 <h2 className="text-2xl mb-6 font-functionPro">Featured Products</h2>

//                 {/* DEMO OVERLAY */}
//                 {showDemo && (
//                     <div className="absolute inset-0 z-20 flex items-center justify-center
//                     bg-black/40 backdrop-blur-sm">
//                         {/* Swipe Text on left */}
//                         <p className="text-white font-semibold text-lg mr-4">
//                             Swipe right to explore
//                         </p>

//                         {/* Animated Hand on right */}
//                         <motion.div
//                             className="w-16 h-16 text-white"
//                             animate={{ x: [0, 40, 0] }}
//                             transition={{ repeat: Infinity, duration: 1.5 }}
//                         >
//                             <HandRaisedIcon className="rotate-90 w-full h-full text-white" />
//                         </motion.div>
//                     </div>
//                 )}

//                 {/* SLIDER */}
//                 <Swiper
//                     modules={[Navigation, Pagination, Autoplay]}
//                     spaceBetween={20}
//                     slidesPerView={1}
//                     autoplay={{ delay: 3000 }}
//                     breakpoints={{
//                         640: { slidesPerView: 1 },
//                         768: { slidesPerView: 2 },
//                         1024: { slidesPerView: 3 },
//                         1280: { slidesPerView: 4 },
//                     }}
//                 >
//                     {products
//                         .filter(product => product.active)
//                         .map((product) => (
//                             <SwiperSlide key={product.id}>
//                                 <div className="relative group overflow-hidden">
//                                     <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
//                                         {product.image ? (
//                                             <Image
//                                                 src={Array.isArray(product.image) ? product.image[0] : product.image}
//                                                 alt={product.name}
//                                                 fill
//                                                 className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer rounded-lg"
//                                                 onClick={() => handleProductClick(product.id)}
//                                             />
//                                         ) : (
//                                             // fallback agar image nahi hai
//                                             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
//                                                 No Image
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Hover icons */}
//                                     <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                         <button
//                                             className="bg-white p-2 rounded-full shadow hover:bg-red-100"
//                                             onClick={() => alert(`${product.name} added to wishlist`)}
//                                         >
//                                             <Heart size={20} color="red" />
//                                         </button>
//                                         <button
//                                             className="bg-white p-2 rounded-full shadow hover:bg-green-100"
//                                             onClick={() => alert(`${product.name} added to cart`)}
//                                         >
//                                             <ShoppingCart size={20} color="green" />
//                                         </button>
//                                     </div>

//                                     <div className="p-4 bg-white rounded-b-lg text-center font-functionPro">
//                                         <h3 className="text-lg text-gray-900 truncate">{product.name}</h3>
//                                         <p className="mt-1 text-gray-500 text-sm">{product.currencySymbol}{product.price}</p>
//                                     </div>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                 </Swiper>
//             </div>
//             <div className="w-full px-4 py-8">
//                 <h2 className="text-2xl  mb-6 font-functionPro">Related Products</h2>
//                 <Swiper
//                     modules={[Navigation, Pagination, Autoplay]}
//                     spaceBetween={20}
//                     slidesPerView={1}
//                     // navigation
//                     // pagination={{ clickable: true }}
//                     autoplay={{ delay: 3000 }}
//                     breakpoints={{
//                         640: { slidesPerView: 1 },
//                         768: { slidesPerView: 2 },
//                         1024: { slidesPerView: 3 },
//                         1280: { slidesPerView: 4 },
//                     }}
//                 >
//                     {products.map((product) => (
//                         <SwiperSlide key={product.id}>
//                             <div className="relative group overflow-hidden">
//                                 <div className="relative w-full h-[400px] md:h-[400px] lg:h-[500px]">
//                                     {product.image ? (
//                                         <Image
//                                             src={Array.isArray(product.image) ? product.image[0] : product.image}
//                                             alt={product.name}
//                                             fill
//                                             className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer rounded-lg"
//                                             onClick={() => handleProductClick(product.id)}
//                                         />
//                                     ) : (
//                                         // fallback agar image nahi hai
//                                         <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
//                                             No Image
//                                         </div>
//                                     )}
//                                 </div>


//                                 {/* Hover icons */}
//                                 <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity ">
//                                     <button
//                                         className="bg-white p-2 rounded-full shadow hover:bg-red-100 cursor-pointer"
//                                         onClick={() => alert(`${product.name} added to wishlist`)}
//                                     >
//                                         <Heart size={20} color="red" />
//                                     </button>
//                                     <button
//                                         className="bg-white p-2 rounded-full shadow hover:bg-green-100 cursor-pointer"
//                                         onClick={() => alert(`${product.name} added to cart`)}
//                                     >
//                                         <ShoppingCart size={20} color="green" />
//                                     </button>
//                                 </div>
//                                 <div className="p-4 bg-white rounded-b-lg text-center font-functionPro">
//                                     <h3 className="text-lg  text-gray-900 truncate font-functionPro">{product.name}</h3>
//                                     <p className="mt-1 text-gray-500 text-sm">{product.currencySymbol}{product.price}</p>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </>

//     );
// };

// export default ProductSlider;


"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { fetchFastProducts } from "@/app/redux/slices/products/productSlice";
import { useSelector, useDispatch } from "react-redux";

function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

const ProductSlider = ({ showSection = "both" }) => {
    const [showDemo, setShowDemo] = useState(true);
    const router = useRouter();
    const { ref, inView } = useInView(0.2);
    const { fastProducts } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    console.log("fastProducts ", fastProducts)
    useEffect(() => {
        dispatch(fetchFastProducts());
    }, [dispatch]);

    useEffect(() => {
        if (inView) {
            setShowDemo(true);
            const timer = setTimeout(() => setShowDemo(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [inView]);

    const handleProductClick = (id) => {
        router.push(`/product/${id}`);
    };

    // Reusable slider JSX
    const renderSlider = (items) => (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
            }}
        >
            {items.map((product) => (
                <SwiperSlide key={product.id}>
                    {/* <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
             
                        <div className="relative w-full h-72 md:h-80 lg:h-96">
                            {product.image ? (
                                <Image
                                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-t-xl cursor-pointer"
                                    onClick={() => handleProductClick(product.id)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-xl text-lg font-semibold">
                                    No Image
                                </div>
                            )}
                        </div>

                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <button
                                className="bg-white p-3 rounded-full shadow-lg hover:bg-red-100 transition-colors duration-300"
                                onClick={() => alert(`${product.name} added to wishlist`)}
                            >
                                <Heart size={22} color="red" />
                            </button>
                            <button
                                className="bg-white p-3 rounded-full shadow-lg hover:bg-green-100 transition-colors duration-300"
                                onClick={() => alert(`${product.name} added to cart`)}
                            >
                                <ShoppingCart size={22} color="green" />
                            </button>
                        </div>

                        <div className="p-5 text-center">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
                                {product.name}
                            </h3>
                            <p className="mt-2 text-lg md:text-xl text-gray-700 font-medium">
                                {product.currencySymbol}{product.price}
                            </p>
                        </div>
                    </div> */}
                    <div className="relative group w-full overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white cursor-pointer">
                        {/* Image */}
                        <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[500px]">
                            {/* {product.image ? (
                                <Image
                                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-xl"
                                    onClick={() => handleProductClick(product.id)}
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-semibold rounded-xl">
                                    No Image
                                </div>
                            )} */}
                            {product.image && product.image.length > 0 ? (
                                <Image
                                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-xl"
                                    onClick={() => handleProductClick(product.id)}
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-semibold rounded-xl">
                                    No Image
                                </div>
                            )}


                            {/* Text overlay at bottom */}
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-center rounded-b-xl">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm sm:text-base md:text-lg text-gray-200 font-medium drop-shadow-lg">
                                    {product.currency} {product.currencySymbol}{product.price}
                                </p>


                            </div>
                        </div>
                    </div>


                </SwiperSlide>
            ))}
        </Swiper>
    );

    const newArrivals = [...fastProducts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

    return (
        <>
            {(showSection.includes('both') || showSection.includes('featured')) && (
                <div ref={ref} className="w-full px-4 py-8 relative">
                    <h2 className="text-2xl mb-6 font-functionPro">Featured Products</h2>
                    {/* ONLY Featured has demo overlay */}
                    {showSection.includes('featured') && showDemo && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <p className="text-white font-semibold text-lg mr-4">Swipe right to explore</p>
                            <motion.div
                                className="w-16 h-16 text-white"
                                animate={{ x: [0, 40, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <HandRaisedIcon className="rotate-90 w-full h-full text-white" />
                            </motion.div>
                        </div>
                    )}
                    {renderSlider(fastProducts.filter(p => p.active))}
                </div>
            )}


            {(showSection.includes('both') || showSection.includes('related')) && (
                <div className="w-full px-4 py-8">
                    <h2 className="text-2xl mb-6 font-functionPro">Related Products</h2>
                    {renderSlider(fastProducts)}
                </div>
            )}

            {(showSection.includes('both') || showSection.includes('new')) && (
                <div className="w-full px-4 py-8">
                    <h2 className="text-2xl mb-6 font-functionPro">New Arrivals</h2>
                    {renderSlider(newArrivals)}
                </div>
            )}
        </>
    );
};

export default ProductSlider;
