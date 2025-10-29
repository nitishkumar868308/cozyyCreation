"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Image from "next/image";
import Loader from "@/components/Include/Loader";

const AddCategory = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [editCategory, setEditCategory] = useState({ id: null, name: "", image: null, });
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [newCategoryImage, setNewCategoryImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    //console.log("categories", categories)
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCategoryImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCategoryImage(file);
            setEditCategory({
                ...editCategory,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };



    // const handleAddCategory = async () => {
    //     if (!newCategory.trim()) {
    //         toast.error("Category name cannot be empty");
    //         return;
    //     }
    //     try {
    //         await dispatch(createCategory({ name: newCategory.trim(), active: true })).unwrap();
    //         toast.success("Category added successfully");
    //         setNewCategory("");
    //         setModalOpen(false);
    //     } catch (err) {
    //         toast.error(err.message || "Failed to add category");
    //     }
    // };

    // const handleImageUpload = async (file) => {
    //     if (!file) throw new Error('No file provided');

    //     try {
    //         const url = await uploadToCloudinary(file, 'products');
    //         return url;
    //     } catch (err) {
    //         console.error('Upload failed:', err);
    //         throw err;
    //     }
    // };
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


    const handleAddCategory = async () => {
        if (!newCategory.trim()) return toast.error("Category name cannot be empty");
        setLoading(true);
        let imageUrl = null;
        if (newCategoryImage) {
            imageUrl = await handleImageUpload(newCategoryImage);
        }

        try {
            await dispatch(createCategory({ name: newCategory.trim(), active: true, image: imageUrl })).unwrap();
            toast.success("Category added successfully");
            await fetchCategories();
            setNewCategory("");
            setNewCategoryImage(null);
            setImagePreview(null);
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };


    const handleEditCategory = async () => {
        if (!editCategory.name.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }
        setLoading(true);
        let imageUrl = editCategory.image ?? null;

        if (newCategoryImage) {
            imageUrl = await handleImageUpload(newCategoryImage);
        }

        try {
            await dispatch(
                updateCategory({
                    id: editCategory.id,
                    name: editCategory.name,
                    image: imageUrl,
                })
            ).unwrap();

            toast.success("Category updated successfully");
            setEditModalOpen(false);
            setEditCategory({});
        } catch (err) {
            toast.error(err.message || "Failed to update category");
        } finally {
            setLoading(false);
        }
    };


    const toggleActive = async (id, currentActive) => {
        setLoading(true);
        try {
            await dispatch(updateCategory({ id, active: !currentActive })).unwrap();
            toast.success("Category status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await dispatch(deleteCategory(deleteCategoryId)).unwrap();
            toast.success("Category deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete category");
        }
        finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
   // console.log("filteredCategories", filteredCategories)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
   // console.log("baseUrl" , baseUrl)

    // console.log("Image Preview URL =>", newCategoryImage
    //     ? URL.createObjectURL(newCategoryImage)
    //     : editCategory.image?.startsWith("http")
    //         ? editCategory.image
    //         : `${baseUrl}/uploads/${editCategory.image}`);
    const imageSrc = newCategoryImage
        ? URL.createObjectURL(newCategoryImage) // preview before upload
        : editCategory.image;                    // already like /uploads/filename.jpg

    console.log("Image URL =>", imageSrc);

    return (
        <DefaultPageAdmin>
            {loading && <Loader />}
            {/* Header + Search + Add Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Category
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCategories.map((c, idx) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                                        {idx + 1}.
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {c.image ? (
                                            <div className="relative w-16 h-16">
                                                <Image
                                                    src={encodeURI(c.image.startsWith("http") ? c.image : `${baseUrl}${c.image}`)}
                                                    alt={c.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}
                                    </td>


                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={c.active}
                                                onChange={() => toggleActive(c.id, c.active)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${c.active ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <span
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${c.active ? "translate-x-6" : "translate-x-0"
                                                        }`}
                                                />
                                            </span>
                                            <span
                                                className={`ml-3 text-sm font-medium ${c.active ? "text-green-600" : "text-gray-500"
                                                    }`}
                                            >
                                                {c.active ? "Active" : "Inactive"}
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditCategory({
                                                        id: c.id,
                                                        name: c.name,
                                                        image: c.image || null,
                                                    });
                                                    setNewCategoryImage(null);
                                                    setEditModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteCategoryId(c.id); setDeleteModalOpen(true); }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                                        No categories found
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
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Category</h2>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mb-4 w-32 h-32 object-cover rounded-lg" />
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
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

                        <h2 className="text-xl font-bold mb-4 text-center">Edit Category</h2>

                        {/* Name Input */}
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={editCategory.name}
                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* Image Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        />

                        {/* {newCategoryImage ? (
                            <div className="text-sm text-gray-700 mb-2">{newCategoryImage.name}</div>
                        ) : editCategory.image ? (
                            <div className="text-sm text-gray-700 mb-2">
                                {editCategory.image.split('/').pop()}
                            </div>
                        ) : null} */}

                        {/* Image Preview */}
                        {editCategory.image || newCategoryImage ? (
                            <div className="mb-4">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={
                                            newCategoryImage
                                                ? URL.createObjectURL(newCategoryImage)
                                                : editCategory.image?.startsWith("http")
                                                    ? editCategory.image
                                                    : `${baseUrl}${editCategory.image}`
                                        }
                                        alt={editCategory.name || "Category"}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </div>
                        ) : (
                            <span className="text-gray-400 italic mb-4 block">No Image</span>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditCategory}
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
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this category?</p>
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

export default AddCategory;
