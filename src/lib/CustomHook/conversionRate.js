// lib/fetchConversionRates.js
export async function fetchConversionRates(baseCurrency = "INR") {
    // Fetch currencies
    const resCurrencies = await fetch("https://api.frankfurter.app/currencies");
    const currencies = await resCurrencies.json();

    // Fetch rates
    const resRates = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
    const ratesData = await resRates.json();

    // Merge data
    return Object.entries(currencies)
        .map(([currencyCode, currencyName]) => {
            const conversionRate =
                ratesData.rates[currencyCode] || (currencyCode === baseCurrency ? 1 : null);

            return {
                code: currencyCode.toUpperCase(),
                currency: currencyCode,
                currencySymbol: getSymbol(currencyCode),
                conversionRate,
                multiplier: 1,
                name: currencyName,
            };
        })
        .filter(i => i.conversionRate !== null);
}

// Helper
function getSymbol(currencyCode) {
    try {
        return (0)
            .toLocaleString("en", {
                style: "currency",
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
            .replace(/\d/g, "")
            .trim();
    } catch {
        return currencyCode;
    }
}