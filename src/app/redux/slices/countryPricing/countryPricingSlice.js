import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all country pricings
export const fetchCountryPricing = createAsyncThunk(
    "countryPricing/fetchCountryPricing",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/countrypricing");
            console.log("response" , response)
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch country pricing");
        }
    }
);

// Create new country pricing
export const createCountryPricing = createAsyncThunk(
    "countryPricing/createCountryPricing",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/countrypricing", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create country pricing");
        }
    }
);

// Update existing country pricing
export const updateCountryPricing = createAsyncThunk(
    "countryPricing/updateCountryPricing",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/countrypricing", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update country pricing");
        }
    }
);

// Delete country pricing (soft delete)
export const deleteCountryPricing = createAsyncThunk(
    "countryPricing/deleteCountryPricing",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/countrypricing", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete country pricing");
        }
    }
);

const countryPricingSlice = createSlice({
    name: "countryPricing",
    initialState: {
        countryPricing: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchCountryPricing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountryPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.countryPricing = action.payload;
            })
            .addCase(fetchCountryPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create
        builder
            .addCase(createCountryPricing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountryPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.countryPricing.unshift(action.payload);
            })
            .addCase(createCountryPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update
        builder
            .addCase(updateCountryPricing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountryPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.countryPricing = state.countryPricing.map((cp) =>
                    cp.id === action.payload.id ? action.payload : cp
                );
            })
            .addCase(updateCountryPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete
        builder
            .addCase(deleteCountryPricing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountryPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.countryPricing = state.countryPricing.filter(
                    (cp) => cp.id !== action.payload.id
                );
            })
            .addCase(deleteCountryPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default countryPricingSlice.reducer;
