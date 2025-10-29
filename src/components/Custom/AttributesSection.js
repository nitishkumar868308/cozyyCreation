import React, { useState, useEffect } from "react";
const AttributesSection = ({
    attributes,
    selectedAttributes,
    setSelectedAttributes,
    variationDetails,
    setVariationDetails,
    setCurrentVariations,
    baseProduct
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedAttrs, setExpandedAttrs] = useState({});

    // ✅ Values toggle
    const toggleAttributeValue = (attrName, value) => {
        setSelectedAttributes((prev) => {
            const prevValues = prev[attrName]?.values || [];
            const newValues = prevValues.includes(value)
                ? prevValues.filter((v) => v !== value)
                : [...prevValues, value];

            return {
                ...prev,
                [attrName]: {
                    ...prev[attrName],
                    values: newValues,
                    searchTerm: prev[attrName]?.searchTerm || "",
                },
            };
        });
    };

    // ✅ Variations generate (cartesian product)
    useEffect(() => {
        const attrValues = Object.values(selectedAttributes)
            .filter(a => a.values?.length)
            .map(a => a.values);

        if (attrValues.length === 0) {
            setCurrentVariations([]);
            return;
        }

        const cartesian = (arr) =>
            arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

        const combinations = cartesian(attrValues);
        const attrNames = Object.keys(selectedAttributes);

        const newVariationDetails = {};
        const variationsWithKeys = combinations.map((comb) => {
            const variationObj = comb.reduce((acc, val, idx) => {
                acc[attrNames[idx]] = val;
                return acc;
            }, {});

            const variationKey = JSON.stringify(variationObj);

            newVariationDetails[variationKey] = {
                ...(variationDetails[variationKey] || {}),
                price: variationDetails[variationKey]?.price || baseProduct.price,
                stock: variationDetails[variationKey]?.stock || baseProduct.stock,
                image: variationDetails[variationKey]?.image || baseProduct.image?.[0] || null,
                name: variationDetails[variationKey]?.name || baseProduct.name,
                description: variationDetails[variationKey]?.description || baseProduct.description,
                otherCountriesPrice: variationDetails[variationKey]?.otherCountriesPrice || baseProduct.otherCountriesPrice,
                sku: variationDetails[variationKey]?.sku || generateSKU(baseProduct.name, Object.values(variationObj).filter(Boolean).join(" / ")),
            };

            return variationObj;
        });

        setVariationDetails(newVariationDetails);
        setCurrentVariations(variationsWithKeys);
    }, [selectedAttributes]);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Attributes</h3>

            {/* Search */}
            <input
                type="text"
                placeholder={`Search ${attr.name} values`}
                value={selectedAttributes[attr.name]?.searchTerm ?? ""}
                onChange={(e) =>
                    setSelectedAttributes((prev) => ({
                        ...prev,
                        [attr.name]: {
                            ...prev[attr.name],
                            searchTerm: e.target.value,
                        },
                    }))
                }
            />


            <div className="space-y-2 max-h-[500px] overflow-auto">
                {attributes
                    .filter((attr) =>
                        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((attr) => (
                        <div key={attr.id} className="border rounded-lg shadow-sm">
                            {/* Header */}
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

                            {/* Values */}
                            {expandedAttrs[attr.name] && (
                                <div className="p-2 space-y-2">
                                    {/* ✅ Search values */}
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
                                                },
                                            }))
                                        }
                                        className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {/* ✅ Select All */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedAttributes[attr.name]?.values?.length === attr.values.length
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

                                    {/* Values grid */}
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
                                                        checked={selectedAttributes[attr.name]?.values?.includes(val)}
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

export default AttributesSection