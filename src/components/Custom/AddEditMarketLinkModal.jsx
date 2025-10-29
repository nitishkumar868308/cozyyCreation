"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { createMarketLink, updateMarketLink } from "@/app/redux/slices/externalMarket/externalMarketSlice";
import toast from "react-hot-toast";

const countries = [
    { name: "United States", code: "US" },
    { name: "India", code: "IN" },
    { name: "United Kingdom", code: "UK" },
    { name: "Canada", code: "CA" },
    // Add more countries here
];

const AddEditMarketLinkModal = ({ isOpen, onClose, editData, onSelect, productName }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ countryName: "", countryCode: "", productName: "", url: "" });

    useEffect(() => {
        if (editData) {
            setForm({
                countryName: editData.countryName || "",
                countryCode: editData.countryCode || "",
                productName: editData.productName || editData.name || "",
                url: editData.url || "",
            });
        } else {
            setForm({
                countryName: "",
                countryCode: "",
                productName: productName || "",
                url: "",
            });
        }
    }, [editData, productName]);

    const handleSubmit = async () => {
        if (!form.countryName || !form.countryCode || !form.productName || !form.url) {
            return toast.error("All fields are required");
        }

        try {
            let link;
            if (editData) {
                const payload = { ...form, id: editData.id };
                link = await dispatch(updateMarketLink(payload)).unwrap();
                toast.success("Updated successfully");
            } else {
                link = await dispatch(createMarketLink(form)).unwrap();
                toast.success("Added successfully");
            }

            if (onSelect && link) onSelect(link);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.message || "Operation failed");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">{editData ? "Edit Link" : "Add Link"}</h2>

                <select
                    value={form.countryName || ""}
                    onChange={(e) => {
                        const selected = countries.find(c => c.name === e.target.value);
                        setForm({ ...form, countryName: selected.name, countryCode: selected.code });
                    }}
                    className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Select Country</option>
                    {countries.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Product Name"
                    value={form.productName || ""}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    readOnly={!!form.productName}
                    className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />


                <input
                    type="text"
                    placeholder="URL"
                    value={form.url || ""}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                    >
                        {editData ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditMarketLinkModal;
