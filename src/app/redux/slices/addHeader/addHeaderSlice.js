import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all headers
export const fetchHeaders = createAsyncThunk(
    "headers/fetchHeaders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/headers");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch headers");
        }
    }
);

// Create new header
export const createHeader = createAsyncThunk(
    "headers/createHeader",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/headers", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create header");
        }
    }
);

// Update existing header
export const updateHeader = createAsyncThunk(
    "headers/updateHeader",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/headers", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update header");
        }
    }
);

// Delete header (soft delete)
export const deleteHeader = createAsyncThunk(
    "headers/deleteHeader",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/headers", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete header");
        }
    }
);

const headersSlice = createSlice({
    name: "headers",
    initialState: {
        headers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch headers
        builder
            .addCase(fetchHeaders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHeaders.fulfilled, (state, action) => {
                state.loading = false;
                state.headers = action.payload;
            })
            .addCase(fetchHeaders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create header
        builder
            .addCase(createHeader.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHeader.fulfilled, (state, action) => {
                state.loading = false;
                state.headers.unshift(action.payload); // add new header to list
            })
            .addCase(createHeader.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update header
        builder
            .addCase(updateHeader.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHeader.fulfilled, (state, action) => {
                state.loading = false;
                state.headers = state.headers.map((header) =>
                    header.id === action.payload.id ? action.payload : header
                );
            })
            .addCase(updateHeader.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete header
        builder
            .addCase(deleteHeader.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHeader.fulfilled, (state, action) => {
                state.loading = false;
                state.headers = state.headers.filter(
                    (header) => header.id !== action.payload.id
                );
            })
            .addCase(deleteHeader.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default headersSlice.reducer;
