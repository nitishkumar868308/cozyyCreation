// "use client";
// import React, { useState, useEffect } from "react";
// import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
// import { Plus, Edit, Trash2, X, View, Copy } from "lucide-react";
// import {
//     fetchProducts,
//     createProduct,
//     deleteProduct,
//     updateProduct
// } from "@/app/redux/slices/products/productSlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
// import { useDispatch, useSelector } from "react-redux";
// import toast from 'react-hot-toast';
// import Image from "next/image";
// import {
//     fetchAttributes,
// } from "@/app/redux/slices/attribute/attributeSlice";
// import ProductModal from "@/components/ProductModal";
// import ConfirmModal from "@/components/ConfirmModal";
// import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
// import Loader from "@/components/Include/Loader";
// import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
// import MultiSelectDropdown from "@/components/Custom/MultiSelectDropdown";

// const productFields = [
//     { key: "name", type: "text", placeholder: "Product Name" },
//     { key: "short", type: "text", placeholder: "Short Description" },
//     { key: "description", type: "textarea", placeholder: "Description" },
//     { key: "price", type: "number", placeholder: "Price" },
//     { key: "stock", type: "number", placeholder: "Stock" },
//     { key: "otherCountriesPrice", type: "text", placeholder: "otherCountries Price" },
//     { key: "image", type: "file", placeholder: "Product Image" },
//     // { key: "offer", type: "text", placeholder: "offer" },
//     { key: "category", type: "select", placeholder: "Category" },
//     { key: "subcategory", type: "select", placeholder: "Subcategory" }
// ];

// const AddProducts = () => {
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [modalOpenProduct, setModalOpenProduct] = useState(false);
//     const { products } = useSelector((state) => state.products);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const [activeSection, setActiveSection] = useState("product");
//     const { categories } = useSelector((state) => state.category);
//     const [search, setSearch] = useState("");
//     const [modalOpen, setModalOpen] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [newProduct, setNewProduct] = useState({
//         name: "",
//         description: "",
//         short: "",
//         price: "",
//         stock: "",
//         image: null,
//         offer: null,
//         category: "",
//         subcategoryId: "",
//         otherCountriesPrice: null,
//         colors: [],
//         sizes: [],
//     });
//     const [editProductData, setEditProductData] = useState({});
//     const [deleteProductId, setDeleteProductId] = useState(null);
//     const [newImage, setNewImage] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedAttributes, setSelectedAttributes] = useState({});
//     const [expandedVariations, setExpandedVariations] = useState({});
//     const [variationDetails, setVariationDetails] = useState({});
//     const [currentVariations, setCurrentVariations] = useState([]);
//     const { attributes } = useSelector((state) => state.attributes);
//     const [expandedAttrs, setExpandedAttrs] = useState({});
//     const { offers } = useSelector((state) => state.offers);
//     const productOffers = offers.filter((offer) =>
//         Array.isArray(offer.type) && offer.type.includes("product")
//     );
//     console.log("productOffers", productOffers)

//     useEffect(() => {
//         dispatch(fetchAttributes())
//         dispatch(fetchProducts());
//         dispatch(fetchSubcategories());
//         dispatch(fetchCategories());
//         dispatch(fetchOffers());
//     }, [dispatch]);

//     const openModal = (product) => {
//         setSelectedProduct(product);
//         setModalOpenProduct(true);
//     };

//     const closeModal = () => {
//         setSelectedProduct(null);
//         setModalOpenProduct(false);
//     };

//     // useEffect(() => {
//     //     const attrValues = Object.values(selectedAttributes)
//     //         .filter(a => a.values?.length)
//     //         .map(a => a.values);

//     //     if (attrValues.length === 0) {
//     //         setCurrentVariations([]);
//     //         return;
//     //     }

//     //     // Cartesian product of all attribute values
//     //     const cartesian = (arr) =>
//     //         arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

//     //     const combinations = cartesian(attrValues);

//     //     // Join each combination to a string to use as key
//     //     const variationKeys = combinations.map(comb => comb.join(" / "));
//     //     setCurrentVariations(variationKeys);

//     // }, [selectedAttributes]);


//     useEffect(() => {
//         const attrValues = Object.values(selectedAttributes)
//             .filter(a => a.values?.length)
//             .map(a => a.values);

//         if (attrValues.length === 0) {
//             setCurrentVariations([]);
//             return;
//         }

//         // Cartesian product
//         const cartesian = (arr) =>
//             arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

//         const combinations = cartesian(attrValues);

//         const attrNames = Object.keys(selectedAttributes);

//         const newVariationDetails = {}; // temp object
//         const variationsWithKeys = combinations.map(comb => {
//             const variationObj = comb.reduce((acc, val, idx) => {
//                 acc[attrNames[idx]] = val;
//                 return acc;
//             }, {});

