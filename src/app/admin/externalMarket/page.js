"use client";
import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useSelector, useDispatch } from "react-redux";
import { fetchMarketLinks, deleteMarketLink } from "@/app/redux/slices/externalMarket/externalMarketSlice";
import AddEditMarketLinkModal from "@/components/Custom/AddEditMarketLinkModal";
import { Plus, Trash2, Edit, X } from "lucide-react";
import toast from "react-hot-toast";
import {
    fetchCategories,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import {
    fetchSubcategories,
} from "@/app/redux/slices/subcategory/subcategorySlice";

const ExternalMarket = () => {
    const dispatch = useDispatch();
    const { links } = useSelector((state) => state.marketLinks);
    console.log("links", links)
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("");
    const { categories } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    const [countries, setCountries] = useState([]);
    console.log("subcategories", subcategories)
    useEffect(() => {
        dispatch(fetchMarketLinks())
        dispatch(fetchCategories())
        dispatch(fetchSubcategories())
    }, [dispatch])


    const filteredLinks = links.filter((l) => {
        let match = true;

        // Filter by category
        if (selectedCategory) {
            match = match && l.product?.categoryId === Number(selectedCategory);
        }

        // Filter by subcategory
        if (selectedSubcategory) {
            match = match && l.product?.subcategoryId === Number(selectedSubcategory);
        }

        // Filter by country
        if (selectedCountry) {
            match = match && l.countryCode === selectedCountry;
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            match =
                match &&
                (l.name.toLowerCase().includes(searchLower) ||
                    l.url.toLowerCase().includes(searchLower));
        }

        return match;
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=cca3,name,flags,currencies"
                );
                const data = await res.json();

                if (!Array.isArray(data)) return;

                const formatted = data.map((c) => ({
                    code: c.cca3,
                    name: c.name?.common || "",
                    flag: c.flags?.svg || c.flags?.png || "", // use SVG if available
                }));

                // Sort alphabetically by name
                formatted.sort((a, b) => a.name.localeCompare(b.name));

                setCountries(formatted);
            } catch (err) {
                console.error("Failed to fetch countries:", err);
            }
        };

        fetchCountries();
    }, []);



    const handleDelete = async () => {
        try {
            await dispatch(deleteMarketLink(deleteId)).unwrap();
            toast.success("Deleted successfully");
            setDeleteModalOpen(false);
        } catch {
            toast.error("Failed to delete");
        }
    };

    return (
        <DefaultPageAdmin>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">External Market Links</h1>
                {/* <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Filter By</option>
                        <option value="category">Category</option>
                        <option value="product">Product</option>
                        <option value="subcategory">Subcategory</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => { setEditData(null); setModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Link
                    </button> 
                </div> */}
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    {/* Category Filter */}
                    {/* Category Select */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Categories</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Subcategory Select */}
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Subcategories</option>
                        {subcategories
                            ?.filter((sub) => !selectedCategory || sub.categoryId === parseInt(selectedCategory))
                            .map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))
                        }
                    </select>

                    {/* Country Filter */}
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.name} ({c.code})
                            </option>
                        ))}
                    </select>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>


            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">S.No</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Subcategory</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Country</th>
                            <th className="px-4 py-2 text-left">Code</th>
                            <th className="px-4 py-2 text-left">URL</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                            <th className="px-4 py-2 text-left">Updated At</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLinks.map((l, idx) => {
                            const category = categories.find(c => c.id === l.product?.categoryId);
                            const subcategory = subcategories.find(sc => sc.id === l.product?.subcategoryId);
                            return (
                                <tr key={l.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">{category?.name || "N/A"}</td>
                                    <td className="px-4 py-2">{subcategory?.name || "N/A"}</td>
                                    <td className="px-4 py-2">{l.name}</td>
                                    <td className="px-4 py-2">{l.countryName}</td>
                                    <td className="px-4 py-2">{l.countryCode}</td>

                                    <td className="px-4 py-2">
                                        <a href={l.url} target="_blank" className="text-blue-600 hover:underline">
                                            {l.url.length > 50 ? l.url.slice(0, 30) + "..." + l.url.slice(-15) : l.url}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">{new Date(l.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-2">{new Date(l.updatedAt).toLocaleString()}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button onClick={() => { setEditData(l); setModalOpen(true); }} className="text-blue-500  cursor-pointer"><Edit /></button>
                                        <button onClick={() => { setDeleteId(l.id); setDeleteModalOpen(true); }} className="text-red-500  cursor-pointer"><Trash2 /></button>
                                    </td>
                                </tr>
                            )
                        })}
                        {filteredLinks.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No links found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <AddEditMarketLinkModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editData={editData}
            />

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                        <button onClick={() => setDeleteModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this link?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default ExternalMarket;
