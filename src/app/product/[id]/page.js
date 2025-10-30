"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductSlider from "@/components/Product/Product";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { addToCartAsync, fetchCart, clearCartAsync } from "@/app/redux/slices/addToCart/addToCartSlice";
import Loader from "@/components/Include/Loader";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { useCountries } from "@/lib/CustomHook/useCountries";
import { AlertTriangle } from "lucide-react";
import ProductOffers from "@/components/Product/ProductOffers/ProductOffers";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);
    const { countries } = useCountries();
    console.log("countries", countries)
    const [loading, setLoading] = useState(false);
    const { products } = useSelector((state) => state.products);
    const [userCart, setUserCart] = useState([]);
    const { offers } = useSelector((state) => state.offers);
    const params = useParams();
    const { id } = params;
    const [currentProduct, setCurrentProduct] = useState(null);
    const product = currentProduct;
    const [quantity, setQuantity] = useState(1);
    const [variationAttributes, setVariationAttributes] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [currentImages, setCurrentImages] = useState(
        selectedVariation?.image || product?.image || []
    );
    const [mainImage, setMainImage] = useState(
        selectedVariation?.image?.[0] || product?.image?.[0] || "/image/logo PNG.png"
    );
    const [reviewForm, setReviewForm] = useState({
        name: "",
        rating: 0,
        comment: "",
    });
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [newCountry, setNewCountry] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const { user } = useSelector((state) => state.me);
    const { items } = useSelector((state) => state.cart);
    const country = useSelector((state) => state.country);
    console.log("user", user)


    useEffect(() => {
        const prod = products.find((p) => p.id == id);
        console.log("prod", prod)
        setCurrentProduct(prod || null);
    }, [products, id]);
    // const product = products.find((p) => p.id === id);


    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchMe());
        dispatch(fetchProducts()); // always fetch for current country
        dispatch(fetchOffers());
    }, [dispatch, country]); // <-- refetch whenever country changes

    useEffect(() => {
        if (!currentProduct) return;
        console.log("currentProduct", currentProduct)
        // Reset selected attributes based on new product
        const attrs = {};
        currentProduct.variations?.forEach((v) => {
            const parts = v.variationName.split(" / ");
            parts.forEach((part) => {
                const [key, val] = part.split(":").map((p) => p.trim());
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(val);
            });
        });

        const finalAttrs = {};
        Object.entries(attrs).forEach(([k, v]) => (finalAttrs[k] = Array.from(v)));
        setVariationAttributes(finalAttrs);

        // Reset selected attributes
        const initialSelected = {};
        if (currentProduct?.isDefault) {
            Object.entries(finalAttrs).forEach(([attr, values]) => {
                initialSelected[attr] = currentProduct.isDefault[attr] || values[0];
            });
        } else {
            Object.entries(finalAttrs).forEach(([attr, values]) => {
                initialSelected[attr] = values[0];
            });
        }
        setSelectedAttributes(initialSelected);

        // Match variation
        const matchedVariation = currentProduct.variations?.find((v) => {
            const parts = parseVariationName(v.variationName);
            return Object.entries(initialSelected).every(
                ([k, val]) => parts[k.toLowerCase()] === val.toLowerCase()
            );
        }) || null;

        setSelectedVariation(matchedVariation);

        // Set main image
        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]);
        } else if (currentProduct.image?.length) {
            setCurrentImages(currentProduct.image);
            setMainImage(currentProduct.image[0]);
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    }, [currentProduct]);


    console.log("productsId", products)
    // useEffect(() => {
    //     dispatch(fetchCart())
    //     dispatch(fetchMe())
    //     if (!products.length) dispatch(fetchProducts());
    //     dispatch(fetchOffers());
    // }, [dispatch, products.length]);
    // useEffect(() => {
    //     if (user && selectedVariation) {
    //         // Find if the user already has this variation in cart
    //         const existingCartItem = user.carts?.find(
    //             (item) =>
    //                 item.productId === product.id &&
    //                 item.variationId === selectedVariation.id
    //         );

    //         if (existingCartItem) {
    //             setQuantity(existingCartItem.quantity);
    //         } else {
    //             setQuantity(1); // default
    //         }
    //     }
    // }, [user, selectedVariation, product]);

    useEffect(() => {
        if (items && Array.isArray(items) && user?.id) {
            const filtered = items.filter((item) => item.userId == String(user.id));
            setUserCart(filtered);
        }
    }, [items, user]);


    useEffect(() => {
        if (!product?.variations?.length) return;

        const attrs = {};

        product.variations.forEach(v => {
            const parts = v.variationName.split(" / ");
            parts.forEach(part => {
                const [key, val] = part.split(":").map(p => p.trim());
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(val);
            });
        });

        // Convert sets to arrays
        const finalAttrs = {};
        Object.entries(attrs).forEach(([k, v]) => finalAttrs[k] = Array.from(v));

        setVariationAttributes(finalAttrs);
    }, [product?.variations]);

    // useEffect(() => {
    //     if (!product?.variations?.length || !variationAttributes || !Object.keys(variationAttributes).length) return;

    //     // Auto-select first value of each attribute
    //     const initialSelected = {};
    //     Object.entries(variationAttributes).forEach(([attr, values]) => {
    //         if (values.length) initialSelected[attr] = values[0];
    //     });
    //     setSelectedAttributes(initialSelected);

    //     // Match the first variation
    //     const matchingVariations = product.variations.filter(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, val] = part.split(":").map(p => p.trim());
    //             acc[k] = val;
    //             return acc;
    //         }, {});
    //         return Object.entries(initialSelected).every(([k, val]) => parts[k] === val);
    //     });

    //     const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

    //     setSelectedVariation(matchedVariation);

    //     // Set main image & thumbnails
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // }, [product?.id, product?.variations?.length, Object.keys(variationAttributes).length]);

    useEffect(() => {
        if (!product?.variations?.length || !variationAttributes || !Object.keys(variationAttributes).length) return;

        let initialSelected = {};

        if (product?.isDefault && Object.keys(product.isDefault).length > 0) {
            // ✅ Use isDefault attributes first
            initialSelected = { ...product.isDefault };

            // अगर किसी attribute का default value variationAttributes में मौजूद नहीं है
            Object.entries(variationAttributes).forEach(([attr, values]) => {
                if (!initialSelected[attr] && values.length) {
                    initialSelected[attr] = values[0];
                }
            });
        } else {
            // ✅ Fallback: select first value of each attribute
            Object.entries(variationAttributes).forEach(([attr, values]) => {
                if (values.length) initialSelected[attr] = values[0];
            });
        }

        setSelectedAttributes(initialSelected);

        // Match the variation with initialSelected
        const matchingVariations = product.variations.filter(v => {
            const parts = v.variationName.split(" / ").reduce((acc, part) => {
                const [k, val] = part.split(":").map(p => p.trim());
                acc[k] = val;
                return acc;
            }, {});
            return Object.entries(initialSelected).every(([k, val]) => parts[k] === val);
        });

        const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

        setSelectedVariation(matchedVariation);

        // Set main image & thumbnails
        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]);
        } else if (product.image?.length) {
            setCurrentImages(product.image);
            setMainImage(product.image[0]);
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    }, [product?.id, product?.variations?.length, Object.keys(variationAttributes).length]);


    // const handleAttributeSelect = (attrName, val) => {
    //     const newSelected = { ...selectedAttributes, [attrName]: val };
    //     setSelectedAttributes(newSelected);

    //     // Filter variations that match the selected attributes
    //     const matchingVariations = product.variations.filter(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, v] = part.split(":").map(p => p.trim());
    //             acc[k] = v;
    //             return acc;
    //         }, {});
    //         return Object.entries(newSelected).every(([k, v]) => parts[k] === v);
    //     });

    //     // Pick the first variation that has an image
    //     const matchedVariation = matchingVariations.find(v => v.image?.length) || matchingVariations[0] || null;

    //     setSelectedVariation(matchedVariation);

    //     // Update mainImage & currentImages
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]);
    //     } else if (!matchedVariation && product.image?.length) {
    //         setCurrentImages(product.image);
    //         setMainImage(product.image[0]);
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }
    // };
    const parseVariationName = (variationName = "") => {
        return variationName.split(" / ").reduce((acc, part) => {
            const [k, v] = part.split(":").map(p => p.trim().toLowerCase());
            acc[k] = v;
            return acc;
        }, {});
    };

    const handleAttributeSelect = (attrName, val) => {
        const newSelected = { ...selectedAttributes, [attrName]: val };
        setSelectedAttributes(newSelected);

        const matchedVariation = product.variations.find(v => {
            const parts = parseVariationName(v.variationName);
            return Object.entries(newSelected).every(
                ([k, v]) => parts[k.toLowerCase()] === v.toLowerCase()
            );
        });

        setSelectedVariation(matchedVariation || null);

        if (matchedVariation?.image?.length) {
            setCurrentImages(matchedVariation.image);
            setMainImage(matchedVariation.image[0]?.trim() || "/image/logo PNG.png");
        } else if (product.image?.length) {
            setCurrentImages(product.image);
            setMainImage(product.image[0]?.trim() || "/image/logo PNG.png");
        } else {
            setCurrentImages([]);
            setMainImage(null);
        }
    };


    // const handleAttributeSelect = (attrName, val) => {
    //     const newSelected = { ...selectedAttributes, [attrName]: val };
    //     setSelectedAttributes(newSelected);

    //     const matchedVariation = product.variations.find(v => {
    //         const parts = v.variationName.split(" / ").reduce((acc, part) => {
    //             const [k, v] = part.split(":").map(p => p.trim());
    //             acc[k] = v;
    //             return acc;
    //         }, {});
    //         return Object.entries(newSelected).every(([k, v]) => parts[k] === v);
    //     });

    //     setSelectedVariation(matchedVariation || null);
    //     if (matchedVariation?.image?.length) {
    //         setCurrentImages(matchedVariation.image);
    //         setMainImage(matchedVariation.image[0]?.trim() || "/image/logo PNG.png");
    //     } else if (!matchedVariation && product.image?.length) {
    //         setCurrentImages(product.image);
    //         setMainImage(product.image[0]?.trim() || "/image/logo PNG.png");
    //     } else {
    //         setCurrentImages([]);
    //         setMainImage(null);
    //     }

    // };


    // Thumbnails: only show if more than 1 image
    const thumbnailImages = currentImages.length > 1 ? currentImages.filter(img => img !== mainImage) : [];

    const increment = () => setQuantity(quantity + 1);
    const decrement = () => quantity > 1 && setQuantity(quantity - 1);

    const productWithOffer = products.map(product => {
        // get all offer names from the product's offers array
        const offerDescriptions = product.offers?.map(o => o.name).filter(Boolean) || [];

        return {
            ...product,
            offerDescriptions, // note plural
        };
    });



    if (!product)
        return <p className="text-center mt-20 text-gray-500 text-xl">Product not found</p>;

    // const addToCart = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to add items to your cart.");
    //         return;
    //     }

    //     const isAlreadyInCart = userCart?.some(
    //         (item) =>
    //             item.productId === product.id &&
    //             item.variationId === (selectedVariation?.id || null)
    //     );

    //     if (isAlreadyInCart) {
    //         toast.error("This product is already in your cart!");
    //         return;
    //     }

    //     setLoading(true);
    //     const price = selectedVariation?.price || product.price;
    //     const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //     const totalPrice = price * quantity;

    //     const flatAttributes = {};
    //     Object.entries(selectedAttributes).forEach(([key, val]) => {
    //         if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //     });

    //     const cartItem = {
    //         productName: product.name,
    //         quantity,
    //         pricePerItem: price,
    //         currencySymbol,
    //         totalPrice,
    //         productId: product.id,
    //         variationId: selectedVariation?.id || null,
    //         attributes: flatAttributes,
    //         userId: user.id,
    //         image: mainImage || "No Image",
    //     };

    //     try {
    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success(result.message || "Item added to cart!");
    //         dispatch(fetchCart())
    //     } catch (err) {
    //         toast.error(err.message || "Failed to delete product");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Assume `countries` array is already available (250 countries)
    const addToCart = async () => {
        if (!user || !user.id) {
            toast.error("Please login to add items to your cart.");
            return;
        }

        let selectedCountryCode = localStorage.getItem("selectedCountry");
        if (!selectedCountryCode) {
            toast.error("Something went wrong! Country not found.");
            return;
        }

        selectedCountryCode = selectedCountryCode.toUpperCase();

        // 🔹 Find full country name dynamically from `countries` array
        let selectedCountryObj = countries.find(
            (c) => c.code.toUpperCase() === selectedCountryCode
        );

        // 🔹 If not found by 3-letter code, try first 2 letters (alpha-2 fallback)
        if (!selectedCountryObj && selectedCountryCode.length === 3) {
            selectedCountryObj = countries.find(
                (c) => c.code.toUpperCase().startsWith(selectedCountryCode.slice(0, 2))
            );
        }

        const selectedCountry = selectedCountryObj?.name || selectedCountryCode;

        // ✅ Cart country check
        if (userCart && userCart.length > 0) {
            const cartCountry = userCart[0]?.selectedCountry;
            if (cartCountry && cartCountry !== selectedCountry) {
                setNewCountry(selectedCountry); // jo country add karni hai
                setShowCountryModal(true);      // modal show karo
                return; // wait for user action in modal
            }
        }


        // ✅ Duplicate check
        const isAlreadyInCart = userCart?.some(
            (item) =>
                item.productId === product.id &&
                item.variationId === (selectedVariation?.id || null)
        );
        if (isAlreadyInCart) {
            toast.error("This product is already in your cart!");
            return;
        }

        setLoading(true);

        const price = selectedVariation?.price || product.price;
        const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
        const currency = selectedVariation?.currency || product.currency || "₹";
        console.log("currency", currency)
        const totalPrice = price * quantity;

        const flatAttributes = {};
        Object.entries(selectedAttributes).forEach(([key, val]) => {
            if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
        });

        const cartItem = {
            productName: product.name,
            quantity,
            pricePerItem: price,
            currency,
            currencySymbol,
            totalPrice,
            productId: product.id,
            variationId: selectedVariation?.id || null,
            attributes: flatAttributes,
            userId: user.id,
            image: mainImage || "No Image",
            selectedCountry, // ✅ full country name dynamically
        };
        try {
            const result = await dispatch(addToCartAsync(cartItem)).unwrap();
            toast.success(result.message || "Item added to cart!");
            dispatch(fetchCart());
        } catch (err) {
            toast.error(err.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    


    const clearCart = async () => {
        if (!user || !user.id) {
            toast.error("Please login to clear cart.");
            return;
        }

        try {
            await dispatch(clearCartAsync(user.id)).unwrap();
            toast.success("Cart cleared! You can now add items from the new country.");
            setShowCountryModal(false);
        } catch (err) {
            toast.error(err.message || "Failed to clear cart.");
        }
    };




    // const buyNow = async () => {
    //     if (!user || !user.id) {
    //         toast.error("Please login to continue.");
    //         return;
    //     }

    //     setLoading(true);
    //     const price = selectedVariation?.price || product.price;
    //     const currencySymbol = selectedVariation?.currencySymbol || product.currencySymbol || "₹";
    //     const totalPrice = price * quantity;

    //     const flatAttributes = {};
    //     Object.entries(selectedAttributes).forEach(([key, val]) => {
    //         if (val && val !== "N/A") flatAttributes[key.toLowerCase()] = val;
    //     });

    //     const cartItem = {
    //         productName: product.name,
    //         quantity,
    //         pricePerItem: price,
    //         currencySymbol,
    //         totalPrice,
    //         productId: product.id,
    //         variationId: selectedVariation?.id || null,
    //         attributes: flatAttributes,
    //         userId: String(user.id),
    //         image: mainImage || "No Image",
    //     };

    //     try {
    //         const result = await dispatch(addToCartAsync(cartItem)).unwrap();
    //         toast.success("Redirecting to checkout...");
    //         router.push("/checkout"); // 👈 Seedha checkout page pe le jao
    //     } catch (err) {
    //         toast.error(err.message || "Failed to process Buy Now");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmitReview = () => {
        console.log("Submitted review:", reviewForm);
        // You can call your API here to save the review
        // After submission, reset the form
        setReviewForm({ name: "", rating: 0, comment: "" });
    };

    // Displayed price with bulk logic
    const displayedPrice = () => {
        const price = selectedVariation?.price ?? product.price;
        const bulkPrice = product.bulkPrice ?? null;
        const minQty = product.minQuantity ?? null;

        if (minQty && bulkPrice && quantity >= minQty) {
            return { original: price, discounted: bulkPrice }; // return object for UI
        }
        return { original: price };
    };

    // Check rangeBuyXGetY offer applied
    const getRangeOfferApplied = (offer) => {
        if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
        const { start, end, free } = offer.discountValue || {};
        if (quantity >= start && quantity <= end) {
            const payQty = quantity - free; // number of items to pay for
            return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
        }
        return null;
    };

    // const isInCart = user?.carts?.some(
    //     (item) =>
    //         item.productId === product.id &&
    //         item.variationId === selectedVariation?.id
    // );

    const existingCartItem = user?.carts?.find(
        (item) =>
            item.productId === product.id &&
            item.variationId === selectedVariation?.id
    );
    const existingCartQuantity = existingCartItem?.quantity ?? 0;

    return (
        <>
            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-12">
                {loading && <Loader />}
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                        {mainImage && mainImage.trim() ? (
                            <>
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <span className="loader border-4 border-gray-300 border-t-blue-600 rounded-full w-10 h-10 animate-spin"></span>
                                    </div>
                                )}
                                <Zoom>
                                    <Image
                                        src={mainImage?.trim() || "/image/logo PNG.png"}   // ✅ empty string handle
                                        alt={product.name || "Product Image"}
                                        fill
                                        className={`object-contain w-full h-full cursor-zoom-in transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                                            }`}
                                        onLoadingComplete={() => setImageLoaded(true)}
                                        unoptimized
                                    />
                                </Zoom>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>



                    <div className="flex gap-3 mt-4 flex-wrap">
                        {/* {mainImage && thumbnailImages.length > 0 && thumbnailImages.map((img, index) => (
                            <img
                                key={img || index}
                                src={img}
                                alt={`${product.name}-${index}`}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? "border-blue-600 scale-105" : "border-gray-300 hover:scale-105"
                                    }`}
                            />
                        ))} */}
                        {mainImage && thumbnailImages.length > 0 && thumbnailImages
                            .filter(img => img?.trim())
                            .map((img, index) => (
                                <img
                                    key={img || index}
                                    src={img || undefined}
                                    alt={`${product.name}-${index}`}
                                    onClick={() => setMainImage(img)}
                                    // unoptimized
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? "border-blue-600 scale-105" : "border-gray-300 hover:scale-105"}`}
                                />
                            ))
                        }



                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col justify-between font-functionPro">
                    <div>
                        <h1 className="text-5xl mb-6 text-[#162a33]">  {selectedVariation?.name || product.name}</h1>
                        {/* <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            {(selectedVariation?.currency ?? product.currency) + " "}
                            {(selectedVariation?.currencySymbol ?? product.currencySymbol)}
                            {selectedVariation?.price ?? product.price}


                        {selectedVariation?.price ?? product.price}
                        </p> */}
                        {/* <p className="text-3xl text-gray-700 mb-6 font-semibold">
                            {(selectedVariation?.currency ?? product.currency) + " "}
                            {(selectedVariation?.currencySymbol ?? product.currencySymbol)}
                            {displayedPrice()}
                        </p> */}
                        <p className="text-3xl text-[#162a33] mb-6 font-semibold">
                            {(selectedVariation?.currency ?? product.currency) + " "}

                            {(() => {
                                const priceObj = displayedPrice();
                                return priceObj.discounted
                                    ? <>
                                        <span className="line-through text-gray-500 mr-2">{priceObj.original}</span>
                                        <span>{priceObj.discounted}</span>
                                    </>
                                    : priceObj.original;
                            })()}
                        </p>

                        <p className="text-lg text-[#162a33] mb-8 leading-relaxed">
                            {selectedVariation?.short || product.short}
                        </p>


                        {Object.entries(variationAttributes).map(([attrKey, values]) => {
                            let sortedValues = [...values];
                            const defaultVal = product?.isDefault?.[attrKey];
                            if (defaultVal && sortedValues.includes(defaultVal)) {
                                sortedValues = [defaultVal, ...sortedValues.filter(v => v !== defaultVal)];
                            }
                            return (
                                <div key={attrKey} className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-700">
                                        {attrKey}
                                    </h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {sortedValues.map(val => (
                                            <button
                                                key={`${attrKey}-${val}`}
                                                onClick={() => handleAttributeSelect(attrKey, val)}
                                                className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 transform 
                        ${selectedAttributes[attrKey] === val
                                                        ? "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white shadow-lg scale-105"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            {[...new Map(product.offers.map(o => [o.id, o])).values()].map((offer, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm"
                                >
                                    <span className="font-semibold">🔥 </span>
                                    <span>{offer.description}</span>
                                </div>
                            ))}
                        </div> */}


                        {/* <div className="p-4 rounded-md shadow-sm bg-green-200 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
                            {[...new Map([...product.offers, product.minQuantity && product.bulkPrice ? {
                                id: "bulk-offer",
                                description: quantity >= product.minQuantity
                                    ? `Bulk price applied: ${product.currencySymbol}${product.bulkPrice} each`
                                    : `Buy ${product.minQuantity}+ items to get ${product.currencySymbol}${product.bulkPrice} each`,
                                type: ["product"],
                                applied: quantity >= product.minQuantity
                            } : null].filter(Boolean).map(o => [o.id, o])).values()].map((offer, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="font-semibold">🔥 {offer.description}</span>
                                    {offer.applied && <span className="ml-2 text-sm font-medium text-green-700">Applied ✅</span>}
                                </div>
                            ))}
                        </div> */}
                        {/* <div className="p-4 rounded-md shadow-sm bg-green-200 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
                            {[...new Map([...product.offers, product.minQuantity && product.bulkPrice ? {
                                id: "bulk-offer",
                                description: quantity >= product.minQuantity
                                    ? `Bulk price applied: ${product.currencySymbol}${product.bulkPrice} each`
                                    : `Buy ${product.minQuantity}+ items to get ${product.currencySymbol}${product.bulkPrice} each`,
                                type: ["product"],
                                applied: quantity >= product.minQuantity,
                                discountType: "bulk"
                            } : null].filter(Boolean).map(o => [o.id, o])).values()].map((offer, index) => {
                                // Range offer applied message
                                const rangeAppliedMsg = getRangeOfferApplied(offer);

                                return (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="font-semibold">
                                            {offer.discountType === "rangeBuyXGetY"
                                                ? `Buy minimum ${offer.discountValue.start}, get ${offer.discountValue.free} free`
                                                : offer.description
                                            }
                                        </span>
                                        {offer.applied && <span className="ml-2 text-sm font-medium text-green-700">Applied ✅</span>}
                                        {rangeAppliedMsg && <span className="ml-2 text-sm font-medium text-green-700">{rangeAppliedMsg}</span>}
                                    </div>
                                );
                            })}
                        </div> */}

                        <ProductOffers selectedVariation={selectedVariation} product={product} quantity={quantity} />
                        {/* {(product.offers?.length > 0 || (product.minQuantity && product.bulkPrice)) && (
                            <div className="mt-4 text-sm text-gray-800 space-y-2">

                           
                                {product.offers && product.offers.length > 0 && (
                                    <div>
                                        {[...new Map(product.offers.map(o => [o.id, o])).values()].map((offer, index) => (
                                            <div key={index} className="flex items-start gap-1">
                                                <span className="text-yellow-600">🔥</span>
                                                <span>
                                                    <strong>{offer.title ? `${offer.title}: ` : ""}</strong>
                                                    {offer.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {product.minQuantity && product.bulkPrice && (
                                    <div className="flex items-center gap-1 text-green-700">
                                        <span>💰</span>
                                        <span>
                                            Buy <strong>{product.minQuantity}+</strong> items at{" "}
                                            <strong>{product.currencySymbol || "₹"}{product.bulkPrice}</strong> each
                                        </span>
                                    </div>
                                )}

                            </div>
                        )} */}



                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <button
                                        onClick={decrement}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-2xl"
                                    >
                                        -
                                    </button>
                                    <span className="px-8 py-3 text-2xl font-medium">{quantity}</span>
                                    <button
                                        onClick={increment}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 transition cursor-pointer text-2xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={addToCart}
                                    className="px-10 py-4 bg-[#162a33] text-[#f3ce8e] rounded-lg hover:bg-[#162a33] transition cursor-pointer shadow-lg text-xl"
                                >
                                    Add to Cart
                                </button>
                                {/* <button
                                    onClick={addToCart}
                                    className="px-10 py-4 bg-gray-700 text-white rounded-lg hover:bg-black transition cursor-pointer shadow-lg text-xl"
                                >
                                    {isInCart ? "Update Cart" : "Add to Cart"}
                                </button> */}


                                {product.matchedMarketLink && (
                                    <a
                                        href={product.matchedMarketLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                    >
                                        <img
                                            src="/image/amazon-button.png"
                                            alt={`Buy in ${product.matchedMarketLink.countryName}`}
                                            className="w-40 h-auto hover:scale-105 transition-transform cursor-pointer"
                                        />
                                    </a>
                                )}
                            </div>
                        </div>


                        <p className="text-gray-700 mt-3">
                            {existingCartQuantity > 0
                                ? `Already in your cart: ${existingCartQuantity}`
                                : ""}
                        </p>
                        <p className="text-lg text-gray-600 mt-8 leading-relaxed">
                            Tag: {Array.isArray(selectedVariation?.tags)
                                ? selectedVariation.tags.map(tag => tag.name).join(", ")
                                : Array.isArray(product.tags)
                                    ? product.tags.map(tag => tag.name).join(", ")
                                    : "No tags"}
                        </p>
                        {/* Buy Button / Market Link */}
                        {/* {product.matchedMarketLink ? (
                            <a
                                href={product.matchedMarketLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-lg text-xl mt-6 inline-block text-center"
                            >
                                Buy in {product.matchedMarketLink.countryName}
                            </a>
                        ) : (
                            <p className="text-gray-500 mt-6">Not available in your country</p>
                        )} */}



                    </div>
                </div>



            </div>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row flex-none  overflow-hidden shadow-md rounded-xl">
                    {/* Tabs */}
                    <div className="flex md:flex-col w-full md:w-1/4 flex-none bg-gray-100">
                        {["description", "reviews"].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
              w-full px-5 py-3 text-left font-medium cursor-pointer transition-all duration-300
              ${isActive
                                            ? "bg-gray-700 border-l-4 border-gray-900 text-white"
                                            : "text-gray-500 hover:bg-gray-200"}
            `}
                                >
                                    {tab === "description"
                                        ? "Description"
                                        : `Reviews (${product.reviews?.length || 0})`}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="w-full md:w-3/4 bg-white px-6 pb-6 flex-grow">
                        <AnimatePresence mode="wait">
                            {activeTab === "description" && (
                                <motion.div
                                    key="description"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-700 space-y-4"
                                >
                                    <div className="space-y-6">
                                        {/* {product.description
                                            .replace(/\\'/g, "'")
                                            .split("\n\n")
                                            .map((para, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-black text-base leading-loose font-medium tracking-normal"
                                                >
                                                    {para}
                                                </p>
                                            ))} */}

                                        {selectedVariation?.description && (
                                            <div
                                                className="text-gray-700 text-base leading-loose font-medium tracking-normal italic"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(product.description)
                                                }}
                                            />

                                        )}
                                    </div>



                                </motion.div>
                            )}

                            {activeTab === "reviews" && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col space-y-4 h-[650px]"
                                >
                                    {/* Fixed form at top */}
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-800 mb-4 text-center">Add Your Review</h4>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmitReview();
                                            }}
                                            className="space-y-4"
                                        >
                                            {/* Name */}
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={reviewForm.name}
                                                onChange={(e) =>
                                                    setReviewForm({ ...reviewForm, name: e.target.value })
                                                }
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                required
                                            />

                                            {/* Message */}
                                            <textarea
                                                placeholder="Write your review..."
                                                value={reviewForm.comment}
                                                onChange={(e) =>
                                                    setReviewForm({ ...reviewForm, comment: e.target.value })
                                                }
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                rows={4}
                                                required
                                            ></textarea>

                                            {/* Rating */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="font-semibold text-gray-800">Rating:</span>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                        className={`text-3xl md:text-4xl cursor-pointer transition-all duration-200 ${reviewForm.rating >= star ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-yellow-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>


                                            {/* Submit Button */}
                                            <div className="flex justify-center ">
                                                <button
                                                    type="submit"
                                                    className="bg-gray-600 cursor-pointer text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
                                                >
                                                    Submit Review
                                                </button>
                                            </div>

                                        </form>
                                    </div>

                                    {/* Reviews list - scrollable */}
                                    <div className="overflow-y-auto flex-1 space-y-4 pr-2 mt-2">
                                        {(product.reviews && product.reviews.length > 0
                                            ? product.reviews
                                            : Array.from({ length: 10 }, (_, i) => ({
                                                user: `User ${i + 1}`,
                                                rating: Math.floor(Math.random() * 5) + 1,
                                                comment: "This is a dummy review for testing purposes.",
                                            }))
                                        ).map((review, idx) => (
                                            <div
                                                key={idx}
                                                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-800">{review.user}</h4>
                                                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {showCountryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Cart Conflict</h2>
                        <p className="mb-6 text-gray-700">
                            Your current cart has items from{" "}
                            <span className="font-bold text-red-600">{userCart[0]?.selectedCountry}</span>.{" "}
                            To add products from{" "}
                            <span className="font-bold text-green-600">{newCountry}</span>, you must clear your cart.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                onClick={() => {
                                    setShowCountryModal(false);
                                    const currentCartCountry = userCart[0]?.selectedCountry || "your current country";
                                    toast.custom((t) => (
                                        <div
                                            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                                                } max-w-xs w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 shadow-md rounded-md flex items-center gap-2`}
                                        >
                                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                            <span>
                                                Cart not cleared. You can continue with items from {currentCartCountry}.
                                            </span>
                                        </div>
                                    ), { duration: 2000 });
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <div className="mt-16 w-full">
                <ProductSlider showSection="related" />
            </div>
        </>
    );
};

export default ProductDetail;