//             const variationKey = JSON.stringify(variationObj);

//             newVariationDetails[variationKey] = {
//                 ...(variationDetails[variationKey] || {}),
//                 price: variationDetails[variationKey]?.price || newProduct.price,
//                 stock: variationDetails[variationKey]?.stock || newProduct.stock,
//                 image: variationDetails[variationKey]?.image || newProduct.image?.[0] || null,
//                 name: variationDetails[variationKey]?.name || newProduct.name,
//                 description: variationDetails[variationKey]?.description || newProduct.description,
//                 otherCountriesPrice: variationDetails[variationKey]?.otherCountriesPrice || newProduct.otherCountriesPrice,
//                 sku: variationDetails[variationKey]?.sku || generateSKU(newProduct.name, Object.values(variationObj).filter(Boolean).join(" / ")),
//             };

//             return variationObj;
//         });

//         setVariationDetails(newVariationDetails); // single update
//         setCurrentVariations(variationsWithKeys);

//     }, [selectedAttributes]);




//     const handleVariationChange = (variationKey, key, value) => {
//         setVariationDetails(prev => ({
//             ...prev,
//             [variationKey]: {
//                 ...prev[variationKey],
//                 [key]: value,
//             },
//         }));
//     };

//     // const handleVariationImage = (variation, e) => {
//     //     const file = e.target.files[0];
//     //     if (!file) return;
//     //     const preview = URL.createObjectURL(file);
//     //     setVariationDetails(prev => ({
//     //         ...prev,
//     //         [variation]: {
//     //             ...prev[variation],
//     //             image: file,
//     //             preview,
//     //         },
//     //     }));
//     // };

//     const toggleExpand = (variation) => {
//         setExpandedVariations(prev => ({
//             ...prev,
//             [variation]: !prev[variation],
//         }));
//     };

//     const removeVariation = (variation) => {
//         setCurrentVariations(prev => prev.filter(v => v !== variation));
//         setVariationDetails(prev => {
//             const copy = { ...prev };
//             delete copy[variation];
//             return copy;
//         });
//     };

//     const mergeMissingVariations = (dbVariations) => {
//         setCurrentVariations(prev => {
//             const all = Array.from(new Set([...prev, ...dbVariations])); // merge & remove duplicates
//             return all;
//         });

//         setVariationDetails(prev => {
//             const newDetails = { ...prev };
//             dbVariations.forEach(v => {
//                 if (!newDetails[v]) newDetails[v] = {}; // create empty object for missing variations
//             });
//             return newDetails;
//         });
//     };

//     // ----------------- SEO Helpers -----------------
//     const generateSlug = (name) => {
//         return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
//     };

//     const generateMetaTitle = (name) => {
//         return `${name} | YourStore`;
//     };

//     const generateMetaDescription = (description) => {
//         if (description) return description.substring(0, 150);
//         return "Shop the best products online at YourStore.";
//     };
//     // -----------------------------------------------
//     const generateSKU = (productName, variation) => {
//         if (!productName || !variation) return null;
//         const variationName = typeof variation === "string"
//             ? variation
//             : Array.isArray(variation)
//                 ? variation.join("-")
//                 : Object.values(variation).join("-");

//         const cleanVariation = variationName
//             .trim()
//             .replace(/\s+/g, '-')
//             .replace(/\//g, '-')
//             .toUpperCase();

//         const productSlug = generateSlug(productName);
//         return `${productSlug}-${cleanVariation}`;
//     };
//     const variationsData = currentVariations.map(variationObj => {
//         const variationKey = JSON.stringify(variationObj); // stringify here too
//         const details = variationDetails[variationKey] || {};

//         return {
//             // variation_name: Object.values(variationObj)
//             //     .map(val => String(val).trim())
//             //     .filter(Boolean)
//             //     .join(" / "),
//             variation_name: Object.entries(variationObj)
//                 .map(([key, val]) => `${key}: ${String(val).trim()}`)
//                 .filter(Boolean)
//                 .join(" / "),
//             price: details.price ?? newProduct.price ?? null,
//             stock: details.stock ?? newProduct.stock ?? null,
//             image: details.image ?? null,
//             name: details.name ?? newProduct.name ?? null,
//             description: details.description ?? newProduct.description ?? null,
//             otherCountriesPrice: details.otherCountriesPrice ?? newProduct.otherCountriesPrice ?? null,
//             //sku: details.sku ?? generateSKU(newProduct.name, Object.values(variationObj).filter(Boolean).join(" / ")),
//             sku: details.sku ?? generateSKU(
//                 newProduct.name,
//                 Object.entries(variationObj)
//                     .map(([k, v]) => `${k}-${v}`)
//                     .join("-")
//             ),
//         };
//     });




