

// export function convertProducts(products, countryCode, countryPricingList) {
//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(Number(p.price), countryCode, countryPricingList);

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
//                     convertPrice(Number(v.price), countryCode, countryPricingList);

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//         };
//     });
// }

// export function convertProducts(products, countryCode, countryPricingList) {
//     // Normalize 3-letter to 2-letter
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(
//             Number(p.price),
//             countryCode,
//             countryPricingList
//         );

//         // ✅ matched link by normalized country
//         const matchedMarketLink =
//             p.marketLinks?.find(
//                 (link) =>
//                     link.countryCode?.toUpperCase() === normalizedCountryCode
//             ) || null;

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const {
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 } = convertPrice(Number(v.price), countryCode, countryPricingList);

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//             matchedMarketLink, // attach matched link
//             marketLinks: undefined, // hide full list if not needed
//         };
//     });
// }

// export function convertPrice(basePrice, countryCode, countryPricingList) {
//     const country = countryPricingList.find(c => c.code === countryCode)
//         || countryPricingList.find(c => c.code === "IN");

//     const multiplier = country?.multiplier || 1;
//     const currency = country?.currency || "INR";
//     const currencySymbol = country?.currencySymbol || "₹";

//     return {
//         price: Math.round(basePrice * multiplier),
//         currency,
//         currencySymbol,
//     };
// }

// export function convertProducts(products, countryCode, countryPricingList) {
//     // Normalize 3-letter to 2-letter
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(
//             Number(p.price),
//             countryCode,
//             countryPricingList
//         );

//         // ✅ matched link by normalized country if exists
//         const matchedMarketLink = p.marketLinks?.find(
//             (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
//         ) || null;

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const {
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 } = convertPrice(Number(v.price), countryCode, countryPricingList);

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//             matchedMarketLink,       // only the matched country link
//             marketLinks: p.marketLinks || [], // keep full list for frontend usage
//         };
//     });
// }
export function convertPrice(basePriceINR: number, targetCountryCode: string, countryPricingList: any[]) {
    // Base country fallback
    const baseCountry = countryPricingList.find(c => c.code === "IN") || {
        code: "IN",
        currency: "INR",
        currencySymbol: "₹",
        multiplier: 1,
        conversionRate: 1
    };

    const targetCountry = countryPricingList.find(c => c.code === targetCountryCode) || baseCountry;

    const conversionRate = targetCountry.conversionRate ?? 1; // step 1: convert to target currency
    const multiplier = targetCountry.multiplier ?? 1;          // step 2: apply multiplier

    const priceAfterConversion = Number(basePriceINR) * conversionRate; // INR → target currency
    const finalPrice = priceAfterConversion * multiplier;               // apply multiplier

    // const roundedPrice = Math.round(finalPrice * 2) / 2;
    const roundedPrice = Math.round(finalPrice); // 3.552 → 4

    return {
        // price: Math.round(finalPrice * 100) / 100,
        price: roundedPrice,
        currency: targetCountry.currency || "INR",
        currencySymbol: targetCountry.currencySymbol || "₹",
    };
}


export function convertProducts(products: any[], countryCode: string, countryPricingList: any[]) {
    const normalizedCountryCode =
        countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

    return (products || []).map((p) => {
        const basePrice = Number(p.price) || 0;
        const { price, currency, currencySymbol } = convertPrice(basePrice, countryCode, countryPricingList);

        const matchedMarketLink =
            p.marketLinks?.find(link => link.countryCode?.toUpperCase() === normalizedCountryCode) || null;

        const variations = (p.variations || []).map((v) => {
            const varPrice = Number(v.price) || 0;
            const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
                convertPrice(varPrice, countryCode, countryPricingList);

            return {
                ...v,
                price: vPrice,
                currency: vCurrency,
                currencySymbol: vSymbol,
            };
        });

        return {
            ...p,
            price,
            currency,
            currencySymbol,
            variations,
            matchedMarketLink,
            marketLinks: p.marketLinks || [],
        };
    });
}


let conversionRatesCache = null;

export function convertProductsFast(products, countryCode, countryPricingList) {
    const normalizedCountryCode = (countryCode.length === 3 ? countryCode.slice(0, 2) : countryCode).toUpperCase();

    // Map country code to countryPricing
    const countryPricingMap: Record<string, any> = {};
    countryPricingList.forEach(c => countryPricingMap[c.code.toUpperCase()] = c);

    // Map currency to conversion rates
    const conversionRatesMap: Record<string, any> = {};
    conversionRatesCache?.forEach(c => conversionRatesMap[c.currency] = c);

    const targetCountry = countryPricingMap[normalizedCountryCode] || countryPricingMap["IN"] || { multiplier: 1, currency: "INR", currencySymbol: "₹", conversionRate: 1 };
    const matchedCountry = conversionRatesMap[targetCountry.currency] || { conversionRate: 1, currency: targetCountry.currency, currencySymbol: targetCountry.currencySymbol };

    const conversionRate = matchedCountry.conversionRate ?? 1;
    const multiplier = targetCountry.multiplier ?? 1;
    const finalMultiplier = conversionRate * multiplier;

    return products.map(p => {
        const rawPrice = (Number(p.price) || 0) * finalMultiplier;
        const price = Math.round(rawPrice * 2) / 2; // nearest 0.5

        const variations = (p.variations || []).map(v => {
            const rawVarPrice = (Number(v.price) || 0) * finalMultiplier;
            const vPrice = Math.round(rawVarPrice * 2) / 2; // nearest 0.5

            return {
                ...v,
                price: vPrice,
                currency: matchedCountry.currency,
                currencySymbol: matchedCountry.currencySymbol
            };
        });

        const matchedMarketLink = p.marketLinks?.find(link => link.countryCode?.toUpperCase() === normalizedCountryCode) || null;

        return {
            ...p,
            price,
            currency: matchedCountry.currency,
            currencySymbol: matchedCountry.currencySymbol,
            variations,
            matchedMarketLink,
            marketLinks: p.marketLinks || [],
        };
    });
}






// export async function convertPrice(basePriceINR, targetCountryCode, countryPricingList) {
//     const countryPricingListRates = await fetchConversionRates();
//     const baseCountry = countryPricingList.find(c => c.code === "IN");
//     const targetCountry = countryPricingList.find(c => c.code === targetCountryCode) || baseCountry;

//     const matchedCountry = countryPricingListRates.find(
//         (c) => c.currency === targetCountry.currency
//     ) || { conversionRate: 1 };
//     console.log("matchedCountry", matchedCountry)
//     const conversionRate = matchedCountry?.conversionRate || 1;
//     console.log("conversionRate", conversionRate)
//     const multiplier = targetCountry?.multiplier || 1;

//     const priceInTargetCurrency = basePriceINR * conversionRate;
//     const finalPrice = priceInTargetCurrency * multiplier;

//     return {
//         price: Math.round(finalPrice * 100) / 100,
//         currency: targetCountry?.currency || "INR",
//         currencySymbol: targetCountry?.currencySymbol || "₹",
//     };
// }

// export async function convertProducts(products, countryCode, countryPricingList) {
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     const convertedProducts = await Promise.all(
//         products.map(async (p) => {
//             const basePrice = Number(p.price) || 0; // ensure numeric
//             const { price, currency, currencySymbol } = await convertPrice(
//                 basePrice,
//                 countryCode,
//                 countryPricingList
//             );

//             const matchedMarketLink =
//                 p.marketLinks?.find(link => link.countryCode?.toUpperCase() === normalizedCountryCode) || null;

//             const variations = await Promise.all(
//                 (p.variations || []).map(async (v) => {
//                     const varPrice = Number(v.price) || 0; // ensure numeric
//                     const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
//                         await convertPrice(varPrice, countryCode, countryPricingList);

//                     return {
//                         ...v,
//                         price: vPrice,
//                         currency: vCurrency,
//                         currencySymbol: vSymbol,
//                     };
//                 })
//             );

//             return {
//                 ...p,
//                 price,
//                 currency,
//                 currencySymbol,
//                 variations,
//                 matchedMarketLink,
//                 marketLinks: p.marketLinks || [],
//             };
//         })
//     );

//     return convertedProducts;
// }


// export async function convertProducts(products, countryCode, countryPricingList) {
//     console.log("productsbackend", products);

//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     // Map products asynchronously
//     const convertedProducts = await Promise.all(
//         products.map(async (p) => {
//             const { price, currency, currencySymbol } = await convertPrice(
//                 Number(p.price),
//                 countryCode,
//                 countryPricingList
//             );

//             const matchedMarketLink =
//                 p.marketLinks?.find(
//                     (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
//                 ) || null;

//             const variations = await Promise.all(
//                 (p.variations || []).map(async (v) => {
//                     const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } =
//                         await convertPrice(Number(v.price), countryCode, countryPricingList);

//                     return {
//                         ...v,
//                         price: vPrice,
//                         currency: vCurrency,
//                         currencySymbol: vSymbol,
//                     };
//                 })
//             );

//             return {
//                 ...p,
//                 price,
//                 currency,
//                 currencySymbol,
//                 variations,
//                 matchedMarketLink,
//                 marketLinks: p.marketLinks || [],
//             };
//         })
//     );

//     return convertedProducts;
// }

// export function convertProducts(products, countryCode, countryPricingList) {
//     console.log("productsbackend", products)
//     const normalizedCountryCode =
//         countryCode.length === 3 ? countryCode.slice(0, 2).toUpperCase() : countryCode.toUpperCase();

//     return products.map((p) => {
//         const { price, currency, currencySymbol } = convertPrice(
//             Number(p.price),
//             countryCode,
//             countryPricingList
//         );

//         const matchedMarketLink = p.marketLinks?.find(
//             (link) => link.countryCode?.toUpperCase() === normalizedCountryCode
//         ) || null;

//         return {
//             ...p,
//             price,
//             currency,
//             currencySymbol,
//             variations: p.variations?.map((v) => {
//                 const { price: vPrice, currency: vCurrency, currencySymbol: vSymbol } = convertPrice(
//                     Number(v.price),
//                     countryCode,
//                     countryPricingList
//                 );

//                 return {
//                     ...v,
//                     price: vPrice,
//                     currency: vCurrency,
//                     currencySymbol: vSymbol,
//                 };
//             }),
//             matchedMarketLink,
//             marketLinks: p.marketLinks || [],
//         };
//     });
// }

