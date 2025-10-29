"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "@/components/Include/Loader";
import {
    fetchAllCountryTaxes,
    createCountryTax,
    updateCountryTax,
    deleteCountryTax,
} from "@/app/redux/slices/countryTaxes/countryTaxesSlice";
import {
    fetchCategories,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import { useCountries } from "@/lib/CustomHook/useCountries";

const CountryTaxes = () => {
    const dispatch = useDispatch();
    const { allCountryTaxes  } = useSelector((state) => state.countryTax);
    const { categories } = useSelector((state) => state.category);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { countries } = useCountries();
    console.log("countries", countries)
    console.log("allCountryTaxes", allCountryTaxes)
    const [newTax, setNewTax] = useState({
        country: "",
        category: "",
        type: "General",
        percentageGeneral: "",
        percentageGST: "",
    });


    const [editTax, setEditTax] = useState({
        id: null,
        country: "",
        type: "General",
        percentage: "",
        gstNumber: "",
    });

    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchAllCountryTaxes());
        dispatch(fetchCategories())
    }, [dispatch]);

    const selectedCategory = categories.find(cat => cat.name === newTax.category);

    const handleAdd = async () => {
        console.log("newTax", newTax)
        if (!newTax.category) {
            toast.error("Category is required");
            return;
        }
        if (!newTax.country) {
            toast.error("Country is required");
            return;
        }
        if (newTax.type === "General" && !newTax.percentageGeneral) {
            toast.error("General tax percentage is required");
            return;
        }
        if (newTax.type === "GST" && !newTax.percentageGST) {
            toast.error("GST percentage is required");
            return;
        }
        if (newTax.type === "Both" && (!newTax.percentageGeneral || !newTax.percentageGST)) {
            toast.error("Both tax percentages are required");
            return;
        }

        const selectedCategory = categories.find(cat => cat.name === newTax.category);
        if (!selectedCategory) {
            toast.error("Invalid category selected");
            return;
        }

        const selectedCountryObj = countries.find(c => c.name === newTax.country);
        const countryCode = selectedCountryObj ? selectedCountryObj.code : null;
        console.log("countryCode", countryCode)

        setLoading(true);
        try {
            if (newTax.type === "Both") {
                await Promise.all([
                    dispatch(createCountryTax({
                        categoryId: selectedCategory.id,
                        country: newTax.country,
                        type: "General",
                        countryCode,
                        generalTax: parseFloat(newTax.percentageGeneral),
                        gstTax: null,
                    })).unwrap(),
                    dispatch(createCountryTax({
                        categoryId: selectedCategory.id,
                        country: newTax.country,
                        type: "GST",
                        countryCode,
                        generalTax: null,
                        gstTax: parseFloat(newTax.percentageGST),
                    })).unwrap()
                ]);
            } else {
                await dispatch(createCountryTax({
                    categoryId: selectedCategory.id,
                    country: newTax.country,
                    type: newTax.type,
                    countryCode,
                    generalTax: newTax.type === "General" ? parseFloat(newTax.percentageGeneral) : null,
                    gstTax: newTax.type === "GST" ? parseFloat(newTax.percentageGST) : null,
                })).unwrap();
            }


            await dispatch(fetchAllCountryTaxes());
            toast.success("Country Tax(s) added successfully");
            setNewTax({ country: "", category: "", type: "General", percentageGeneral: "", percentageGST: "" });
            
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editTax.country) {
            toast.error("Country is required");
            return;
        }

        if (editTax.type === "General" && !editTax.generalTax) {
            toast.error("General tax percentage is required");
            return;
        }

        if (editTax.type === "GST" && !editTax.gstTax) {
            toast.error("GST tax percentage is required");
            return;
        }

        setLoading(true);
        try {
            await dispatch(updateCountryTax({
                id: editTax.id,
                country: editTax.country,
                type: editTax.type,
                generalTax: editTax.type === "General" ? parseFloat(editTax.generalTax) : null,
                gstTax: editTax.type === "GST" ? parseFloat(editTax.gstTax) : null,
            })).unwrap();

            toast.success("Country Tax updated successfully");
            setEditModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        setLoading(true);
        try {
            await dispatch(deleteCountryTax(deleteId)).unwrap();
            toast.success("Deleted successfully");
            await dispatch(fetchAllCountryTaxes()).unwrap();
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    const filtered = allCountryTaxes.filter((c) =>
        c.country.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <DefaultPageAdmin>
            {loading && <Loader />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Country Taxes</h1>
                <div className="flex gap-2 items-center flex-wrap md:flex-nowrap w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Tax
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax %</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.map((t, idx) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {t.category?.name || "N/A"}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-gray-800">{t.country}</td>
                                    <td className="px-6 py-4">{t.type}</td>
                                    <td className="px-6 py-4">
                                        {t.type === "General" ? t.generalTax : t.gstTax}%
                                    </td>


                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditTax(t);
                                                    setEditModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteId(t.id);
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
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-400 italic">
                                        No country taxes found
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

                        <h2 className="text-xl font-bold mb-4 text-center">Add Country Tax</h2>

                        {/* Category Select */}
                        <select
                            value={newTax.category}
                            onChange={(e) => setNewTax({ ...newTax, category: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Country Select (render only after category selected) */}
                        {newTax.category && (
                            <select
                                value={newTax.country}
                                onChange={(e) => setNewTax({ ...newTax, country: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Tax Type */}
                        {newTax.country && (
                            <select
                                value={newTax.type}
                                onChange={(e) =>
                                    setNewTax((prev) => ({
                                        ...prev,
                                        type: e.target.value,
                                        percentageGeneral: e.target.value === "Both" ? "" : prev.percentageGeneral,
                                        percentageGST: e.target.value === "Both" ? "" : prev.percentageGST,
                                    }))
                                }
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            >
                                <option value="">Select Tax Type</option>
                                <option value="General">General</option>
                                <option value="GST">GST</option>
                                <option value="Both">Both</option>
                            </select>

                        )}

                        {/* Inputs based on type */}
                        {newTax.type === "General" && (
                            <input
                                type="number"
                                placeholder="General Tax Percentage"
                                value={newTax.percentageGeneral || ""}
                                onChange={(e) => setNewTax({ ...newTax, percentageGeneral: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            />
                        )}

                        {newTax.type === "GST" && (
                            <input
                                type="number"
                                placeholder="GST Tax Percentage"
                                value={newTax.percentageGST || ""}
                                onChange={(e) => setNewTax({ ...newTax, percentageGST: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            />
                        )}

                        {newTax.type === "Both" && (
                            <>
                                <input
                                    type="number"
                                    placeholder="General Tax Percentage"
                                    value={newTax.percentageGeneral}
                                    onChange={(e) => setNewTax({ ...newTax, percentageGeneral: e.target.value })}
                                    className="border rounded-lg px-4 py-2 w-full mb-2"
                                />
                                <input
                                    type="number"
                                    placeholder="GST Tax Percentage"
                                    value={newTax.percentageGST}
                                    onChange={(e) => setNewTax({ ...newTax, percentageGST: e.target.value })}
                                    className="border rounded-lg px-4 py-2 w-full mb-2"
                                />
                            </>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 cursor-pointer rounded-lg border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-gray-600 text-white"
                            >
                                Save
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
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Country Tax</h2>

                        {/* Category Select */}
                        {/* Category Select */}
                        <select
                            value={editTax.categoryId || ""} // use categoryId
                            onChange={(e) => setEditTax({ ...editTax, categoryId: parseInt(e.target.value) })}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>


                        {/* Country Select */}
                        <select
                            value={editTax.country || ""}
                            onChange={(e) => setEditTax({ ...editTax, country: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        >
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Type Select */}
                        <select
                            value={editTax.type || "General"}
                            onChange={(e) => setEditTax({ ...editTax, type: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        >
                            <option value="General">General</option>
                            <option value="GST">GST</option>
                            <option value="Both">Both</option>
                        </select>

                        {/* Tax Percentage Inputs */}
                        {editTax.type === "General" && (
                            <input
                                type="number"
                                placeholder="General Tax Percentage"
                                value={editTax.generalTax ?? ""}
                                onChange={(e) => setEditTax({ ...editTax, generalTax: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            />
                        )}

                        {editTax.type === "GST" && (
                            <input
                                type="number"
                                placeholder="GST Tax Percentage"
                                value={editTax.gstTax ?? ""}
                                onChange={(e) => setEditTax({ ...editTax, gstTax: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            />
                        )}

                        {editTax.type === "Both" && (
                            <>
                                <input
                                    type="number"
                                    placeholder="General Tax Percentage"
                                    value={editTax.generalTax ?? ""}
                                    onChange={(e) => setEditTax({ ...editTax, generalTax: e.target.value })}
                                    className="border rounded-lg px-4 py-2 w-full mb-2"
                                />
                                <input
                                    type="number"
                                    placeholder="GST Tax Percentage"
                                    value={editTax.gstTax ?? ""}
                                    onChange={(e) => setEditTax({ ...editTax, gstTax: e.target.value })}
                                    className="border rounded-lg px-4 py-2 w-full mb-2"
                                />
                            </>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 cursor-pointer rounded-lg border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-gray-500 text-white"
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
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center relative">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this tax?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default CountryTaxes;