//     // const variationsData = currentVariations.map(variation => {
//     //     const details = variationDetails[variation] || {};
//     //     return {
//     //         variation_name: variation,
//     //         price: details.price ?? newProduct.price ?? null,
//     //         stock: details.stock ?? newProduct.stock ?? null,
//     //         image: details.preview ?? null,
//     //         name: details.name ?? newProduct.name ?? null,
//     //         description: details.description ?? newProduct.description ?? null,
//     //         otherCountriesPrice: details.otherCountriesPrice ?? newProduct.otherCountriesPrice ?? null,
//     //         sku: generateSKU(newProduct.name, variation),
//     //     };
//     // });

//     const handleImageUpload = async (file) => {
//         if (!file) throw new Error('No file provided');

//         try {
//             const url = await uploadToCloudinary(file, 'products');
//             return url;
//         } catch (err) {
//             console.error('Upload failed:', err);
//             throw err;
//         }
//     };



//     const handleAddProduct = async () => {
//         console.log("offer:", newProduct.offer);

//         if (!newProduct.name.trim() || !newProduct.subcategoryId) {
//             return toast.error("Name and subcategory are required");
//         }
//         setLoading(true);
//         let imageUrls = [];
//         if (newImage) {
//             if (Array.isArray(newImage)) {
//                 imageUrls = await Promise.all(newImage.map((img) => handleImageUpload(img)));
//             } else {
//                 const url = await handleImageUpload(newImage);
//                 imageUrls = [url];
//             }
//         }

//         const productSKU = `${generateSlug(name)}-MAIN-${Date.now()}`;

//         const subcategoryId = parseInt(newProduct.subcategoryId);
//         if (!subcategoryId) return toast.error("Subcategory is required");

//         const categoryId = newProduct.category ? parseInt(newProduct.category) : null;

//         // Prepare product data including variations
//         const productData = {
//             name: newProduct.name.trim(),
//             //categoryId: newProduct.category,
//             //subcategoryId: parseInt(newProduct.subcategoryId),
//             //subcategory: { connect: { id: Number(newProduct.subcategoryId) } },
//             short: newProduct.short || null,
//             description: newProduct.description || null,
//             image: imageUrls,
//             active: newProduct.active ?? true,
//             slug: generateSlug(newProduct.name),
//             metaTitle: generateMetaTitle(newProduct.name),
//             metaDescription: generateMetaDescription(newProduct.description),
//             price: newProduct.price ?? null,
//             stock: newProduct.stock ?? null,
//             size: newProduct.sizes || [],
//             color: newProduct.colors || [],
//             sku: productSKU,
//             otherCountriesPrice: newProduct.otherCountriesPrice ?? null,
//             offers: newProduct.offer && newProduct.offer.length > 0
//                 ? {
//                     connect: newProduct.offer.map((id) => ({ id: parseInt(id) }))
//                 }
//                 : undefined,

//             primaryOffer: newProduct.offer && newProduct.offer.length > 0
//                 ? { connect: { id: parseInt(newProduct.offer[0]) } }
//                 : undefined,

//             category: categoryId ? { connect: { id: categoryId } } : undefined,
//             subcategory: { connect: { id: subcategoryId } },

//             variations: variationsData
//         };

//         dispatch(createProduct(productData))
//             .unwrap()
//             .then((res) => {
//                 toast.success("Product created successfully!");
//                 setSelectedProduct(res.data);
//                 setNewProduct({
//                     name: "",
//                     category: "",
//                     subcategoryId: "",
//                     short: "",
//                     description: "",
//                     price: "",
//                     stock: "",
//                     sizes: null,
//                     colors: null,
//                     active: true,
//                     image: null,
//                 });
//                 setSelectedAttributes({})
//                 setActiveSection("product")
//                 setCurrentVariations([]);
//                 setVariationDetails({});
//                 setNewImage(null);
//                 setModalOpen(false)
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 toast.error(err.message || "Failed to create product");
//             });
//     };

//     const handleEditProduct = async () => {
//         if (!editProductData.name.trim() || !editProductData.subcategoryId)
//             return toast.error("Name and subcategory are required");

//         let imageUrl = editProductData.image ?? null;
//         if (newImage) imageUrl = await handleImageUpload(newImage);

//         const productData = {
//             id: editProductData.id,
//             name: editProductData.name.trim(),
//             subcategoryId: parseInt(editProductData.subcategoryId),
//             description: editProductData.description,
//             image: imageUrl,
//             active: editProductData.active,
//             slug: generateSlug(editProductData.name),
//             metaTitle: generateMetaTitle(editProductData.name),
//             metaDescription: generateMetaDescription(editProductData.description),
//         };

