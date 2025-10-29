import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
    "address/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/address");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch addresses");
        }
    }
);

// Create new address
export const createAddress = createAsyncThunk(
    "address/createAddress",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/address", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create address");
        }
    }
);

// Update existing address
export const updateAddress = createAsyncThunk(
    "address/updateAddress",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/address", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update address");
        }
    }
);

// Delete address (soft delete)
export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/address", { data: { id } });
            console.log("response", response)
            return { id, message: response.data.message };
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete address");
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch addresses
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create address
        builder
            .addCase(createAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.unshift(action.payload); // add new address to list
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update address
        builder
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.map((addr) =>
                    addr.id === action.payload.id ? action.payload : addr
                );
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete address
        builder
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(
                    (addr) => addr.id !== action.payload.id
                );
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default addressSlice.reducer;
