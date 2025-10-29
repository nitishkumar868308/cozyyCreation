"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "../../Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchHeaders,
    createHeader,
    updateHeader,
    deleteHeader,
} from "@/app/redux/slices/addHeader/addHeaderSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';

const AddHeader = () => {
    const dispatch = useDispatch();
    const { headers, loading, error } = useSelector((state) => state.headers);

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newHeader, setNewHeader] = useState("");
    const [editHeader, setEditHeader] = useState({ id: null, name: "" });
    const [deleteHeaderId, setDeleteHeaderId] = useState(null);

    useEffect(() => {
        dispatch(fetchHeaders());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleAddHeader = async () => {
        if (!newHeader.trim()) {
            toast.error("Header name cannot be empty");
            return;
        }
        try {
            await dispatch(createHeader({ name: newHeader.trim(), active: true })).unwrap();
            toast.success("Header added successfully");
            setNewHeader("");
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add header");
        }
    };

    const handleEditHeader = async () => {
        if (!editHeader.name.trim()) {
            toast.error("Header name cannot be empty");
            return;
        }
        try {
            await dispatch(updateHeader({ id: editHeader.id, name: editHeader.name })).unwrap();
            toast.success("Header updated successfully");
            setEditModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update header");
        }
    };

    const toggleActive = async (id, currentActive) => {
        try {
            await dispatch(updateHeader({ id, active: !currentActive })).unwrap();
            toast.success("Header status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteHeader(deleteHeaderId)).unwrap();
            toast.success("Header deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete header");
        }
    };

    const filteredHeaders = headers.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DefaultPageAdmin>
            {/* Header + Search + Add Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Headers</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search headers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Header
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredHeaders.map((h, idx) => (
                                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                                        {idx + 1}.
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                        {h.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={h.active}
                                                onChange={() => toggleActive(h.id, h.active)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${h.active ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <span
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${h.active ? "translate-x-6" : "translate-x-0"
                                                        }`}
                                                />
                                            </span>
                                            <span
                                                className={`ml-3 text-sm font-medium ${h.active ? "text-green-600" : "text-gray-500"
                                                    }`}
                                            >
                                                {h.active ? "Active" : "Inactive"}
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => { setEditHeader({ id: h.id, name: h.name }); setEditModalOpen(true); }}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteHeaderId(h.id); setDeleteModalOpen(true); }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                            {filteredHeaders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                                        No headers found
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
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Header</h2>
                        <input
                            type="text"
                            placeholder="Header Name"
                            value={newHeader}
                            onChange={(e) => setNewHeader(e.target.value)}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddHeader}
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
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Header</h2>
                        <input
                            type="text"
                            placeholder="Header Name"
                            value={editHeader.name}
                            onChange={(e) => setEditHeader({ ...editHeader, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditHeader}
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
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this header?</p>
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

export default AddHeader;