//         try {
//             await dispatch(updateProduct(productData)).unwrap();
//             toast.success("Product updated successfully");
//             setEditModalOpen(false);
//             setEditProductData({});
//             setNewImage(null);
//         } catch (err) {
//             toast.error(err.message || "Failed to update product");
//         }
//     };

//     const handleDelete = async () => {
//         setLoading(true);
//         try {
//             await dispatch(deleteProduct(deleteProductId)).unwrap();
//             toast.success("Product deleted successfully");
//             setDeleteModalOpen(false);
//         } catch (err) {
//             toast.error(err.message || "Failed to delete product");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleActive = async (id, currentActive) => {
//         setLoading(true);
//         try {
//             await dispatch(updateProduct({ id, active: !currentActive })).unwrap();
//             toast.success("Product status updated");
//         } catch (err) {
//             toast.error(err.message || "Failed to update status");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filteredProducts = products.filter((p) =>
//         p.name.toLowerCase().includes(search.toLowerCase())
//     );
//     console.log("filteredProducts", filteredProducts)
//     // Decide whether modal is Add or Edit
//     const handleSave = () => {
//         if (editModalOpen) {
//             handleEditProduct();
//         } else {
//             handleAddProduct();
//         }
//     };

//     const filteredAttributes = attributes.filter(attr =>
//         attr.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const toggleAttributeValue = (attrName, value) => {
//         setSelectedAttributes((prev) => {
//             const prevValues = prev[attrName]?.values || [];
//             const newValues = prevValues.includes(value)
//                 ? prevValues.filter((v) => v !== value)
//                 : [...prevValues, value];

//             return {
//                 ...prev,
//                 [attrName]: {
//                     ...prev[attrName],
//                     values: newValues,
//                     searchTerm: prev[attrName]?.searchTerm || "",
//                 },
//             };
//         });
//     };

//     const handleDragEnd = (event) => {
//         const { active, over } = event;
//         if (active.id !== over.id) {
//             const oldIndex = products.findIndex(p => p.id === active.id);
//             const newIndex = products.findIndex(p => p.id === over.id);
//             const newProducts = [...products];
//             const [movedItem] = newProducts.splice(oldIndex, 1);
//             newProducts.splice(newIndex, 0, movedItem);
//             setProducts(newProducts);
//             console.log("New Order:", newProducts.map(p => p.name));
//         }
//     };

//     const copyModal = (id) => {
//         console.log("id", id)
//     }

//     useEffect(() => {
//         if (modalOpen) {
//             setNewProduct({
//                 name: "",
//                 category: "",
//                 subcategoryId: "",
//                 short: "",
//                 description: "",
//                 price: "",
//                 stock: "",
//                 sizes: null,
//                 colors: null,
//                 active: true,
//                 image: null,
//                 variations: []
//             });
//             setNewImage(null);
//         }
//     }, [modalOpen]);

//     // Edit button pe click
//     const handleEditClick = (product) => {
//         setEditModalOpen(true);
//         setModalOpen(true);

//         if (product.variations?.length > 0) {
//             const dbVariations = product.variations.map((v) => {
//                 return { variationName: v.variationName };
//             });

//             const dbVariationDetails = {};
//             product.variations.forEach((v) => {
//                 const key = JSON.stringify({ variationName: v.variationName });
//                 dbVariationDetails[key] = {
//                     price: v.price,
//                     stock: v.stock,
//                     sku: v.sku,
//                     description: v.description,
//                     image: v.image?.[0] || "",
//                 };
//             });

//             setCurrentVariations(dbVariations);
//             setVariationDetails(dbVariationDetails);
//         } else {
//             setCurrentVariations([]);
//             setVariationDetails({});
//         }

//         setEditProductData(product);
//     };




//     return (
//         <DefaultPageAdmin>
//             {loading && <Loader />}
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
//                 <h1 className="text-2xl font-bold text-gray-800">Products</h1>
//                 <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
//                     <input
//                         type="text"
//                         placeholder="Search products..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     />
//                     <button
//                         onClick={() => {
//                             setEditModalOpen(false);
//                             setNewProduct({});
//                             setModalOpen(true);
//                         }}
//                         className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
//                     >
//                         <Plus className="w-5 h-5" /> Add Product
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//                 <div className="min-w-full bg-white shadow-lg rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredProducts.map((p, idx) => (
//                                 <tr key={p.id} className="hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4">{idx + 1}</td>
//                                     <td className="px-6 py-4">{p.name}</td>
//                                     <td className="px-6 py-4">{categories.find(s => s.id === p.categoryId)?.name || "-"}</td>
//                                     <td className="px-6 py-4">{subcategories.find(s => s.id === p.subcategoryId)?.name || "-"}</td>
//                                     <td className="px-6 py-4">{p.price}</td>
//                                     <td className="px-6 py-4">{p.stock}</td>

