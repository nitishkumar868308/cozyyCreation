"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
} from "@/app/redux/slices/tag/tagSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Image from "next/image";

const AddTag = () => {
    const dispatch = useDispatch();
    const { tags, loading } = useSelector((state) => state.tags);

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newTag, setNewTag] = useState({ name: "" });
    const [editTag, setEditTag] = useState({});
    const [deleteTagId, setDeleteTagId] = useState(null);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setNewImage(file);
    };

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

    const handleAddTag = async () => {
        if (!newTag.name.trim()) return toast.error("Tag name is required");

        let imageUrl = null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        try {
            await dispatch(
                createTag({
                    name: newTag.name.trim(),
                    image: imageUrl,
                    active: true,
                })
            ).unwrap();
            toast.success("Tag added successfully");
            setNewTag({ name: "" });
            setNewImage(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add tag");
        }
    };

    const handleEditTagFunc = async () => {
        if (!editTag.name.trim()) return toast.error("Tag name is required");

        let imageUrl = editTag.image ?? null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        try {
            await dispatch(
                updateTag({
                    id: editTag.id,
                    name: editTag.name.trim(),
                    image: imageUrl,
                    active: editTag.active,
                })
            ).unwrap();
            toast.success("Tag updated successfully");
            setEditModalOpen(false);
            setEditTag({});
            setNewImage(null);
        } catch (err) {
            toast.error(err.message || "Failed to update tag");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteTag(deleteTagId)).unwrap();
            toast.success("Tag deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete tag");
        }
    };

    const toggleActive = async (id, currentActive) => {
        try {
            await dispatch(updateTag({ id, active: !currentActive })).unwrap();
            toast.success("Tag status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const filteredTags = tags.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DefaultPageAdmin>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Tags</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Tag
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTags.map((t, idx) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4">{t.name}</td>
                                    <td className="px-6 py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={t.active}
                                                onChange={() => toggleActive(t.id, t.active)}
                                                className="sr-only"
                                            />
                                            <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${t.active ? "bg-green-500" : "bg-gray-300"}`}>
                                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${t.active ? "translate-x-6" : "translate-x-0"}`} />
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditTag({ ...t });
                                                    setNewImage(null);
                                                    setEditModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteTagId(t.id); setDeleteModalOpen(true); }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTags.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                                        No tags found
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
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Tag</h2>

                        <input
                            type="text"
                            placeholder="Tag Name"
                            value={newTag.name}
                            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

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
                                onClick={handleAddTag}
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
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Tag</h2>

                        <input
                            type="text"
                            placeholder="Tag Name"
                            value={editTag.name || ""}
                            onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        />

                        {(editTag.image || newImage) && (
                            <div className="mb-4">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={
                                            newImage
                                                ? URL.createObjectURL(newImage)
                                                : editTag.image?.startsWith("http")
                                                    ? editTag.image
                                                    : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${editTag.image}`
                                        }
                                        alt={editTag.name || "Tag"}
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
                                onClick={handleEditTagFunc}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
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
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this tag?</p>
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

export default AddTag;
