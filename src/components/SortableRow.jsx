"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { View, Edit, Trash2 } from "lucide-react";

export default function SortableRow({ product, index, categories, subcategories, toggleActive, openModal, setEditProductData, setNewImage, setEditModalOpen, setDeleteProductId, setDeleteModalOpen }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="hover:bg-gray-50 transition-colors">
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>{categories.find(s => s.id === product.categoryId)?.name || "-"}</td>
            <td>{subcategories.find(s => s.id === product.subcategoryId)?.name || "-"}</td>
            <td>{product.price}</td>
            <td>{product.stock}</td>
            <td>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={product.active}
                        onChange={() => toggleActive(product.id, product.active)}
                        className="sr-only"
                    />
                    <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${product.active ? "bg-green-500" : "bg-gray-300"}`}>
                        <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${product.active ? "translate-x-6" : "translate-x-0"}`} />
                    </span>
                </label>
            </td>
            <td className="flex gap-3">
                <button onClick={() => openModal(product)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                    <View className="w-5 h-5" />
                </button>
                <button
                    onClick={() => {
                        setEditProductData({ ...product });
                        setNewImage(null);
                        setEditModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => { setDeleteProductId(product.id); setDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
}