//                                     <td className="px-6 py-4">
//                                         <label className="inline-flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={p.active}
//                                                 onChange={() => toggleActive(p.id, p.active)}
//                                                 className="sr-only"
//                                             />
//                                             <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${p.active ? "bg-green-500" : "bg-gray-300"}`}>
//                                                 <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${p.active ? "translate-x-6" : "translate-x-0"}`} />
//                                             </span>
//                                         </label>
//                                     </td>
//                                     <td className="px-6 py-4 flex gap-3">
//                                         <button
//                                             className="text-blue-500 hover:text-blue-700 cursor-pointer"
//                                             onClick={() => openModal(p)}
//                                         >
//                                             <View className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 setEditProductData({ ...p, variations: p.variations || [] });
//                                                 handleEditClick(p); // yaha CALL karna hai, reference mat chhodo
//                                             }}
//                                             className="text-blue-500 hover:text-blue-700 cursor-pointer"
//                                         >
//                                             <Edit className="w-5 h-5" />
//                                         </button>

//                                         <button
//                                             onClick={() => { setDeleteProductId(p.id); setDeleteModalOpen(true); }}
//                                             className="text-red-500 hover:text-red-700 cursor-pointer"
//                                         >
//                                             <Trash2 className="w-5 h-5" />
//                                         </button>
//                                         {/* <button
//                                             onClick={() => {
//                                                 setNewProduct({
//                                                     ...p,
//                                                     id: null, // important: naya product create ho, existing id na ho
//                                                     subcategoryId: p.subcategoryId || null,
//                                                     category: p.categoryId || null,
//                                                 });
//                                                 setNewImage(null); // reset image
//                                                 setModalOpen(true); // modal open
//                                                 setActiveSection("product"); // product section dikhe
//                                                 setEditModalOpen(false); // edit mode off
//                                             }}
//                                             className="text-green-500 hover:text-green-700 cursor-pointer"
//                                         >
//                                             <Copy className="w-5 h-5" />
//                                         </button> */}


//                                     </td>
//                                 </tr>
//                             ))}
//                             {filteredProducts.length === 0 && (
//                                 <tr>
//                                     <td colSpan={5} className="text-center py-6 text-gray-400 italic">
//                                         No products found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>


//             {modalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 md:flex md:gap-6 animate-fade-in">

//                         {/* Side Menu */}
//                         <div className="md:w-1/4 mb-4 md:mb-0">
//                             <h2 className="text-lg font-semibold mb-4">Sections</h2>
//                             <ul className="space-y-2">
//                                 {["product", "attributes", "variations"].map((section) => (
//                                     <li
//                                         key={section}
//                                         onClick={() => setActiveSection(section)}
//                                         className={`cursor-pointer px-4 py-2 rounded-lg transition ${activeSection === section
//                                             ? "bg-black text-white"
//                                             : "hover:bg-gray-100"
//                                             }`}
//                                     >
//                                         {section.charAt(0).toUpperCase() + section.slice(1)}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Form Content */}
//                         <div className="md:w-3/4">

//                             {/* Close Button */}
//                             <div className="flex justify-end mb-4">
//                                 <button
//                                     onClick={() => setModalOpen(false)}
//                                     className="text-gray-500 hover:text-gray-700 font-bold text-xl cursor-pointer"
//                                 >
//                                     &times;
//                                 </button>
//                             </div>

//                             {/* Decide which state to use */}
//                             {activeSection === "product" && (() => {
//                                 const isEdit = editModalOpen;
//                                 const currentData = isEdit ? editProductData : newProduct;
//                                 const setCurrentData = isEdit ? setEditProductData : setNewProduct;

//                                 return (
//                                     <div>
//                                         <h3 className="text-xl font-semibold mb-4">Product Details</h3>

//                                         <form className="grid grid-cols-2 gap-4">

//                                             {/* Product Name */}
//                                             <div>
//                                                 <label className="block mb-1 font-medium">Product Name</label>
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Product Name"
//                                                     value={currentData.name || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({ ...currentData, name: e.target.value })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 />
//                                             </div>


//                                             {/* Short Description */}
//                                             <div >
//                                                 <label className="block mb-1 font-medium">Short Description</label>
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Short Description"
//                                                     value={currentData.short || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({ ...currentData, short: e.target.value })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 />
//                                             </div>

