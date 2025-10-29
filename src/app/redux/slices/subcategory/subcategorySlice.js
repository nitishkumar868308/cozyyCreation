import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all subcategories
export const fetchSubcategories = createAsyncThunk(
    "subcategories/fetchSubcategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/subcategory");
            console.log("response" , response)
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch subcategories");
        }
    }
);

// Create new subcategory
export const createSubcategory = createAsyncThunk(
    "subcategories/createSubcategory",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/subcategory", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create subcategory");
        }
    }
);

// Update existing subcategory
export const updateSubcategory = createAsyncThunk(
    "subcategories/updateSubcategory",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/subcategory", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update subcategory");
        }
    }
);

// Delete subcategory (soft delete)
export const deleteSubcategory = createAsyncThunk(
    "subcategories/deleteSubcategory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/subcategory", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete subcategory");
        }
    }
);

const subcategoriesSlice = createSlice({
    name: "subcategories",
    initialState: {
        subcategories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch subcategories
        builder
            .addCase(fetchSubcategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create subcategory
        builder
            .addCase(createSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories.unshift(action.payload);
            })
            .addCase(createSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update subcategory
        builder
            .addCase(updateSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = state.subcategories.map((subcat) =>
                    subcat.id === action.payload.id ? action.payload : subcat
                );
            })
            .addCase(updateSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete subcategory
        builder
            .addCase(deleteSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = state.subcategories.filter(
                    (subcat) => subcat.id !== action.payload.id
                );
            })
            .addCase(deleteSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default subcategoriesSlice.reducer;
