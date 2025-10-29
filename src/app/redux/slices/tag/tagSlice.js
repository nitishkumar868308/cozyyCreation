import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all tags
export const fetchTags = createAsyncThunk(
    "tags/fetchTags",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/tag");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch tags");
        }
    }
);

// Create new tag
export const createTag = createAsyncThunk(
    "tags/createTag",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/tag", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create tag");
        }
    }
);

// Update existing tag
export const updateTag = createAsyncThunk(
    "tags/updateTag",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/tag", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update tag");
        }
    }
);

// Delete tag (soft delete)
export const deleteTag = createAsyncThunk(
    "tags/deleteTag",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/tag", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete tag");
        }
    }
);

const tagsSlice = createSlice({
    name: "tags",
    initialState: {
        tags: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch tags
        builder
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create tag
        builder
            .addCase(createTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags.unshift(action.payload);
            })
            .addCase(createTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update tag
        builder
            .addCase(updateTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = state.tags.map((tag) =>
                    tag.id === action.payload.id ? action.payload : tag
                );
            })
            .addCase(updateTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete tag
        builder
            .addCase(deleteTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = state.tags.filter(
                    (tag) => tag.id !== action.payload.id
                );
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default tagsSlice.reducer;
