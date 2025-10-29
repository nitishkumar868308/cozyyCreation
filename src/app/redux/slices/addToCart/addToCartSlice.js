// redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch cart items
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/addToCart");
            console.log("response", response)
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch cart items");
        }
    }
);

// Add new item to cart
export const addToCartAsync = createAsyncThunk(
    "cart/addToCart",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/addToCart", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to add to cart");
        }
    }
);

// Update cart item (quantity, attributes, etc.)
export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/addToCart", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update cart");
        }
    }
);

// Delete cart item
export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/addToCart", { data: { id } });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete cart item");
        }
    }
);

// Delete All data
export const clearCartAsync = createAsyncThunk(
    "cart/clearCart",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/addToCart", {
                data: { clearAll: true, userId },
            });
            return response.data.message;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to clear cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        updateLocalCartItem: (state, action) => {
            const { id, newQuantity } = action.payload;
            state.items = state.items.map((item) =>
                item.id === id
                    ? { ...item, quantity: newQuantity, totalPrice: item.pricePerItem * newQuantity }
                    : item
            );
        },
    },
    extraReducers: (builder) => {
        // Fetch cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Add to cart
        builder
            .addCase(addToCartAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload); // add new item at start
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update cart
        builder
            .addCase(updateCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete cart item
        builder
            .addCase(deleteCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        builder
            .addCase(clearCartAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
            })
            .addCase(clearCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export const { updateLocalCartItem } = cartSlice.actions;
export default cartSlice.reducer;
