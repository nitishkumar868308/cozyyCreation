"use client"
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import Loader from "../Loader";
import ProductTable from "./ProductTable";
import ProductModalWrapper from "./ProductModalWrapper";
import ConfirmModal from "@/components/ConfirmModal";
import { Plus } from "lucide-react";
import ProductModal from "@/components/ProductModal";

const ProductsPage = ({
    attributes,
    products,
    categories,
    subcategories,
    productOffers,
    toggleActive,
    handleDelete,
}) => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({});
    const [editProductData, setEditProductData] = useState({});
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpenProduct, setModalOpenProduct] = useState(false);
    const [newImage, setNewImage] = useState([]);

    // const filteredProducts = (products ?? []).filter(p =>
    //     p.name.toLowerCase().includes(search.toLowerCase())
    // );
    const filteredProducts = (products ?? []).filter(p =>
    (p.name ?? "").toLowerCase().includes((search ?? "").toLowerCase())
);


    console.log("categoriesProductPage", categories)
    const openModal = (product) => {
        setSelectedProduct(product);
        setModalOpenProduct(true);
    };

    const closeModal = () => setModalOpenProduct(false);
    const handleEditClick = (products) => {
        console.log("products", products)
        setEditModalOpen(true);
        setModalOpen(true);
        setEditProductData(products);
    };



    return (
        <DefaultPageAdmin>
            {loading && <Loader />}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => {
                            setEditModalOpen(false);
                            setNewProduct({});
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Product
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <ProductTable
                products={filteredProducts}
                categories={categories}
                subcategories={subcategories}
                toggleActive={toggleActive}
                openModal={openModal}
                setEditProductData={setEditProductData}
                handleEditClick={handleEditClick}
                setDeleteProductId={setDeleteProductId}
                setDeleteModalOpen={setDeleteModalOpen}
            />

            {/* Product Add/Edit Modal */}
            {modalOpen && (
                <ProductModalWrapper
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    editModalOpen={editModalOpen}
                    setEditModalOpen={setEditModalOpen}
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    editProductData={editProductData}
                    setEditProductData={setEditProductData}
                    productOffers={productOffers}
                    attributes={attributes}
                    categories={categories}
                    subcategories={subcategories}
                    newImage={newImage}
                    setNewImage={setNewImage}
                />
            )}

            {/* Single Product Modal */}
            <ProductModal
                isOpen={modalOpenProduct}
                closeModal={closeModal}
                product={selectedProduct || editProductData}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    handleDelete(deleteProductId);
                    setDeleteModalOpen(false);
                }}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
            />
        </DefaultPageAdmin>
    );
};

export default ProductsPage;