//                                             {/* Category */}
//                                             <div>
//                                                 <label className="block mb-1 font-medium">Category</label>
//                                                 <select
//                                                     value={currentData.category || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({
//                                                             ...currentData,
//                                                             category: Number(e.target.value),
//                                                             subcategory: "" // reset subcategory
//                                                         })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 >
//                                                     <option value="">Select Category</option>
//                                                     {categories.map(cat => (
//                                                         <option key={cat.id} value={cat.id}>{cat.name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             {/* Subcategory */}
//                                             <div>
//                                                 <label className="block mb-1 font-medium">Subcategory</label>
//                                                 <select
//                                                     value={currentData.subcategoryId || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({
//                                                             ...currentData,
//                                                             subcategoryId: e.target.value ? Number(e.target.value) : "", // keep as string
//                                                         })
//                                                     }
//                                                     disabled={!currentData.category}
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 >
//                                                     <option value="">
//                                                         {currentData.category ? "Select Subcategory" : "Select Category first"}
//                                                     </option>
//                                                     {currentData.category &&
//                                                         subcategories
//                                                             .filter(sub => sub.categoryId.toString() === currentData.category.toString())
//                                                             .map(sub => (
//                                                                 <option key={sub.id} value={sub.id}>
//                                                                     {sub.name}
//                                                                 </option>
//                                                             ))}
//                                                 </select>
//                                             </div>


//                                             {/* Base Price (INR) */}
//                                             <div>
//                                                 <label className="block mb-1 font-medium">Price (INR) - India</label>
//                                                 <input
//                                                     type="number"
//                                                     placeholder="Price (INR) - India"
//                                                     value={currentData.price || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({ ...currentData, price: e.target.value })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 />
//                                             </div>

//                                             {/* Other Countries Price */}
//                                             <div>
//                                                 <label className="block mb-1 font-medium">Price for Other Countries</label>
//                                                 <input
//                                                     type="number"
//                                                     placeholder="Price in INR for other countries"
//                                                     value={currentData.otherCountriesPrice || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({ ...currentData, otherCountriesPrice: Number(e.target.value) })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 />
//                                             </div>

//                                             {/* Stock */}
//                                             <div>
//                                                 <label className="block mb-1 font-medium">Stock</label>
//                                                 <input
//                                                     type="number"
//                                                     placeholder="Stock"
//                                                     value={currentData.stock || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({ ...currentData, stock: e.target.value })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                                                 />
//                                             </div>

//                                             {/* Offer */}
//                                             <MultiSelectDropdown offers={productOffers} currentData={currentData} setCurrentData={setCurrentData} />


//                                             {/* Description */}
//                                             <div className="col-span-2">
//                                                 <label className="block mb-1 font-medium">Description</label>
//                                                 <textarea
//                                                     placeholder="Description"
//                                                     value={currentData.description || ""}
//                                                     onChange={(e) =>
//                                                         setCurrentData({ ...currentData, description: e.target.value })
//                                                     }
//                                                     className="w-full border border-gray-300 rounded-lg px-4 py-2"
//                                                 />
//                                             </div>

//                                             {/* Image Upload (full width) */}
//                                             <div className="col-span-2">
//                                                 <label className="block mb-1 font-medium">Product Images</label>
//                                                 <input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     multiple // ← allow multiple selection
//                                                     onChange={(e) => setNewImage(Array.from(e.target.files))}
//                                                 />

//                                                 <div className="flex gap-2 mt-2 flex-wrap">
//                                                     {newImage && newImage.length > 0
//                                                         ? newImage.map((img, idx) => (
//                                                             <img
//                                                                 key={idx}
//                                                                 src={URL.createObjectURL(img)}
//                                                                 alt={`Preview ${idx}`}
//                                                                 className="w-32 h-32 object-cover rounded-lg"
//                                                             />
//                                                         ))
//                                                         : currentData.images && currentData.images.length > 0
//                                                             ? currentData.images.map((img, idx) => (
//                                                                 <img
//                                                                     key={idx}
//                                                                     src={img}
//                                                                     alt={`Product ${idx}`}
//                                                                     className="w-32 h-32 object-cover rounded-lg"
//                                                                 />
//                                                             ))
//                                                             : null}
//                                                 </div>
//                                             </div>


//                                         </form>
//                                     </div>
//                                 );
//                             })()}

//                             {/* Attributes Section */}
//                             {activeSection === "attributes" && (
//                                 <div>
//                                     <h3 className="text-xl font-semibold mb-4">Attributes</h3>

//                                     {/* Search Attributes */}
//                                     <input
//                                         type="text"
//                                         placeholder="Search attributes..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     />

//                                     <div className="space-y-2 max-h-[500px] overflow-auto">
//                                         {filteredAttributes.length === 0 && (
//                                             <div className="text-gray-500 text-center py-4">No attributes found</div>
//                                         )}
//                                         {filteredAttributes.map((attr) => (
//                                             <div key={attr.id} className="border rounded-lg shadow-sm">

