"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { fetchOffers, createOffer, updateOffer, deleteOffer } from '@/app/redux/slices/offer/offerSlice'
import { useDispatch, useSelector } from "react-redux";

const Offer = () => {
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { offers, loading, error } = useSelector((state) => state.offers);
    const [newOffer, setNewOffer] = useState({
        name: "",
        discountType: "percentage",
        discountValue: {},
        type: [],
        description: ""
    });
    console.log("offers", offers)
    const [editOffer, setEditOffer] = useState({
        id: null, name: "",
        discountType: "percentage",
        discountValue: {},
        type: [],
        description: ""
    });
    const [deleteOfferId, setDeleteOfferId] = useState(null);

    useEffect(() => {
        dispatch(fetchOffers());
    }, [dispatch]);

    const handleAddOffer = () => {
        if (!newOffer.name || !newOffer.discountType || !newOffer.discountValue || !newOffer.type || !newOffer.description) {
            return alert("Please fill all fields");
        }

        dispatch(createOffer(newOffer))
            .unwrap()
            .then(() => {
                setNewOffer({
                    name: "",
                    discountType: "percentage",
                    discountValue: {},
                    type: [],
                    description: ""
                });
                setModalOpen(false);
            })
            .catch((err) => {
                console.error("Failed to create offer:", err);
            });
    };

    // Update Offer
    const handleUpdateOffer = () => {
        if (!editOffer?.id) return;

        dispatch(updateOffer(editOffer))
            .unwrap()
            .then(() => {
                setEditModalOpen(false);
            })
            .catch((err) => {
                console.error("Failed to update offer:", err);
            });
    };

    // Delete Offer
    const handleDeleteOffer = () => {
        if (!deleteOfferId) return;

        dispatch(deleteOffer(deleteOfferId))
            .unwrap()
            .then(() => {
                setDeleteModalOpen(false);
            })
            .catch((err) => {
                console.error("Failed to delete offer:", err);
            });
    };

    const filteredOffers = offers.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = () => {
        setNewOffer({
            name: "",
            discountType: "percentage",
            discountValue: {},
            type: [],
            description: ""
        });
        setModalOpen(true);
    };


    return (
        <DefaultPageAdmin>
            {/* Header + Search + Add Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Offers</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search offers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Offer
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOffers.map((o, idx) => (
                                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">{idx + 1}.</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{o.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{o.discountType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {o.discountType === "percentage"
                                            ? `${o.discountValue.percent || 0}%`
                                            : o.discountType === "buyXGetY"
                                                ? `Buy ${o.discountValue.buy || 0} Get ${o.discountValue.free || 0} Free`
                                                : o.discountType === "rangeBuyXGetY"
                                                    ? `Buy ${o.discountValue.start || 0}-${o.discountValue.end || 0} Get ${o.discountValue.free || 0} Free`
                                                    : ""}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{o.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditOffer(o);
                                                    setNewOffer(o);
                                                    setEditModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteOfferId(o.id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOffers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                                        No offers found
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

                        <h2 className="text-xl font-bold mb-4 text-center">Add New Offer</h2>

                        {/* Offer Name */}
                        <input
                            type="text"
                            placeholder="Offer Name"
                            value={newOffer.name}
                            onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* Discount Type */}
                        <select
                            value={newOffer.discountType}
                            onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value, discountValue: {} })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="buyXGetY">Buy X Get Y Free</option>
                            <option value="rangeBuyXGetY">Range Buy X Get Y Free</option>
                        </select>

                        {/* Discount Value Dynamic Inputs */}
                        {newOffer.discountType === "percentage" && (
                            <input
                                type="number"
                                placeholder="Discount % (e.g., 10)"
                                value={newOffer.discountValue.percent || ""}
                                onChange={(e) =>
                                    setNewOffer({ ...newOffer, discountValue: { percent: parseFloat(e.target.value) } })
                                }
                                className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        )}

                        {newOffer.discountType === "buyXGetY" && (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="number"
                                    placeholder="Buy X"
                                    value={newOffer.discountValue.buy || ""}
                                    onChange={(e) =>
                                        setNewOffer({
                                            ...newOffer,
                                            discountValue: { ...newOffer.discountValue, buy: parseInt(e.target.value) },
                                        })
                                    }
                                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Get Y Free"
                                    value={newOffer.discountValue.free || ""}
                                    onChange={(e) =>
                                        setNewOffer({
                                            ...newOffer,
                                            discountValue: { ...newOffer.discountValue, free: parseInt(e.target.value) },
                                        })
                                    }
                                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        )}

                        {newOffer.discountType === "rangeBuyXGetY" && (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="number"
                                    placeholder="Start Range (e.g., 12)"
                                    value={newOffer.discountValue.start || ""}
                                    onChange={(e) =>
                                        setNewOffer({
                                            ...newOffer,
                                            discountValue: { ...newOffer.discountValue, start: parseInt(e.target.value) },
                                        })
                                    }
                                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="number"
                                    placeholder="End Range (e.g., 19)"
                                    value={newOffer.discountValue.end || ""}
                                    onChange={(e) =>
                                        setNewOffer({
                                            ...newOffer,
                                            discountValue: { ...newOffer.discountValue, end: parseInt(e.target.value) },
                                        })
                                    }
                                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Free Quantity"
                                    value={newOffer.discountValue.free || ""}
                                    onChange={(e) =>
                                        setNewOffer({
                                            ...newOffer,
                                            discountValue: { ...newOffer.discountValue, free: parseInt(e.target.value) },
                                        })
                                    }
                                    className="border rounded-lg px-4 py-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        )}


                        {/* Description */}
                        <input
                            type="text"
                            placeholder="Description"
                            value={newOffer.description || ""}
                            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* Apply Offer To */}
                        <div className="mb-4">
                            <p className="font-medium mb-2">Apply Offer To:</p>
                            <div className="flex flex-wrap gap-4">
                                {["product", "Subcategory"].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newOffer.type.includes(type)}
                                            onChange={(e) => {
                                                const newTypes = e.target.checked
                                                    ? [...newOffer.type, type]
                                                    : newOffer.type.filter((t) => t !== type);
                                                setNewOffer({ ...newOffer, type: newTypes });
                                            }}
                                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                                        />
                                        <span className="capitalize text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOffer}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Offer</h2>

                        {/* Bind inputs to editOffer */}
                        <input
                            type="text"
                            placeholder="Offer Name"
                            value={editOffer.name}
                            onChange={(e) => setEditOffer({ ...editOffer, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <select
                            value={editOffer.discountType}
                            onChange={(e) => setEditOffer({ ...editOffer, discountType: e.target.value, discountValue: {} })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="buyXGetY">Buy X Get Y Free</option>
                            <option value="rangeBuyXGetY">Range Buy X Get Y Free</option>
                        </select>

                        {editOffer.discountType === "percentage" && (
                            <input
                                type="number"
                                placeholder="Discount % (e.g., 10)"
                                value={editOffer.discountValue.percent || ""}
                                onChange={(e) => setEditOffer({ ...editOffer, discountValue: { percent: parseFloat(e.target.value) } })}
                                className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        )}

                        {editOffer.discountType === "buyXGetY" && (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="number"
                                    placeholder="Buy X"
                                    value={editOffer.discountValue.buy || ""}
                                    onChange={(e) => setEditOffer({
                                        ...editOffer,
                                        discountValue: { ...editOffer.discountValue, buy: parseInt(e.target.value) }
                                    })}
                                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Get Y Free"
                                    value={editOffer.discountValue.free || ""}
                                    onChange={(e) => setEditOffer({
                                        ...editOffer,
                                        discountValue: { ...editOffer.discountValue, free: parseInt(e.target.value) }
                                    })}
                                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Description"
                            value={editOffer.description}
                            onChange={(e) => setEditOffer({ ...editOffer, description: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="mb-4">
                            <p className="font-medium mb-2">Apply Offer To:</p>
                            <div className="flex flex-wrap gap-4">
                                {["product", "Subcategory"].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editOffer.type.includes(type)}
                                            onChange={(e) => {
                                                const newTypes = e.target.checked
                                                    ? [...editOffer.type, type]
                                                    : editOffer.type.filter((t) => t !== type);
                                                setEditOffer({ ...editOffer, type: newTypes });
                                            }}
                                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                                        />
                                        <span className="capitalize text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleUpdateOffer} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
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
                        <button onClick={() => setDeleteModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this offer?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleDeleteOffer} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default Offer;
