import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all market links
export const fetchMarketLinks = createAsyncThunk(
    "marketLinks/fetchMarketLinks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/marketlinks");
            console.log("response", response)
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch market links");
        }
    }
);

// Create new market link
export const createMarketLink = createAsyncThunk(
    "marketLinks/createMarketLink",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/marketlinks", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create market link");
        }
    }
);

// Update existing market link
export const updateMarketLink = createAsyncThunk(
    "marketLinks/updateMarketLink",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/marketlinks", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update market link");
        }
    }
);

// Delete market link (soft delete)
export const deleteMarketLink = createAsyncThunk(
    "marketLinks/deleteMarketLink",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/marketlinks", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete market link");
        }
    }
);

const marketLinksSlice = createSlice({
    name: "marketLinks",
    initialState: {
        links: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch links
        builder
            .addCase(fetchMarketLinks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarketLinks.fulfilled, (state, action) => {
                state.loading = false;
                state.links = action.payload;
            })
            .addCase(fetchMarketLinks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create link
        builder
            .addCase(createMarketLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMarketLink.fulfilled, (state, action) => {
                state.loading = false;
                state.links.unshift(action.payload);
            })
            .addCase(createMarketLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update link
        builder
            .addCase(updateMarketLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMarketLink.fulfilled, (state, action) => {
                state.loading = false;
                state.links = state.links.map((link) =>
                    link.id === action.payload.id ? action.payload : link
                );
            })
            .addCase(updateMarketLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete link
        builder
            .addCase(deleteMarketLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMarketLink.fulfilled, (state, action) => {
                state.loading = false;
                state.links = state.links.filter((link) => link.id !== action.payload.id);
            })
            .addCase(deleteMarketLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export default marketLinksSlice.reducer;
