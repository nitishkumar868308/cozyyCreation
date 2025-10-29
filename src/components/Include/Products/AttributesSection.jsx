"use client";
import React from "react";

const AttributesSection = ({
    selectedAttributes,
    setSelectedAttributes,
    searchTerm,
    setSearchTerm,
    expandedAttrs,
    setExpandedAttrs,
    filteredAttributes = [], // already passed as props
    toggleAttributeValue,
}) => {
    // Filter attributes using global searchTerm
    const visibleAttributes = filteredAttributes.filter((attr) =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Attributes</h3>

            {/* Global Search */}
            <input
                type="text"
                placeholder="Search attributes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="space-y-2 max-h-[500px] overflow-auto">
                {visibleAttributes.length === 0 && (
                    <div className="text-gray-500 text-center py-4">No attributes found</div>
                )}
                {visibleAttributes.map((attr) => (
                    <div key={attr.id} className="border rounded-lg shadow-sm">
                        <button
                            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-t-lg cursor-pointer"
                            onClick={() =>
                                setExpandedAttrs((prev) => ({
                                    ...prev,
                                    [attr.name]: !prev[attr.name],
                                }))
                            }
                        >
                            <span className="font-medium">{attr.name}</span>
                            <span>{expandedAttrs[attr.name] ? "-" : "+"}</span>
                        </button>

                        {expandedAttrs[attr.name] && (
                            <div className="p-2 space-y-2">
                                <input
                                    type="text"
                                    placeholder={`Search ${attr.name} values`}
                                    value={selectedAttributes[attr.name]?.searchTerm || ""}
                                    onChange={(e) =>
                                        setSelectedAttributes((prev) => ({
                                            ...prev,
                                            [attr.name]: {
                                                ...prev[attr.name],
                                                searchTerm: e.target.value,
                                                values: prev[attr.name]?.values || [],
                                            },
                                        }))
                                    }
                                    className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />

                                {/* Select All / Deselect All */}
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedAttributes[attr.name]?.values?.length ===
                                            attr.values.length
                                        }
                                        onChange={(e) => {
                                            setSelectedAttributes((prev) => ({
                                                ...prev,
                                                [attr.name]: {
                                                    ...prev[attr.name],
                                                    values: e.target.checked ? [...attr.values] : [],
                                                    searchTerm: prev[attr.name]?.searchTerm || "",
                                                },
                                            }));
                                        }}
                                        className="accent-gray-600"
                                    />
                                    <span className="text-sm font-medium">
                                        {selectedAttributes[attr.name]?.values?.length === attr.values.length
                                            ? "Deselect All"
                                            : "Select All"}
                                    </span>
                                </div>

                                {/* Values */}
                                <div className="max-h-32 overflow-auto grid grid-cols-2 gap-2">
                                    {attr.values
                                        .filter((val) =>
                                            val
                                                .toLowerCase()
                                                .includes(
                                                    selectedAttributes[attr.name]?.searchTerm?.toLowerCase() || ""
                                                )
                                        )
                                        .map((val, idx) => (
                                            <label
                                                key={`${val}-${idx}`}
                                                className={`flex items-center gap-2 px-2 py-1 border rounded-lg cursor-pointer transition ${selectedAttributes[attr.name]?.values?.includes(val)
                                                        ? "bg-black text-white border-blue-600"
                                                        : "bg-white text-gray-700 border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        Array.isArray(selectedAttributes[attr.name]?.values) &&
                                                        selectedAttributes[attr.name].values.includes(val)
                                                    }
                                                    onChange={() => toggleAttributeValue(attr.name, val)}
                                                    className="accent-gray-600"
                                                />
                                                <span>{val}</span>
                                            </label>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttributesSection;
