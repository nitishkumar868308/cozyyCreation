"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    fetchCountryPricing,
    createCountryPricing,
    updateCountryPricing,
    deleteCountryPricing,
} from "@/app/redux/slices/countryPricing/countryPricingSlice";

const CountryPricing = () => {
    const dispatch = useDispatch();
    const { countryPricing } = useSelector((state) => state.countryPricing);
    const [countries, setCountries] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentPricing, setCurrentPricing] = useState({
        id: null,
        country: "",
        code: "",
        multiplier: "",
        currency: "",
        active: true,
        conversionRate: ""
    });
    const [deleteId, setDeleteId] = useState(null);
    console.log("countryPricing", countryPricing)
    useEffect(() => {
        dispatch(fetchCountryPricing());
    }, [dispatch]);

    // Filter
    const filteredPricing = (countryPricing || []).filter(
        (item) =>
            item.code.toLowerCase().includes(search.toLowerCase()) ||
            item.currency.toLowerCase().includes(search.toLowerCase())
    );


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch("https://restcountries.com/v3.1/all?fields=cca3,name,currencies");
                const data = await res.json();
                console.log("data", data);

                if (!Array.isArray(data)) {
                    console.error("Expected an array but got:", data);
                    return;
                }

                const formatted = data.map((c) => {
                    const currencyKey = c.currencies ? Object.keys(c.currencies)[0] : null;
                    const currencySymbol =
                        c.currencies && currencyKey && c.currencies[currencyKey]?.symbol
                            ? c.currencies[currencyKey].symbol
                            : ""; // fallback to empty string if not available

                    return {
                        code: c.cca3,
                        name: c.name?.common || "",
                        currency: currencyKey || "",
                        currencySymbol,
                    };
                })

                setCountries(formatted);
                setFilteredCountries(formatted);
            } catch (err) {
                console.error("Failed to fetch countries:", err);
            }
        };

        fetchCountries();
    }, []);



    // Modal handlers
    const openAddModal = () => {
        setModalType("add");
        setCurrentPricing({ id: null, code: "", multiplier: 1, currency: "", active: true, conversionRate: "" });
        setIsModalOpen(true);
    };
    const openEditModal = (item) => {
        setModalType("edit");
        setCurrentPricing(item);
        setIsModalOpen(true);
    };
    const openDeleteModal = (id) => {
        setDeleteId(id);
        setModalType("delete");
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!currentPricing.country || !currentPricing.code || !currentPricing.currency || !currentPricing.multiplier) {
            toast.error("All fields (Country, Code, Multiplier, Currency) are required!");
            return;
        }

        try {
            let response;
            if (modalType === "add") {
                response = await dispatch(createCountryPricing(currentPricing)).unwrap(); // unwrap to get actual response
            } else if (modalType === "edit") {
                response = await dispatch(updateCountryPricing(currentPricing)).unwrap();
            }

            if (response?.message) {
                toast.success(response.message); // show backend success message
            } else {
                toast.success(modalType === "add" ? "Country Pricing added!" : "Country Pricing updated!");
            }

            setIsModalOpen(false);
        } catch (err) {
            // err should contain backend error message
            const errorMsg = err?.message || err?.data?.message || "Failed to save country pricing";
            toast.error(errorMsg);
        }
    };


    const handleDelete = async () => {
        await dispatch(deleteCountryPricing(deleteId));
        toast.success("Country Pricing deleted!");
        setIsModalOpen(false);
    };

    return (
        <DefaultPageAdmin>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Country Pricing</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search Country..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Country
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Multiplier</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPricing.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4 font-medium">{item.code}</td>
                                    <td className="px-6 py-4">{item.multiplier}</td>
                                     <td className="px-6 py-4">{item.conversionRate}</td>
                                    <td className="px-6 py-4">{item.currency}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${item.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                            {item.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => openDeleteModal(item.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPricing.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-400 italic">
                                        No countries found
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
                    <Dialog.Panel className="bg-white rounded max-w-xl w-full p-6">
                        {modalType === "delete" ? (
                            <>
                                <Dialog.Title className="text-lg font-bold text-red-600">Delete Country Pricing</Dialog.Title>
                                <p className="my-4">Are you sure you want to delete this country?</p>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">Delete</button>
                                </div>
                            </>
                        ) : (
                            // <>
                            //     <Dialog.Title className="text-lg font-bold mb-4 text-center">{modalType === "add" ? "Add Country Pricing" : "Edit Country Pricing"}</Dialog.Title>
                            //     <div className="flex flex-col gap-4">
                            //         {/* Country Select with Search */}
                            //         <div className="w-full">
                            //             <label className="block text-sm font-semibold bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent mb-1">
                            //                 Search Country
                            //             </label>

                            //             <div className="relative">
                            //                 <input
                            //                     type="text"
                            //                     placeholder="Search Country..."
                            //                     className="border rounded px-3 py-2 w-full"
                            //                     value={currentPricing.country || ""}
                            //                     onChange={(e) => {
                            //                         const searchValue = e.target.value.toLowerCase();
                            //                         setFilteredCountries(
                            //                             countries.filter(
                            //                                 (c) =>
                            //                                     c.name.toLowerCase().includes(searchValue) ||
                            //                                     c.code.toLowerCase().includes(searchValue)
                            //                             )
                            //                         );
                            //                         setShowDropdown(true);
                            //                         setCurrentPricing({ ...currentPricing, country: e.target.value });
                            //                     }}
                            //                     onFocus={() => setShowDropdown(true)}
                            //                     disabled={modalType === "edit"}
                            //                 />

                            //                 {showDropdown && filteredCountries.length > 0 && (
                            //                     <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-auto">
                            //                         {filteredCountries.map((c) => (
                            //                             <li
                            //                                 key={c.code}
                            //                                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            //                                 onClick={() => {
                            //                                     setCurrentPricing({
                            //                                         ...currentPricing,
                            //                                         country: c.name,
                            //                                         code: c.code,
                            //                                         currency: c.currency,
                            //                                         currencySymbol: c.currencySymbol,
                            //                                     });
                            //                                     setShowDropdown(false);
                            //                                 }}
                            //                             >
                            //                                 {c.name} ({c.code})
                            //                             </li>
                            //                         ))}
                            //                     </ul>
                            //                 )}
                            //             </div>
                            //         </div>
                            //         {/* Currency input */}
                            //         <input
                            //             type="text"
                            //             placeholder="Currency"
                            //             className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                            //             value={currentPricing.currency || ""}
                            //             readOnly
                            //         />

                            //         <input
                            //             type="text"
                            //             placeholder="currencySymbol"
                            //             className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                            //             value={currentPricing.currencySymbol || ""}
                            //             readOnly
                            //         />

                            //         <label className="block text-sm font-semibold bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent ">
                            //             Amount Multiplier
                            //         </label>
                            //         <input
                            //             type="number"
                            //             placeholder="Multiplier"
                            //             className="border rounded px-3 py-2 w-full"
                            //             value={currentPricing.multiplier ?? ""}
                            //             onChange={(e) => {
                            //                 const value = e.target.value;
                            //                 setCurrentPricing({
                            //                     ...currentPricing,
                            //                     multiplier: value === "" ? "" : parseFloat(value),
                            //                 });
                            //             }}
                            //         />
                            //         <div className="flex justify-end gap-2">
                            //             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
                            //             <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                            //                 {modalType === "add" ? "Add" : "Save"}
                            //             </button>
                            //         </div>
                            //     </div>
                            // </>
                            <>
                                <Dialog.Title className="text-2xl font-semibold text-center text-gray-900 mb-6">
                                    {modalType === "add" ? "Add Country Pricing" : "Edit Country Pricing"}
                                </Dialog.Title>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Country Select */}
                                    <div className="flex flex-col relative">
                                        <label htmlFor="country" className="mb-1 text-gray-700 font-medium">
                                            Select Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            placeholder="Search Country"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                                            value={currentPricing.country || ""}
                                            onChange={(e) => {
                                                const searchValue = e.target.value.toLowerCase();
                                                setFilteredCountries(
                                                    countries.filter(
                                                        (c) =>
                                                            c.name.toLowerCase().includes(searchValue) ||
                                                            c.code.toLowerCase().includes(searchValue)
                                                    )
                                                );
                                                setShowDropdown(true);
                                                setCurrentPricing({ ...currentPricing, country: e.target.value });
                                            }}
                                            onFocus={() => setShowDropdown(true)}
                                            disabled={modalType === "edit"}
                                        />

                                        {showDropdown && filteredCountries.length > 0 && (
                                            <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow max-h-44 overflow-auto">
                                                {filteredCountries.map((c) => (
                                                    <li
                                                        key={c.code}
                                                        className="px-4 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
                                                        onClick={() => {
                                                            setCurrentPricing({
                                                                ...currentPricing,
                                                                country: c.name,
                                                                code: c.code,
                                                                currency: c.currency,
                                                                currencySymbol: c.currencySymbol,
                                                            });
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        {c.name} <span className="text-gray-500">({c.code})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>


                                    {/* Currency */}
                                    <div className="flex flex-col">
                                        <label htmlFor="currency" className="mb-1 text-gray-700 font-medium">
                                            Currency
                                        </label>
                                        <input
                                            type="text"
                                            id="currency"
                                            placeholder="Currency"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                                            value={currentPricing.currency || ""}
                                            readOnly
                                        />
                                    </div>

                                    {/* Currency Symbol */}
                                    <div className="flex flex-col">
                                        <label htmlFor="symbol" className="mb-1 text-gray-700 font-medium">
                                            Currency Symbol
                                        </label>
                                        <input
                                            type="text"
                                            id="symbol"
                                            placeholder="Currency Symbol"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                                            value={currentPricing.currencySymbol || ""}
                                            readOnly
                                        />
                                    </div>

                                    {/* Amount Multiplier */}
                                    <div className="flex flex-col">
                                        <label htmlFor="multiplier" className="mb-1 text-gray-700 font-medium">
                                            Amount Multiplier
                                        </label>
                                        <input
                                            type="number"
                                            id="multiplier"
                                            placeholder="Amount Multiplier"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                                            value={currentPricing.multiplier ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setCurrentPricing({
                                                    ...currentPricing,
                                                    multiplier: value === "" ? "" : parseFloat(value),
                                                });
                                            }}
                                        />
                                    </div>

                                    {/* Conversion Rate */}
                                    <div className="flex flex-col">
                                        <label htmlFor="conversionRate" className="mb-1 text-gray-700 font-medium">
                                            Conversion Rate
                                        </label>
                                        <input
                                            type="number"
                                            id="conversionRate"
                                            placeholder="Conversion Rate"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                                            value={currentPricing.conversionRate ?? ""}
                                            onChange={(e) =>
                                                setCurrentPricing({
                                                    ...currentPricing,
                                                    conversionRate: e.target.value === "" ? "" : parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-800 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-black cursor-pointer text-white rounded-md hover:bg-gray-900 transition"
                                    >
                                        {modalType === "add" ? "Add" : "Save"}
                                    </button>
                                </div>
                            </>




                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </DefaultPageAdmin>
    );
};

export default CountryPricing;
