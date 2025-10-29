// "use client";
// import React from "react";

// const ProductOffers = ({ product, quantity }) => {
//     const currency = product.currency || ""; // ✅ use currency instead of currencySymbol

//     // Range offer logic
//     const getRangeOfferApplied = (offer) => {
//         if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
//         const { start, end, free } = offer.discountValue || {};
//         if (quantity >= start && quantity <= end) {
//             const payQty = quantity - free;
//             return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
//         }
//         return null;
//     };

//     // ✅ Ensure product.offers is always an array
//     const offers = Array.isArray(product.offers) ? product.offers : [];

//     // Merge normal offers + bulk offer
//     const offersList = [
//         ...offers,
//         product.minQuantity && product.bulkPrice
//             ? {
//                 id: "bulk-offer",
//                 description:
//                     quantity >= product.minQuantity
//                         ? `Bulk price applied: ${currency} ${product.bulkPrice} each`
//                         : `Buy ${product.minQuantity}+ items to get ${currency} ${product.bulkPrice} each`,
//                 type: ["product"],
//                 applied: quantity >= product.minQuantity,
//                 discountType: "bulk",
//             }
//             : null,
//     ].filter(Boolean);

//     // ✅ If no offers at all, hide section
//     if (offersList.length === 0) return null;

//     return (
//         <div className="p-4 rounded-md shadow-sm bg-yellow-100 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
//             {[...new Map(offersList.map((o) => [o.id, o])).values()].map(
//                 (offer, index) => {
//                     const rangeAppliedMsg = getRangeOfferApplied(offer);
//                     return (
//                         <div
//                             key={index}
//                             className="flex flex-col sm:flex-row justify-between sm:items-center"
//                         >
//                             <span className="font-semibold">
//                                 {offer.discountType === "rangeBuyXGetY"
//                                     ? `Buy minimum ${offer.discountValue?.start}, get ${offer.discountValue?.free} free`
//                                     : offer.description}
//                             </span>

//                             {(offer.applied || rangeAppliedMsg) && (
//                                 <span className="text-sm font-medium text-green-700">
//                                     {rangeAppliedMsg || "Applied ✅"}
//                                 </span>
//                             )}
//                         </div>
//                     );
//                 }
//             )}
//         </div>
//     );
// };

// export default ProductOffers;


"use client";
import React from "react";

const ProductOffers = ({ product, quantity, selectedVariation }) => {
    const currency = selectedVariation?.currency || product.currency || "₹";

    // 🟡 Get effective bulk data (variation > product)
    const effectiveMinQty =
        selectedVariation?.minQuantity ?? product.minQuantity ?? null;
    const effectiveBulkPrice =
        selectedVariation?.bulkPrice ?? product.bulkPrice ?? null;

    // 🧮 Range offer logic
    const getRangeOfferApplied = (offer) => {
        if (!offer || offer.discountType !== "rangeBuyXGetY") return null;
        const { start, end, free } = offer.discountValue || {};
        if (quantity >= start && quantity <= end) {
            const payQty = quantity - free;
            return `Offer applied: Pay ${payQty}, get ${free} free ✅`;
        }
        return null;
    };

    // ✅ Normalize offers array
    const offers = Array.isArray(product.offers) ? product.offers : [];

    // 🧩 Merge normal offers + effective bulk offer (if available)
    const offersList = [
        ...offers,
        effectiveMinQty && effectiveBulkPrice
            ? {
                id: "bulk-offer",
                description:
                    quantity >= effectiveMinQty
                        ? `Bulk price applied: ${currency} ${effectiveBulkPrice} each`
                        : `Buy ${effectiveMinQty}+ items to get ${currency} ${effectiveBulkPrice} each`,
                type: ["product"],
                applied: quantity >= effectiveMinQty,
                discountType: "bulk",
            }
            : null,
    ].filter(Boolean);

    if (offersList.length === 0) return null;

    return (
        <div className="p-4 rounded-md shadow-sm bg-yellow-100 border-l-4 border-yellow-500 flex flex-col gap-2 mb-6">
            {[...new Map(offersList.map((o) => [o.id, o])).values()].map(
                (offer, index) => {
                    const rangeAppliedMsg = getRangeOfferApplied(offer);
                    return (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row justify-between sm:items-center"
                        >
                            <span className="font-semibold">
                                {offer.discountType === "rangeBuyXGetY"
                                    ? `Buy minimum ${offer.discountValue?.start}, get ${offer.discountValue?.free} free`
                                    : offer.description}
                            </span>

                            {(offer.applied || rangeAppliedMsg) && (
                                <span className="text-sm font-medium text-green-700">
                                    {rangeAppliedMsg || "Applied ✅"}
                                </span>
                            )}
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default ProductOffers;
