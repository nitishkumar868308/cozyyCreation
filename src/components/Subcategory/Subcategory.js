"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
} from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Image from "next/image";

const AddSubcategory = () => {
    const dispatch = useDispatch();
    const { subcategories, loading } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newSubcategory, setNewSubcategory] = useState({ name: "", categoryId: "" });
    const [editSubcategory, setEditSubcategory] = useState({});
    const [deleteSubcategoryId, setDeleteSubcategoryId] = useState(null);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setNewImage(file);
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategory.name.trim() || !newSubcategory.categoryId)
            return toast.error("Name and category are required");

        let imageUrl = null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        try {
            await dispatch(
                createSubcategory({
                    name: newSubcategory.name.trim(),
                    categoryId: parseInt(newSubcategory.categoryId),
                    image: imageUrl,
                    active: true,
                })
            ).unwrap();
            toast.success("Subcategory added successfully");
            setNewSubcategory({ name: "", categoryId: "" });
            setNewImage(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add subcategory");
        }
    };

    const handleEditSubcategoryFunc = async () => {
        if (!editSubcategory.name.trim() || !editSubcategory.categoryId)
            return toast.error("Name and category are required");

        let imageUrl = editSubcategory.image ?? null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        try {
            await dispatch(
                updateSubcategory({
                    id: editSubcategory.id,
                    name: editSubcategory.name.trim(),
                    categoryId: parseInt(editSubcategory.categoryId),
                    image: imageUrl,
                    active: editSubcategory.active,
                })
            ).unwrap();
            toast.success("Subcategory updated successfully");
            setEditModalOpen(false);
            setEditSubcategory({});
            setNewImage(null);
        } catch (err) {
            toast.error(err.message || "Failed to update subcategory");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteSubcategory(deleteSubcategoryId)).unwrap();
            toast.success("Subcategory deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete subcategory");
        }
    };

    const toggleActive = async (id, currentActive) => {
        try {
            await dispatch(updateSubcategory({ id, active: !currentActive })).unwrap();
            toast.success("Subcategory status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const filteredSubcategories = subcategories.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DefaultPageAdmin>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search subcategories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Subcategory
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubcategories.map((s, idx) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4">{s.name}</td>
                                    <td className="px-6 py-4">{categories.find(c => c.id === s.categoryId)?.name || "-"}</td>
                                    <td className="px-6 py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={s.active}
                                                onChange={() => toggleActive(s.id, s.active)}
                                                className="sr-only"
                                            />
                                            <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${s.active ? "bg-green-500" : "bg-gray-300"}`}>
                                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${s.active ? "translate-x-6" : "translate-x-0"}`} />
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setEditSubcategory({
                                                    ...s
                                                });
                                                setNewImage(null);
                                                setEditModalOpen(true);
                                            }}
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => { setDeleteSubcategoryId(s.id); setDeleteModalOpen(true); }}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSubcategories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                                        No subcategories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Subcategory</h2>

                        <input
                            type="text"
                            placeholder="Subcategory Name"
                            value={newSubcategory.name}
                            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <select
                            value={newSubcategory.categoryId}
                            onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSubcategory}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Subcategory</h2>

                        <input
                            type="text"
                            placeholder="Subcategory Name"
                            value={editSubcategory.name || ""}
                            onChange={(e) =>
                                setEditSubcategory({ ...editSubcategory, name: e.target.value })
                            }
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <select
                            value={editSubcategory.categoryId || ""}
                            onChange={(e) =>
                                setEditSubcategory({ ...editSubcategory, categoryId: e.target.value })
                            }
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        />

                        {/* Image Preview */}
                        {(editSubcategory.image || newImage) && (
                            <div className="mb-4">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={
                                            newImage
                                                ? URL.createObjectURL(newImage)
                                                : editSubcategory.image?.startsWith("http")
                                                    ? editSubcategory.image
                                                    : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${editSubcategory.image}`
                                        }
                                        alt={editSubcategory.name || "Subcategory"}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubcategoryFunc}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this subcategory?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DefaultPageAdmin>
    );
};

export default AddSubcategory;
