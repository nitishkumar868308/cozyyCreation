"use client";
import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import AttributesSection from "./AttributesSection";
import VariationsSection from "./VariationsSection";
import ExternalLinks from "./ExternalLinks";
import { useDispatch, useSelector } from "react-redux";
import {
    createProduct,
    updateProduct
} from "@/app/redux/slices/products/productSlice";
import toast from 'react-hot-toast';
import Loader from "@/components/Include/Loader";

const ProductModalWrapper = ({
    attributes,
    modalOpen,
    setModalOpen,
    editModalOpen,
    setEditModalOpen,
    newProduct,
    setNewProduct,
    editProductData,
    setEditProductData,
    productOffers,
    categories,
    subcategories
}) => {
    const [activeSection, setActiveSection] = useState("product");
    const [currentVariations, setCurrentVariations] = useState([]);
    const [variationDetails, setVariationDetails] = useState({});
    const [expandedVariations, setExpandedVariations] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedAttrs, setExpandedAttrs] = useState({});
    const [newImage, setNewImage] = useState([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const getVariationKey = (attrs = {}) => {
        const sorted = Object.keys(attrs)
            .sort()
            .reduce((acc, key) => {
                acc[key] = attrs[key];
                return acc;
            }, {});
        return JSON.stringify(sorted);
    };
    const currentData = editModalOpen ? editProductData : newProduct;
    const setCurrentData = editModalOpen ? setEditProductData : setNewProduct;


    const generateMetaDescription = (description) => {
        if (description) return description.substring(0, 150);
        return "Shop the best products online at YourStore.";
    };

    const generateMetaTitle = (name) => {
        return `${name} | YourStore`;
    };

    // ✅ Generate SKU
    const generateSlug = (name) => {
        if (!name) return "";
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    // const generateSKU = (productName, variation) => {
    //     if (!productName || !variation) return null;
    //     const variationName =
    //         typeof variation === "string"
    //             ? variation
    //             : Array.isArray(variation)
    //                 ? variation.join("-")
    //                 : Object.values(variation).join("-");

    //     const cleanVariation = variationName
    //         .trim()
    //         .replace(/\s+/g, "-")
    //         .replace(/\//g, "-")
    //         .toUpperCase();

    //     const productSlug = generateSlug(productName);
    //     return `${productSlug}-${cleanVariation}`;
    // };

    const variationsData = currentVariations.map(variationObj => {
        const variationKey = JSON.stringify(variationObj); // stringify here too
        const details = variationDetails[variationKey] || {};
        console.log("details", details)

        return {
            // variation_name: Object.values(variationObj)
            //     .map(val => String(val).trim())
            //     .filter(Boolean)
            //     .join(" / "),
            id: details.id,
            variation_name: Object.entries(variationObj)
                .map(([key, val]) => `${key}: ${String(val).trim()}`)
                .filter(Boolean)
                .join(" / "),
            price: details.price ?? newProduct.price ?? null,
            stock: details.stock ?? newProduct.stock ?? null,
            short: details.short ?? newProduct.short ?? null,
            image: details.images ?? [],
            name: details.name ?? newProduct.name ?? null,
            description: details.description ?? newProduct.description ?? null,
            otherCountriesPrice: details.otherCountriesPrice ?? newProduct.otherCountriesPrice ?? null,
            // sku: details.sku ?? generateSKU(
            //     newProduct.name,
            //     Object.entries(variationObj)
            //         .map(([k, v]) => `${k}-${v}`)
            //         .join("-")
            // ),
            sku: details.sku ?? newProduct.sku ?? null,
            tags: details.tags && details.tags.length > 0
                ? details.tags.map(tag => ({ id: tag.id }))   // ✅ only id pass
                : [],
            bulkPrice: details.bulkPrice ?? newProduct.bulkPrice ?? null,
            minQuantity: details.minQuantity ?? newProduct.minQuantity ?? null,
        };
    });
    console.log("variationsData", variationsData)

    const handleSave = () => {
        if (editModalOpen) {
            handleUpdateProduct();
        } else {
            handleCreateProduct();
        }
    };


    const handleCreateProduct = async () => {
        console.log("offer:", newProduct.offer);

        setLoading(true);
        try {
            let imageUrls = [];
            if (newImage) {
                if (Array.isArray(newImage)) {
                    imageUrls = await Promise.all(newImage.map(img => handleImageUpload(img)));
                    console.log("imageUrls", imageUrls)
                } else {
                    const url = await handleImageUpload(newImage);
                    imageUrls = Array.isArray(url) ? url : [url];
                }
            }


            // const productSKU = `${generateSlug(name)}-MAIN-${Date.now()}`;
            console.log("newProduct", newProduct)
            const subcategoryId = parseInt(newProduct.subcategoryId);
            // if (!subcategoryId) return toast.error("Subcategory is required");

            const categoryId = newProduct.categoryId ? parseInt(newProduct.categoryId) : null;
            const validOfferIds = Array.isArray(newProduct.offers)
                ? newProduct.offers
                    .map((o) => (typeof o === "object" ? o.id : o))
                    .filter((id) => id && !isNaN(id))
                : [];
            // Prepare product data including variations
            const productData = {
                name: newProduct.name?.trim() || "",
                //categoryId: newProduct.category,
                //subcategoryId: parseInt(newProduct.subcategoryId),
                //subcategory: { connect: { id: Number(newProduct.subcategoryId) } },
                short: newProduct.short || null,
                description: newProduct.description || null,
                image: imageUrls,
                active: newProduct.active ?? true,
                slug: generateSlug(newProduct.name),
                metaTitle: generateMetaTitle(newProduct.name),
                metaDescription: generateMetaDescription(newProduct.description),
                price: newProduct.price ?? null,
                stock: newProduct.stock ?? null,
                size: newProduct.sizes || [],
                color: newProduct.colors || [],
                sku: newProduct.sku ?? null,
                otherCountriesPrice: newProduct.otherCountriesPrice ?? null,
                minQuantity: newProduct.minQuantity ?? null,
                bulkPrice: newProduct.bulkPrice ?? null,
                marketLinks: (newProduct.marketLinks || []).length > 0
                    ? { connect: newProduct.marketLinks.map(link => ({ id: link.id })) }
                    : undefined,
                isDefault: typeof newProduct.isDefault === "string"
                    ? JSON.parse(newProduct.isDefault)
                    : newProduct.isDefault ?? null,
                offers: validOfferIds.length
                    ? { connect: validOfferIds.map((id) => ({ id: Number(id) })) }
                    : undefined,

                primaryOffer:
                    validOfferIds.length > 0
                        ? { connect: { id: Number(validOfferIds[0]) } }
                        : undefined,
                // offers: newProduct.offers && newProduct.offers.length > 0
                //     ? {
                //         connect: newProduct.offers.map((id) => ({ id: parseInt(id) }))
                //     }
                //     : undefined,

                // primaryOffer: newProduct.offers && newProduct.offers.length > 0
                //     ? { connect: { id: parseInt(newProduct.offers[0]) } }
                //     : undefined,
                tags: newProduct.tags && newProduct.tags.length > 0
                    ? { connect: newProduct.tags.map(tag => ({ id: tag.id })) }
                    : undefined,

                category: categoryId ? { connect: { id: categoryId } } : undefined,
                subcategory: { connect: { id: subcategoryId } },

                variations: variationsData
            };

            console.log("createProduct", productData)
            const res = await dispatch(createProduct(productData)).unwrap();
            toast.success(res.message);
            setNewProduct({
                name: "",
                category: "",
                subcategoryId: "",
                short: "",
                description: "",
                price: "",
                stock: "",
                sizes: null,
                colors: null,
                active: true,
                image: null,
            });
            setSelectedAttributes({});
            setActiveSection("product");
            setCurrentVariations([]);
            setVariationDetails({});
            setNewImage([]);
            setModalOpen(false)
        } catch (err) {
            toast.error(err?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateProduct = async () => {
        setLoading(true);
        let imageUrls = [];
        if (newImage) {
            if (Array.isArray(newImage)) {
                imageUrls = await Promise.all(newImage.map(img => handleImageUpload(img)));
                console.log("imageUrls", imageUrls)
            } else {
                const url = await handleImageUpload(newImage);
                imageUrls = Array.isArray(url) ? url : [url];
            }
        }
        // Flattened variations data
        const formattedVariations = variationsData.map(v => ({
            id: v.id || undefined,
            variationName: v.variation_name,
            name: v.name,
            price: v.price,
            short: v.short,
            stock: v.stock,
            sku: v.sku,
            image: Array.isArray(v.image) ? v.image.flat() : v.image ? [v.image] : [],
            description: v.description,
            tags: v.tags?.map(tag => ({ id: Number(tag.id) })) || [],
            bulkPrice: v.bulkPrice,
            minQuantity: v.minQuantity,
        }));
        console.log("formattedVariations", formattedVariations)

        const productTags = editProductData.tags?.map(tag => ({ id: Number(tag.id) })) || [];
        console.log("editProductData", editProductData)
        const combinedImages = [
            ...(editProductData.image || []), // existing images from DB
            ...imageUrls                        // new uploaded images
        ];
        const cleanedOffers = Array.isArray(editProductData.offers)
            ? editProductData.offers.map(o => Number(o.id || o)).filter(Boolean)
            : [];

        if (editProductData.primaryOffer?.id && !cleanedOffers.includes(Number(editProductData.primaryOffer.id))) {
            cleanedOffers.push(Number(editProductData.primaryOffer.id));

        }
        console.log("cleanedOffers", cleanedOffers)
        const productData = {
            name: editProductData.name,
            short: editProductData.short,
            description: editProductData.description,
            price: editProductData.price,
            stock: editProductData.stock,
            image: combinedImages,
            minQuantity: editProductData.minQuantity ?? null,
            bulkPrice: editProductData.bulkPrice ?? null,
            // offers: editProductData.offers?.length
            //     ? { set: [], connect: editProductData.offers.map(o => ({ id: o.id })) }
            //     : undefined,
            // offers: editProductData.offers?.length
            //     ? { set: [], connect: editProductData.offers.map(o => ({ id: Number(o.id) })) }
            //     : undefined,
            offers: cleanedOffers.length
                ? { set: [], connect: cleanedOffers.map(id => ({ id })) }
                : undefined,
            primaryOffer: editProductData.primaryOffer?.id
                ? { connect: { id: Number(editProductData.primaryOffer.id) } }
                : cleanedOffers.length
                    ? { connect: { id: cleanedOffers[0] } }
                    : undefined,
            // primaryOffer: editProductData.offers?.[0]?.id
            //     ? { connect: { id: Number(editProductData.offers[0].id) } }
            //     : undefined,
            // primaryOffer: editProductData.offers?.length
            //     ? { connect: { id: editProductData.offers[0].id } }
            //     : undefined,
            isDefault: typeof editProductData.isDefault === "string"
                ? JSON.parse(editProductData.isDefault)
                : editProductData.isDefault ?? null,
            categoryId: editProductData.categoryId,
            subcategoryId: editProductData.subcategoryId,
            active: editProductData.active,
            slug: editProductData.slug,
            metaTitle: editProductData.metaTitle,
            metaDescription: editProductData.metaDescription,
            otherCountriesPrice: editProductData.otherCountriesPrice,
            size: editProductData.sizes,
            color: editProductData.colors,
            sku: editProductData.sku,
            tags: productTags || [],
            marketLinks: (editProductData.marketLinks || []).length > 0
                ? { connect: editProductData.marketLinks.map(link => ({ id: link.id })) }
                : undefined,
            variations: formattedVariations,
        };

        console.log("Sending variations:", formattedVariations);
        console.log("productDataEdit", productData)

        try {
            const res = await dispatch(updateProduct({ id: editProductData.id, data: productData })).unwrap();
            toast.success("Product updated successfully!");
            setEditProductData(res);
            setNewImage([]);
            // setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };


    const toggleExpand = (key) => {
        setExpandedVariations((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };


    const removeVariation = (key) => {
        setCurrentVariations((prev) =>
            prev.filter((v) => JSON.stringify(v) !== key) // key is stringified
        );

        const copy = { ...variationDetails };
        delete copy[key];
        setVariationDetails(copy);

        const defaultKeyStr = JSON.stringify(currentData?.isDefault);
        if (defaultKeyStr === key) {
            setCurrentData(prev => ({ ...prev, isDefault: null }));
            setDefaultVariationId("");
        }
    };



    // const removeVariation = (key) => {
    //     setCurrentVariations((prev) =>
    //         prev.filter((v) => getVariationKey(v) !== key)
    //     );
    //     const copy = { ...variationDetails };
    //     delete copy[key];
    //     setVariationDetails(copy);
    // };

    const handleVariationChange = (variationKey, field, value) => {
        setVariationDetails((prev) => ({
            ...prev,
            [variationKey]: {
                ...prev[variationKey],
                [field]: value,
            },
        }));
    };

    const toggleAttributeValue = (attrName, value) => {
        setSelectedAttributes((prev) => {
            const currentValues = prev[attrName]?.values || [];
            return {
                ...prev,
                [attrName]: {
                    ...prev[attrName],
                    values: currentValues.includes(value)
                        ? currentValues.filter((v) => v !== value)
                        : [...currentValues, value],
                },
            };
        });
    };

    const generateSKU = (baseSKU, variation) => {
        if (!baseSKU || !variation) return null;

        // Convert variation object/array/string into a string
        const variationName =
            typeof variation === "string"
                ? variation
                : Array.isArray(variation)
                    ? variation.join("-")
                    : Object.values(variation).join("-");

        // Clean variation string
        const cleanVariation = variationName
            .trim()
            .replace(/\s+/g, "-")
            .replace(/\//g, "-")
            .toUpperCase();

        // Keep the slug logic on baseSKU
        const productSlug = generateSlug(baseSKU);

        return `${productSlug}-${cleanVariation}`;
    };



    // ✅ Handle variation generation from selected attributes
    // useEffect(() => {
    //     const attrValues = Object.values(selectedAttributes)
    //         .filter((a) => a.values?.length)
    //         .map((a) => a.values);

    //     if (attrValues.length === 0) {
    //         setCurrentVariations([]);
    //         return;
    //     }

    //     const cartesian = (arr) =>
    //         arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);

    //     const combinations = cartesian(attrValues);
    //     const attrNames = Object.keys(selectedAttributes);

    //     const newVariationDetails = {};
    //     const variationsWithKeys = combinations.map((comb) => {
    //         const variationObj = comb.reduce((acc, val, idx) => {
    //             acc[attrNames[idx]] = val;
    //             return acc;
    //         }, {});

    //         const variationKey = getVariationKey(variationObj);

    //         const baseSKU = newProduct.sku || "";
    //         const newSKU = variationDetails[variationKey]?.sku ?? generateSKU(baseSKU, variationObj);

    //         newVariationDetails[variationKey] = {
    //             ...(variationDetails[variationKey] || {}),
    //             price: variationDetails[variationKey]?.price || newProduct.price,
    //             short: variationDetails[variationKey]?.short || newProduct.short,
    //             stock: variationDetails[variationKey]?.stock || newProduct.stock,
    //             image:
    //                 variationDetails[variationKey]?.image ||
    //                 newProduct.image?.[0] ||
    //                 null,
    //             name: variationDetails[variationKey]?.name || newProduct.name,
    //             description:
    //                 variationDetails[variationKey]?.description || newProduct.description,
    //             sku: newSKU,
    //             tags: (variationDetails[variationKey]?.tags || newProduct.tags)?.map(tag =>
    //                 typeof tag === 'string' ? { name: tag } : tag
    //             )


    //         };

    //         return variationObj;
    //     });

    //     setVariationDetails(newVariationDetails);
    //     setCurrentVariations(variationsWithKeys);
    // }, [selectedAttributes]);
    // ✅ Handle variation generation from selected attributes
    useEffect(() => {
        if (!currentData) return;

        // Step 1: Map DB variations by variationKey
        const variationMap = {};
        currentData.variations?.forEach((v) => {
            const attrs = v.attributes || parseAttributes(v.variationName);
            const key = getVariationKey(attrs);
            variationMap[key] = v;
        });
        console.log("variationMap", variationMap)

        // Step 2: Get selected attribute values for cartesian product
        const attrValues = Object.values(selectedAttributes)
            .filter(a => a.values?.length)
            .map(a => a.values);
        console.log("attrValues", attrValues)
        if (attrValues.length === 0) {
            setCurrentVariations([]);
            setVariationDetails({});
            return;
        }

        const cartesian = arr =>
            arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);
        console.log("cartesian", cartesian)
        const combinations = cartesian(attrValues);
        const attrNames = Object.keys(selectedAttributes);

        // Step 3: Build variations and variationDetails
        const newVariationDetails = {};
        const variationsWithKeys = combinations.map(comb => {
            const variationObj = comb.reduce((acc, val, idx) => {
                acc[attrNames[idx]] = val ?? "N/A";
                return acc;
            }, {});

            const variationKey = getVariationKey(variationObj);

            // ✅ Use DB variation if exists, otherwise fallback to base product
            const existingVar = variationMap[variationKey];
            console.log("existingVar", existingVar)

            newVariationDetails[variationKey] = {
                id: existingVar?.id,
                price: existingVar?.price ?? currentData.price,
                short: existingVar?.short ?? currentData.short,
                // short: currentData.short,
                stock: existingVar?.stock ?? currentData.stock,
                name: currentData.name,
                //description: currentData.description,
                description: existingVar?.description ?? currentData.description,
                images: existingVar?.image ?? (currentData.image ? [...currentData.image] : []),
                // tags: (existingVar[variationKey]?.tags || currentData.tags)?.map(tag =>
                //     typeof tag === 'string' ? { name: tag } : tag
                // ),
                bulkPrice:
                    existingVar?.bulkPrice && existingVar.bulkPrice.length > 0
                        ? existingVar.bulkPrice
                        : currentData?.bulkPrice && currentData.bulkPrice.length > 0
                            ? currentData.bulkPrice
                            : [],
                minQuantity: existingVar?.minQuantity && existingVar.minQuantity.length > 0
                    ? existingVar.minQuantity
                    : currentData?.minQuantity && currentData.minQuantity.length > 0
                        ? currentData.minQuantity
                        : [],
                tags: existingVar?.tags ?? currentData.tags ?? [],
                marketLinks: existingVar?.marketLinks ?? currentData.marketLinks ?? [],
                sku: existingVar?.sku ?? generateSKU(currentData.sku || "", variationObj),
            };
            // newVariationDetails[variationKey] = {
            //     id: existingVar?.id || null,
            //     price: existingVar?.price ?? currentData?.price ?? newProduct?.price ?? null,
            //     short: existingVar?.short ?? currentData?.short ?? newProduct?.short ?? "",
            //     stock: existingVar?.stock ?? currentData?.stock ?? newProduct?.stock ?? 0,
            //     name: currentData?.name ?? newProduct?.name ?? "",
            //     description: existingVar?.description ?? currentData?.description ?? newProduct?.description ?? "",
            //     images: existingVar?.image ?? currentData?.image ?? newProduct?.image ?? [],
            //     tags: existingVar?.tags ?? currentData?.tags ?? newProduct?.tags ?? [],
            //     marketLinks: existingVar?.marketLinks ?? currentData?.marketLinks ?? newProduct?.marketLinks ?? [],
            //     sku: existingVar?.sku ?? generateSKU(currentData?.sku || newProduct?.sku || "", variationObj),
            // };


            return variationObj;
        });
        console.log("---- VARIATION MAP KEYS ----", Object.keys(variationMap));
        console.log("---- NEW KEYS ----", Object.keys(newVariationDetails));

        setVariationDetails(newVariationDetails);
        setCurrentVariations(variationsWithKeys);

    }, [selectedAttributes, currentData]);



    const parseAttributes = (variationName) => {
        console.log("variationName", variationName)
        if (!variationName) return {};
        // "Color: red1, Size: M" => { Color: "red1", Size: "M" }
        const attrs = {};
        variationName.split("/").forEach((part) => {
            const [key, value] = part.split(":").map(s => s.trim());
            if (key && value) attrs[key] = value;
        });
        return attrs;
    };
    // const parseAttributes = (variationName = "") => {
    //     const attrs = {};
    //     variationName
    //         .split(/[/,|]/)
    //         .map(part => part.trim())
    //         .forEach((part) => {
    //             const [key, value] = part.split(/[:=]/).map(s => s.trim());
    //             if (key && value) attrs[key] = value;
    //         });
    //     return attrs;
    // };




    // ✅ Load variations from DB in edit mode
    useEffect(() => {
        if (!editProductData) return;

        if (editProductData.variations?.length > 0) {
            const dbVariations = editProductData.variations.map((v) => {
                const attrs = parseAttributes(v.variationName);
                console.log("variation raw:", v);
                console.log("variation parsed attrs:", attrs);


                return {
                    ...v,
                    attributes: attrs,
                };
            });

            const dbVariationDetails = {};
            dbVariations.forEach((v) => {
                const key = getVariationKey(v.attributes);

                dbVariationDetails[key] = {
                    id: v.id,
                    short: v.short,
                    price: v.price,
                    stock: v.stock,
                    isDefault: v.isDefault,
                    sku: v.sku,
                    description: v.description,
                    images: v.image ? [v.image] : [],
                    name: editProductData.name,
                    tags: (v.tags || []).map((t) =>
                        typeof t === "string" ? { id: t, name: t } : { id: t.id, name: t.name }
                    ),
                    marketLinks: Array.isArray(v.marketLinks)
                        ? v.marketLinks
                        : v.marketLinks?.connect
                            ? v.marketLinks.connect.map(link => ({ id: link.id }))
                            : []
                };
            });

            setCurrentVariations(dbVariations.map(v => v.attributes));
            setVariationDetails(dbVariationDetails);
        } else {
            setCurrentVariations([]);
            setVariationDetails({});
        }
    }, [editProductData]);


    // ✅ Rebuild variations when modal opens in edit mode
    useEffect(() => {
        if (!modalOpen) return;

        if (editModalOpen && editProductData) {
            const preSelectedAttrs = {};
            const dbVariationDetails = {};

            editProductData.variations?.forEach((v) => {
                const attrs = parseAttributes(v.variationName);
                console.log("attrs", attrs)
                Object.entries(attrs).forEach(([key, val]) => {
                    if (!preSelectedAttrs[key]) preSelectedAttrs[key] = { values: [] };
                    if (!preSelectedAttrs[key].values.includes(val)) {
                        preSelectedAttrs[key].values.push(val);
                    }
                });

                const key = getVariationKey(attrs);
                console.log("keyeditMode", key)
                dbVariationDetails[key] = {
                    id: v.id,
                    short: v.short,
                    price: v.price,
                    stock: v.stock,
                    isDefault: v.isDefault,
                    sku: v.sku,
                    description: v.description,
                    images: v.image ? [v.image] : [],
                    name: editProductData.name,
                    tags: (v.tags || []).map((t) =>
                        typeof t === "string" ? { id: t, name: t } : { id: t.id, name: t.name }
                    ),
                    marketLinks: Array.isArray(v.marketLinks)
                        ? v.marketLinks
                        : v.marketLinks?.connect
                            ? v.marketLinks.connect.map(link => ({ id: link.id }))
                            : []
                };
            });

            setSelectedAttributes(preSelectedAttrs);

            const attrValues = Object.values(preSelectedAttrs)
                .filter((a) => a.values?.length)
                .map((a) => a.values);

            const attrNames = Object.keys(preSelectedAttrs);
            const cartesian = (arr) =>
                arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);
            const combinations = cartesian(attrValues);

            const variationsWithKeys = combinations.map((comb) => {
                const obj = comb.reduce((acc, val, idx) => {
                    acc[attrNames[idx]] = val;
                    return acc;
                }, {});
                return obj;
            });

            setCurrentVariations(variationsWithKeys);
            setVariationDetails(dbVariationDetails);

        } else {
            // New product
            setSelectedAttributes({});
            setCurrentVariations([]);
            setVariationDetails({});
        }
    }, [modalOpen, editModalOpen, editProductData]);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        return data.urls; // single URL or array of URLs
    };

    console.log("currentVariations:", currentVariations);
    console.log("variationDetails:", variationDetails);
    return (
        <>
            {loading && <Loader />}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full h-full  p-6 md:flex md:gap-6 animate-fade-in">
                    {/* Side Menu */}
                    <div className="md:w-1/4 mb-4 md:mb-0">
                        <h2 className="text-lg font-semibold mb-4">
                            Sections ({" "}
                            <span className="text-black font-bold text-lg">{currentData.name}</span>
                            {" "})
                        </h2>

                        <ul className="space-y-2">
                            {["product", "external Links", "attributes", "variations"].map((section) => (
                                <li
                                    key={section}
                                    onClick={() => setActiveSection(section)}
                                    className={`cursor-pointer px-4 py-2 rounded-lg transition ${activeSection === section
                                        ? "bg-black text-white"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Content */}
                    <div className="md:w-3/4">
                        {/* Close Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 font-bold text-xl cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Sections */}
                        {activeSection === "product" && (
                            <ProductForm
                                editModalOpen={editModalOpen}
                                newProduct={newProduct}
                                setNewProduct={setNewProduct}
                                editProductData={editProductData}
                                setEditProductData={setEditProductData}
                                productOffers={productOffers}
                                newImage={newImage}
                                setNewImage={setNewImage}
                                categories={categories}
                                subcategories={subcategories}
                            />
                        )}

                        {activeSection === "external Links" && (
                            <ExternalLinks
                                editModalOpen={editModalOpen}
                                newProduct={newProduct}
                                setNewProduct={setNewProduct}
                                editProductData={editProductData}
                                setEditProductData={setEditProductData}
                            />
                        )}


                        {activeSection === "attributes" && (
                            <AttributesSection
                                selectedAttributes={selectedAttributes}
                                setSelectedAttributes={setSelectedAttributes}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                expandedAttrs={expandedAttrs}
                                setExpandedAttrs={setExpandedAttrs}
                                filteredAttributes={attributes}
                                toggleAttributeValue={toggleAttributeValue}
                            />
                        )}

                        {activeSection === "variations" && (
                            <VariationsSection
                                currentVariations={currentVariations}
                                expandedVariations={expandedVariations}
                                toggleExpand={toggleExpand}
                                removeVariation={removeVariation}
                                variationDetails={variationDetails}
                                setVariationDetails={setVariationDetails}
                                handleVariationChange={handleVariationChange}
                                setCurrentVariations={setCurrentVariations}
                                productFields={[
                                    { key: "name", type: "text", placeholder: "Product Name" },
                                    { key: "short", type: "text", placeholder: "Short Description" },
                                    { key: "tags", type: "text", placeholder: "Tags" },
                                    { key: "price", type: "number", placeholder: "Price" },
                                    { key: "stock", type: "number", placeholder: "Stock" },
                                    { key: "sku", type: "text", placeholder: "Enter SKU Detail" },
                                    { key: "bulkPricing", type: "custom-bulk", placeholder: "Bulk Price" },
                                    { key: "images", type: "file", placeholder: "Product Image" },
                                    { key: "description", type: "textarea", placeholder: "Description" },
                                ]}
                                setCurrentData={setCurrentData}
                                currentData={currentData}
                                handleImageUpload={handleImageUpload}
                            />
                        )}



                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-black transition cursor-pointer"
                            >
                                {editModalOpen ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ProductModalWrapper;
