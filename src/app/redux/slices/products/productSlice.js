import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// // Fetch all products
// export const fetchProducts = createAsyncThunk(
//     "products/fetchProducts",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get("/api/products");
//             return response.data.data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || "Failed to fetch products");
//         }
//     }
// );

export const fetchFastProducts = createAsyncThunk(
    "products/fetchFastProducts",
    async ({ page = 1, limit = 50 } = {}, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const countryCode = state.country || "IN";
            const response = await axios.get(`/api/products/fast?page=${page}&limit=${limit}`, {
                headers: { "x-country": countryCode },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch fast products");
        }
    }
);

// Fetch all products (no country pricing)
export const fetchAllProducts = createAsyncThunk(
    "products/fetchAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/products/all"); // your new endpoint
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch all products");
        }
    }
);


// Fetch all products
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { getState, rejectWithValue }) => { // use getState
        try {
            const state = getState();
            const countryCode = state.country || "IN"; // read from Redux
            const response = await axios.get("/api/products", {
                headers: { "x-country": countryCode },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch products");
        }
    }
);

// Create new product
export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/products", payload);
            // ✅ Return both message and data
            return {
                message: response.data.message || "Product created successfully",
                data: response.data.data,
            };
        } catch (err) {
            // ✅ Return backend message if available
            const errorMsg = err.response?.data?.message || "Failed to create product";
            return rejectWithValue({ message: errorMsg });
        }
    }
);


// Delete product (soft delete)
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/products", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete product");
        }
    }
);

// Update existing product
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/products", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update product");
        }
    }
);

export const updateProducttoggle = createAsyncThunk(
    "products/updateProducttoggle",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.patch("/api/products", payload);
            console.log("response", response)
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update product");
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        fastProducts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFastProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFastProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.fastProducts = action.payload;
            })
            .addCase(fetchFastProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload; // replace current products with all products
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Fetch products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Add Products
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.unshift(action.payload.data);  // add newly created product to the list
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete product
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(
                    (prod) => prod.id !== action.payload.id
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update product
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.map((prod) =>
                    prod.id === action.payload.id ? action.payload : prod
                );
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
        builder
            .addCase(updateProducttoggle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProducttoggle.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.id) {
                    state.products = state.products.map((prod) =>
                        prod.id === action.payload.id ? action.payload : prod
                    );
                } else {
                    console.warn("updateProducttoggle: payload undefined", action.payload);
                }
            })
            .addCase(updateProducttoggle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export default productsSlice.reducer;