//                                                 {/* Attribute Header */}
//                                                 <button
//                                                     className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-t-lg cursor-pointer"
//                                                     onClick={() =>
//                                                         setExpandedAttrs((prev) => ({
//                                                             ...prev,
//                                                             [attr.name]: !prev[attr.name],
//                                                         }))
//                                                     }
//                                                 >
//                                                     <span className="font-medium">{attr.name}</span>
//                                                     <span>{expandedAttrs[attr.name] ? "-" : "+"}</span>
//                                                 </button>

//                                                 {/* Values List (Accordion content) */}
//                                                 {expandedAttrs[attr.name] && (
//                                                     <div className="p-2 space-y-2">
//                                                         {/* Search values inside attribute */}
//                                                         <input
//                                                             type="text"
//                                                             placeholder={`Search ${attr.name} values`}
//                                                             value={selectedAttributes[attr.name]?.searchTerm || ""}
//                                                             onChange={(e) =>
//                                                                 setSelectedAttributes((prev) => ({
//                                                                     ...prev,
//                                                                     [attr.name]: {
//                                                                         ...prev[attr.name],
//                                                                         searchTerm: e.target.value,
//                                                                     },
//                                                                 }))
//                                                             }
//                                                             className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                                         />

//                                                         {/* ✅ Select All / Deselect All option */}
//                                                         <div className="flex items-center gap-2 mb-2">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={
//                                                                     selectedAttributes[attr.name]?.values?.length === attr.values.length
//                                                                 }
//                                                                 onChange={(e) => {
//                                                                     setSelectedAttributes((prev) => ({
//                                                                         ...prev,
//                                                                         [attr.name]: {
//                                                                             ...prev[attr.name],
//                                                                             values: e.target.checked ? [...attr.values] : [],
//                                                                             searchTerm: prev[attr.name]?.searchTerm || "",
//                                                                         },
//                                                                     }));
//                                                                 }}
//                                                                 className="accent-gray-600"
//                                                             />
//                                                             <span className="text-sm font-medium">
//                                                                 {selectedAttributes[attr.name]?.values?.length === attr.values.length
//                                                                     ? "Deselect All"
//                                                                     : "Select All"}
//                                                             </span>
//                                                         </div>


//                                                         {/* Scrollable values */}
//                                                         <div className="max-h-32 overflow-auto grid grid-cols-2 gap-2">
//                                                             {attr.values.filter((val) =>
//                                                                 val
//                                                                     .toLowerCase()
//                                                                     .includes(
//                                                                         selectedAttributes[attr.name]?.searchTerm?.toLowerCase() || ""
//                                                                     )
//                                                             ).length === 0 ? (
//                                                                 <div className="col-span-2 text-gray-500 text-center py-2">
//                                                                     No values found
//                                                                 </div>
//                                                             ) : (
//                                                                 attr.values
//                                                                     .filter((val) =>
//                                                                         val
//                                                                             .toLowerCase()
//                                                                             .includes(
//                                                                                 selectedAttributes[attr.name]?.searchTerm?.toLowerCase() || ""
//                                                                             )
//                                                                     )
//                                                                     .map((val, idx) => (
//                                                                         <label
//                                                                             key={`${val}-${idx}`}
//                                                                             className={`flex items-center gap-2 px-2 py-1 border rounded-lg cursor-pointer transition ${selectedAttributes[attr.name]?.values?.includes(val)
//                                                                                 ? "bg-black text-white border-blue-600"
//                                                                                 : "bg-white text-gray-700 border-gray-300"
//                                                                                 }`}
//                                                                         >
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={
//                                                                                     Array.isArray(selectedAttributes[attr.name]?.values) &&
//                                                                                     selectedAttributes[attr.name].values.includes(val)
//                                                                                 }
//                                                                                 onChange={() => toggleAttributeValue(attr.name, val)}
//                                                                                 className="accent-gray-600"
//                                                                             />
//                                                                             <span>{val}</span>
//                                                                         </label>
//                                                                     ))
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Selected Attributes */}
//                                     <div className="mt-4">
//                                         <h4 className="font-semibold mb-2">Selected Attributes:</h4>
//                                         {Object.entries(selectedAttributes).filter(([_, v]) => v.values?.length).length === 0 ? (
//                                             <div className="text-gray-500">No attributes selected</div>
//                                         ) : (
//                                             <div className="flex flex-wrap gap-2">
//                                                 {Object.entries(selectedAttributes)
//                                                     .filter(([_, v]) => v.values?.length)
//                                                     .flatMap(([attrName, v]) =>
//                                                         v.values.map((val, idx) => (
//                                                             <span
//                                                                 key={`${attrName}-${val}-${idx}`}
//                                                                 className="bg-black text-white px-2 py-1 rounded-full text-sm"
//                                                             >
//                                                                 {attrName}: {val}
//                                                             </span>
//                                                         ))
//                                                     )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Variations Section */}
//                             {activeSection === "variations" && (
//                                 <div className="max-h-[400px] overflow-auto space-y-2">
//                                     {currentVariations.map((variation, idx) => {
//                                         const variationKey = JSON.stringify(variation);

