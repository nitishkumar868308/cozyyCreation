"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEditMarketLinkModal from "@/components/Custom/AddEditMarketLinkModal";
import { fetchMarketLinks } from "@/app/redux/slices/externalMarket/externalMarketSlice";

const ExternalLinks = ({
    editModalOpen,
    newProduct,
    setNewProduct,
    editProductData,
    setEditProductData,
}) => {
    const dispatch = useDispatch();
    const isEdit = editModalOpen;
    const currentData = isEdit ? editProductData : newProduct;
    const setCurrentData = isEdit ? setEditProductData : setNewProduct;

    const { links } = useSelector((state) => state.marketLinks);

    const [externalUrl, setExternalUrl] = useState("");
    const [previewLinks, setPreviewLinks] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    const inputRef = useRef(null);

    // Fetch market links on mount
    useEffect(() => {
        dispatch(fetchMarketLinks());
    }, [dispatch]);
    console.log("currentData" , currentData)
    // Filter links based on input
    useEffect(() => {
        const query = externalUrl.trim().toLowerCase();
        if (!query) {
            setFilteredLinks([]);
            setShowDropdown(false);
            return;
        }

        const filtered = links.filter(
            (link) =>
                link.name?.toLowerCase().includes(query) ||
                link.countryName?.toLowerCase().includes(query)
        );

        setFilteredLinks(filtered);
        setShowDropdown(filtered.length > 0);
    }, [externalUrl, links]);

    // Sync previewLinks when product changes
    useEffect(() => {
        if (!currentData) return;

        if (currentData.marketLinks && currentData.marketLinks.length > 0) {
            setPreviewLinks(currentData.marketLinks);
        } else {
            setPreviewLinks([]);
        }
    }, [currentData]);


    // Handle selecting a link from dropdown
    const handleSelectLink = (link) => {
        // Add to preview
        setPreviewLinks((prev) => {
            if (!prev.find((l) => l.id === link.id)) return [...prev, link];
            return prev;
        });

        // Update currentData.marketLinks
        setCurrentData((prev) => {
            const existingLinks = prev.marketLinks || [];
            if (!existingLinks.find((l) => l.id === link.id)) {
                return { ...prev, marketLinks: [...existingLinks, link] };
            }
            return prev;
        });

        setShowDropdown(false);
        setExternalUrl("");
    };

    const handleRemoveLink = (linkId) => {
        setPreviewLinks((prev) => prev.filter((l) => l.id !== linkId));
        setCurrentData((prev) => ({
            ...prev,
            marketLinks: (prev.marketLinks || []).filter((l) => l.id !== linkId),
        }));
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="p-6 bg-white rounded-3xl shadow-lg h-full max-h-[90vh] md:max-h-[75vh] overflow-y-auto mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">External Link Details</h3>

            <form className="grid grid-cols-1 gap-6">
                <div className="flex flex-col relative" ref={inputRef}>
                    <label className="mb-2 font-medium text-gray-700">External URL</label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search Country Name or add external URL"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setActiveModal({ type: "add", productName: currentData.name })
                            }
                            className="bg-gray-600 hover:bg-gray-800 cursor-pointer text-white font-medium px-4 py-3 rounded-2xl transition"
                        >
                            Add
                        </button>
                    </div>

                    {/* Dropdown for search results */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                            {filteredLinks.map((link, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectLink(link)}
                                >
                                    {link.name} ({link.countryName})
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Preview links */}
                    {previewLinks.length > 0 && (
                        <div className="mt-4 border-t pt-4 space-y-2">
                            {previewLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="flex-1">
                                        <span className="font-medium">
                                            {link.countryName || "Unknown Country"}
                                        </span>
                                        <a
                                            href={link.url || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline block truncate max-w-xs"
                                            title={link.url}
                                        >
                                            {link.url || "No URL"}
                                        </a>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        {/* Edit button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveModal({ type: "edit", link })
                                            }
                                            className="px-3 py-1 cursor-pointer bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                        >
                                            Edit
                                        </button>

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLink(link.id)}
                                            className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add/Edit Modal */}
                    {activeModal && (
                        <AddEditMarketLinkModal
                            isOpen={true}
                            onClose={() => setActiveModal(null)}
                            editData={activeModal.type === "edit" ? activeModal.link : null}
                            productName={
                                activeModal.type === "add" ? currentData.name : undefined
                            }
                            onSelect={(updatedLink) => {
                                setPreviewLinks((prev) => {
                                    if (activeModal.type === "edit") {
                                        return prev.map((l) =>
                                            l.id === updatedLink.id ? updatedLink : l
                                        );
                                    } else {
                                        return [...prev, updatedLink];
                                    }
                                });

                                setCurrentData((prev) => {
                                    const existingLinks = prev.marketLinks || [];
                                    if (activeModal.type === "edit") {
                                        const newLinks = existingLinks.map((l) =>
                                            l.id === updatedLink.id ? updatedLink : l
                                        );
                                        return { ...prev, marketLinks: newLinks };
                                    } else {
                                        return { ...prev, marketLinks: [...existingLinks, updatedLink] };
                                    }
                                });

                                setActiveModal(null);
                            }}
                        />
                    )}
                </div>
            </form>
        </div>
    );
};

export default ExternalLinks;
