"use client";
import { useState, useEffect } from "react";

export const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=cca3,name,idd,cca2,currencies"
                );
                const data = await res.json();
                console.log("data", data)
                if (!Array.isArray(data)) {
                    console.error("Expected an array but got:", data);
                    setError("Invalid data format");
                    return;
                }

                const formatted = data.map((c) => {
                    const currencyKey = c.currencies ? Object.keys(c.currencies)[0] : null;
                    const currencySymbol =
                        c.currencies && currencyKey && c.currencies[currencyKey]?.symbol
                            ? c.currencies[currencyKey].symbol
                            : "";

                    return {
                        code: c.cca3,
                        name: c.name?.common || "",
                        currency: currencyKey || "",
                        phoneCode:
                            c.idd?.root && c.idd?.suffixes
                                ? `${c.idd.root}${c.idd.suffixes[0]}`
                                : "",
                        currencySymbol,
                    };
                });

                setCountries(formatted);
                setFilteredCountries(formatted);
            } catch (err) {
                console.error("Failed to fetch countries:", err);
                setError(err.message || "Failed to fetch countries");
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, filteredCountries, setFilteredCountries, loading, error };
};

export const getStates = async (country) => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
    });
    const data = await res.json();
    return data.data?.states?.map((s) => s.name) || [];
};

export const getCities = async (country, state) => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
    });
    const data = await res.json();
    return data.data || [];
};

export const fetchPincodeData = async (pincode, setFieldValue) => {
    if (pincode.length !== 6) return false; // ignore invalid lengths

    try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();

        if (data[0].Status === "Success" && data[0].PostOffice?.length) {
            const postOffice = data[0].PostOffice[0];
            setFieldValue("city", postOffice.District || "");
            setFieldValue("state", postOffice.State || "");
            setFieldValue("country", postOffice.Country || "");
            return true; // ✅ valid pincode
        } else {
            // ❌ Invalid pincode — clear all fields
            setFieldValue("city", "");
            setFieldValue("state", "");
            setFieldValue("country", "");
            return false;
        }
    } catch (err) {
        // ❌ API error — also clear all
        setFieldValue("city", "");
        setFieldValue("state", "");
        setFieldValue("country", "");
        return false;
    }
};



// export const validatePincode = async (countryCode, pincode, state, city) => {
//     try {
//         const res = await fetch(
//             `http://api.geonames.org/postalCodeSearchJSON?postalcode=${pincode}&country=${countryCode}&maxRows=10&username=demo`
//         );
//         const data = await res.json();

//         if (!data.postalCodes || data.postalCodes.length === 0) return false;

//         // Check state and city match
//         return data.postalCodes.some(
//             (item) =>
//                 (!state || item.adminName1.toLowerCase() === state.toLowerCase()) &&
//                 (!city || item.placeName.toLowerCase() === city.toLowerCase())
//         );
//     } catch (err) {
//         console.error("Failed to validate pincode:", err);
//         return false;
//     }
// };