//                                         return (
//                                             <div key={variationKey} className="border rounded-lg mb-2">

//                                                 {/* Variation Header */}
//                                                 <div
//                                                     className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
//                                                     onClick={() => toggleExpand(variationKey)}
//                                                 >
//                                                     <span>{Object.values(variation).join(" / ")}</span>

//                                                     <div className="flex gap-2">
//                                                         <span>{expandedVariations[variationKey] ? "-" : "+"}</span>
//                                                         <button
//                                                             onClick={(e) => { e.stopPropagation(); removeVariation(variationKey); }}
//                                                             className="text-red-500 hover:text-red-700"
//                                                         >
//                                                             Remove
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                                 {/* Show product fields inside variation */}
//                                                 {expandedVariations[variationKey] && (
//                                                     <div className="p-2 space-y-2 bg-gray-50">
//                                                         {productFields.map((field) => {
//                                                             if (field.key === "category" || field.key === "subcategory") return null;

//                                                             const value = field.type === "file"
//                                                                 ? variationDetails[variationKey]?.[field.key]
//                                                                 : variationDetails[variationKey]?.[field.key] ?? newProduct[field.key];

//                                                             if (field.type === "textarea") {
//                                                                 return (
//                                                                     <textarea
//                                                                         key={field.key}
//                                                                         placeholder={field.placeholder}
//                                                                         value={value || ""}
//                                                                         onChange={(e) => handleVariationChange(variationKey, field.key, e.target.value)}
//                                                                         className="w-full border border-gray-300 rounded-lg px-3 py-1"
//                                                                     />
//                                                                 );
//                                                             } else if (field.type === "file") {
//                                                                 return (
//                                                                     <div key={field.key}>
//                                                                         <label className="block mb-1 font-medium">{field.placeholder}</label>
//                                                                         <input
//                                                                             type="file"
//                                                                             accept="image/*"
//                                                                             onChange={async (e) => {
//                                                                                 const file = e.target.files?.[0];
//                                                                                 if (!file) return;

//                                                                                 const uploadedUrl = await handleImageUpload(file);

//                                                                                 setVariationDetails(prev => ({
//                                                                                     ...prev,
//                                                                                     [variationKey]: {
//                                                                                         ...prev[variationKey],
//                                                                                         preview: URL.createObjectURL(file),
//                                                                                         image: uploadedUrl
//                                                                                     }
//                                                                                 }));
//                                                                             }}
//                                                                         />

//                                                                         {variationDetails[variationKey]?.preview && (
//                                                                             <img
//                                                                                 src={variationDetails[variationKey].preview}
//                                                                                 alt={variationKey}
//                                                                                 className="w-32 h-32 object-cover mt-1 rounded-lg"
//                                                                             />
//                                                                         )}
//                                                                     </div>
//                                                                 );
//                                                             } else {
//                                                                 return (
//                                                                     <input
//                                                                         key={field.key}
//                                                                         type={field.type}
//                                                                         placeholder={field.placeholder}
//                                                                         value={value || ""}
//                                                                         onChange={(e) => handleVariationChange(variationKey, field.key, e.target.value)}
//                                                                         className="w-full border border-gray-300 rounded-lg px-3 py-1"
//                                                                     />
//                                                                 );
//                                                             }
//                                                         })}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )
//                                     })}
//                                 </div>
//                             )}


//                             {/* Buttons */}
//                             <div className="mt-6 flex justify-end gap-4">
//                                 <button
//                                     type="button"
//                                     onClick={() => setModalOpen(false)}
//                                     className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     type="button"
//                                     onClick={handleSave}
//                                     className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-black transition cursor-pointer"
//                                 >
//                                     {editModalOpen ? "Update" : "Save"}
//                                 </button>

//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             )}

//             <ProductModal isOpen={modalOpenProduct} closeModal={closeModal} product={selectedProduct} />

//             <ConfirmModal
//                 isOpen={deleteModalOpen}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={handleDelete}
//                 title="Delete Product"
//                 message="Are you sure you want to delete this product? This action cannot be undone."
//             />


//         </DefaultPageAdmin >
//     );
// };

// export default AddProducts;

import React from 'react'
import Test from '@/app/test/page'

const page = () => {
  return (
    <>
    <Test />
    </>
  )
}

export default page
