"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
    fetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
} from "@/app/redux/slices/attribute/attributeSlice";

const AttributePage = () => {
    const dispatch = useDispatch();
    const { attributes, loading } = useSelector((state) => state.attributes);

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentAttribute, setCurrentAttribute] = useState({ id: null, name: "", values: [], active: true });
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    // Filtered attributes based on search
    const filteredAttributes = attributes.filter(
        (attr) =>
            attr.name.toLowerCase().includes(search.toLowerCase()) ||
            attr.values.join(", ").toLowerCase().includes(search.toLowerCase())
    );

    // Modal handlers
    const openAddModal = () => {
        setModalType("add");
        setCurrentAttribute({ id: null, name: "", values: [], active: true });
        setIsModalOpen(true);
    };
    const openEditModal = (attr) => {
        setModalType("edit");
        setCurrentAttribute(attr);
        setIsModalOpen(true);
    };
    const openDeleteModal = (id) => {
        setDeleteId(id);
        setModalType("delete");
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!currentAttribute.name.trim() || currentAttribute.values.length === 0) {
            toast.error("Name and values cannot be empty!");
            return;
        }

        if (modalType === "add") {
            await dispatch(createAttribute(currentAttribute));
            toast.success("Attribute added successfully!");
        } else if (modalType === "edit") {
            await dispatch(updateAttribute(currentAttribute));
            toast.success("Attribute updated successfully!");
        }
        setIsModalOpen(false);
    };

    const handleDelete = async () => {
        await dispatch(deleteAttribute(deleteId));
        toast.success("Attribute deleted successfully!");
        setIsModalOpen(false);
    };

    return (
        <DefaultPageAdmin>
            {/* Header + Search + Add Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Product Attributes</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search Attributes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Attribute
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
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Values
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
                            {filteredAttributes.map((attr, idx) => (
                                <tr key={attr.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">{idx + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{attr.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{attr.values.join(", ")}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${attr.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                            {attr.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button onClick={() => openEditModal(attr)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => openDeleteModal(attr.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAttributes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                                        No attributes found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded max-w-md w-full p-6">
                        {modalType === "delete" ? (
                            <>
                                <Dialog.Title className="text-lg font-bold text-red-600">Delete Attribute</Dialog.Title>
                                <p className="my-4">Are you sure you want to delete this attribute?</p>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">Delete</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Dialog.Title className="text-lg font-bold mb-4">{modalType === "add" ? "Add Attribute" : "Edit Attribute"}</Dialog.Title>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="Attribute Name"
                                        className="border rounded px-3 py-2 w-full"
                                        value={currentAttribute.name}
                                        onChange={(e) => setCurrentAttribute({ ...currentAttribute, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Values (comma separated)"
                                        className="border rounded px-3 py-2 w-full"
                                        value={currentAttribute.values.join(", ")}
                                        onChange={(e) =>
                                            setCurrentAttribute({ ...currentAttribute, values: e.target.value.split(",").map(v => v.trim()) })
                                        }
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                            {modalType === "add" ? "Add" : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </DefaultPageAdmin>
    );
};

export default AttributePage;
