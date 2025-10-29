import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all offers
export const fetchOffers = createAsyncThunk(
    "offers/fetchOffers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/offer");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch offers");
        }
    }
);

// Create new offer
export const createOffer = createAsyncThunk(
    "offers/createOffer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/offer", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create offer");
        }
    }
);

// Update existing offer
export const updateOffer = createAsyncThunk(
    "offers/updateOffer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/offer", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update offer");
        }
    }
);

// Delete offer (soft delete)
export const deleteOffer = createAsyncThunk(
    "offers/deleteOffer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/offer", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete offer");
        }
    }
);

const offersSlice = createSlice({
    name: "offers",
    initialState: {
        offers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch offers
        builder
            .addCase(fetchOffers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOffers.fulfilled, (state, action) => {
                state.loading = false;
                state.offers = action.payload;
            })
            .addCase(fetchOffers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create offer
        builder
            .addCase(createOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.offers.unshift(action.payload); // add new offer
            })
            .addCase(createOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update offer
        builder
            .addCase(updateOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.offers = state.offers.map((offer) =>
                    offer.id === action.payload.id ? action.payload : offer
                );
            })
            .addCase(updateOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete offer
        builder
            .addCase(deleteOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.offers = state.offers.filter(
                    (offer) => offer.id !== action.payload.id
                );
            })
            .addCase(deleteOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default offersSlice.reducer;
