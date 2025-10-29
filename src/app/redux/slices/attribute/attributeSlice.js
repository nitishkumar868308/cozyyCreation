import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all attributes
export const fetchAttributes = createAsyncThunk(
    "attributes/fetchAttributes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/attribute");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch attributes");
        }
    }
);

// Create new attribute
export const createAttribute = createAsyncThunk(
    "attributes/createAttribute",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/attribute", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create attribute");
        }
    }
);

// Update existing attribute
export const updateAttribute = createAsyncThunk(
    "attributes/updateAttribute",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/attribute", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update attribute");
        }
    }
);

// Delete attribute (soft delete)
export const deleteAttribute = createAsyncThunk(
    "attributes/deleteAttribute",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/attribute", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete attribute");
        }
    }
);

const attributesSlice = createSlice({
    name: "attributes",
    initialState: {
        attributes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch attributes
        builder
            .addCase(fetchAttributes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttributes.fulfilled, (state, action) => {
                state.loading = false;
                state.attributes = action.payload;
            })
            .addCase(fetchAttributes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create attribute
        builder
            .addCase(createAttribute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAttribute.fulfilled, (state, action) => {
                state.loading = false;
                state.attributes.unshift(action.payload);
            })
            .addCase(createAttribute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update attribute
        builder
            .addCase(updateAttribute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAttribute.fulfilled, (state, action) => {
                state.loading = false;
                state.attributes = state.attributes.map((attr) =>
                    attr.id === action.payload.id ? action.payload : attr
                );
            })
            .addCase(updateAttribute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete attribute
        builder
            .addCase(deleteAttribute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAttribute.fulfilled, (state, action) => {
                state.loading = false;
                state.attributes = state.attributes.filter(
                    (attr) => attr.id !== action.payload.id
                );
            })
            .addCase(deleteAttribute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default attributesSlice.reducer;
