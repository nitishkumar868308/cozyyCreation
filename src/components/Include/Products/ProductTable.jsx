"use client"
import React from "react";
import { View, Edit, Trash2 } from "lucide-react";

const ProductTable = ({
    products,
    categories,
    subcategories,
    toggleActive,
    openModal,
    setEditProductData,
    handleEditClick,
    setDeleteProductId,
    setDeleteModalOpen,
}) => {
    console.log("products", products)
    return (
        <div className="overflow-x-auto">
            <div className="min-w-full bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((p, idx) => (
                            <tr key={`${p.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">{idx + 1}</td>
                                 <td className="px-6 py-4">
                                    {p.image && p.image.length > 0 ? (
                                        <img src={p.image[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <span className="text-red-500 italic">Image missing</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">{p.name}</td>
                                <td className="px-6 py-4">{categories.find(s => s.id === p.categoryId)?.name || "-"}</td>
                                <td className="px-6 py-4">{subcategories.find(s => s.id === p.subcategoryId)?.name || "-"}</td>
                                <td className="px-6 py-4">{p.price}</td>
                                <td className="px-6 py-4">{p.stock}</td>                             

                                <td className="px-6 py-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={p.active}
                                            onChange={() => toggleActive(p.id, p.active)}
                                            className="sr-only"
                                        />
                                        <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${p.active ? "bg-green-500" : "bg-gray-300"}`}>
                                            <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${p.active ? "translate-x-6" : "translate-x-0"}`} />
                                        </span>
                                    </label>
                                </td>

                                <td className="px-6 py-4 flex gap-3">
                                    <button className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => openModal(p)}>
                                        <View className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log("p", p)
                                            setEditProductData({ ...p, variations: p.variations || [] });
                                            handleEditClick(p);
                                        }}
                                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => { setDeleteProductId(p.id); setDeleteModalOpen(true); }}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>


                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-400 italic">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
