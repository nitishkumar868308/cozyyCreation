// import { useState, useRef, useEffect } from "react";

// const MultiSelectDropdown = ({ offers, currentData, setCurrentData }) => {
//     const [open, setOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Use currentData.offers consistently
//     const toggleOffer = (id) => {
//         const selected = currentData.offers || [];
//         if (selected.includes(id)) {
//             setCurrentData({ ...currentData, offers: selected.filter((o) => o !== id) });
//         } else {
//             setCurrentData({ ...currentData, offers: [...selected, id] });
//         }
//     };

//     const selectedNames = (currentData.offers || [])
//         .map((id) => offers.find((o) => o.id === id)?.name)
//         .filter(Boolean)
//         .join(", ");

//     return (
//         <div className="relative" ref={dropdownRef}>
//             <label className="block mb-1 font-medium">Offers</label>
//             <div
//                 className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer"
//                 onClick={() => setOpen(!open)}
//             >
//                 {selectedNames || "Select Offers"}
//             </div>

//             {open && (
//                 <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">
//                     {offers
//                         .filter((offer) => offer.type.includes("product"))
//                         .map((offer) => (
//                             <label
//                                 key={offer.id}
//                                 className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                             >
//                                 <input
//                                     type="checkbox"
//                                     checked={(currentData.offers || []).includes(offer.id)}
//                                     onChange={() => toggleOffer(offer.id)}
//                                     className="mr-2"
//                                 />
//                                 {offer.name}
//                             </label>
//                         ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MultiSelectDropdown;


// import { useState, useRef, useEffect } from "react";

// const MultiSelectDropdown = ({ offers, currentData, setCurrentData }) => {
//     const [open, setOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     // Close dropdown on outside click
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Convert objects to IDs on mount
//     useEffect(() => {
//         if (currentData.offers && currentData.offers.length > 0) {
//             // Convert to ID array only if objects exist
//             if (typeof currentData.offers[0] === "object") {
//                 setCurrentData(prev => ({
//                     ...prev,
//                     offers: currentData.offers.map(o => o.id),
//                 }));
//             }
//         } else if (!currentData.offers) {
//             setCurrentData(prev => ({ ...prev, offers: [] }));
//         }
//     }, [currentData.offers]); // 👈 Add dependency here


//     const toggleOffer = (id) => {
//         const selected = currentData.offers || [];
//         if (selected.includes(id)) {
//             setCurrentData({ ...currentData, offers: selected.filter(o => o !== id) });
//         } else {
//             setCurrentData({ ...currentData, offers: [...selected, id] });
//         }
//     };

//     // ✅ Handle both objects and IDs
//     const selectedNames = (currentData.offers || [])
//         .map(o => {
//             if (typeof o === "object") return o.name;
//             return offers.find(x => x.id === o)?.name;
//         })
//         .filter(Boolean)
//         .join(", ");

//     return (
//         <div className="relative" ref={dropdownRef}>
//             <label className="block mb-1 font-medium">Offers</label>
//             <div
//                 className="w-full border border-gray-300 rounded-2xl px-4 py-3 cursor-pointer"
//                 onClick={() => setOpen(!open)}
//             >
//                 {selectedNames || "Select Offers"}
//             </div>

//             {open && (
//                 <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">
//                     {offers
//                         .filter(o => o.type.includes("product"))
//                         .map(o => (
//                             <label key={o.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={(currentData.offers || []).some(x => (typeof x === "object" ? x.id === o.id : x === o.id))}
//                                     onChange={() => toggleOffer(o.id)}
//                                     className="mr-2"
//                                 />
//                                 {o.name}
//                             </label>
//                         ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MultiSelectDropdown;


import { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ offers, currentData, setCurrentData }) => {
    const [open, setOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const dropdownRef = useRef(null);

    // ✅ Initialize from currentData when editing
    useEffect(() => {
        if (currentData?.offers?.length > 0) {
            const ids = currentData.offers.map((o) =>
                typeof o === "object" ? o.id : Number(o)
            );
            setSelectedIds(ids);
        } else {
            setSelectedIds([]);
        }
    }, [currentData.offers]);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Toggle offer selection
    const toggleOffer = (id) => {
        id = Number(id);
        let updated;

        if (selectedIds.includes(id)) {
            updated = selectedIds.filter((o) => o !== id);
        } else {
            updated = [...selectedIds, id];
        }

        setSelectedIds(updated);

        const selectedObjects = updated.map((id) => {
            const offerObj = offers.find((x) => Number(x.id) === id);
            return offerObj ? { id: offerObj.id, name: offerObj.name } : null;
        }).filter(Boolean);

        setCurrentData((prev) => ({
            ...prev,
            offers: selectedObjects,
            primaryOffer: selectedObjects.length ? selectedObjects[0] : null,
        }));
    };


    // ✅ Show selected offer names
    const selectedNames = selectedIds
        .map((id) => offers.find((o) => o.id === id)?.name)
        .filter(Boolean)
        .join(", ");

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block mb-1 font-medium">Offers</label>
            <div
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                {selectedNames || "Select Offers"}
            </div>

            {open && (
                <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">
                    {offers
                        .filter((o) => o.type?.includes("product"))
                        .map((o) => (
                            <label
                                key={o.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(o.id)}
                                    onChange={() => toggleOffer(o.id)}
                                    className="mr-2"
                                />
                                {o.name}
                            </label>
                        ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
