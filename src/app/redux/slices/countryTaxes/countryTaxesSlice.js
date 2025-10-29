import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all country taxes
// export const fetchCountryTaxes = createAsyncThunk(
//     "countryTax/fetchCountryTax",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get("/api/countrytax");
//             return response.data.data; // API returns { message, data }
//         } catch (err) {
//             return rejectWithValue(err.response?.data || "Failed to fetch country taxes");
//         }
//     }
// );

export const fetchAllCountryTaxes = createAsyncThunk(
    "countryTax/fetchAllCountryTaxes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/countrytax/all");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch all country taxes");
        }
    }
);

export const fetchCountryTaxes = createAsyncThunk(
    "countryTax/fetchCountryTax",
    async (countryCode, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/countrytax?country=${countryCode}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch country taxes");
        }
    }
);


// Create new country tax
export const createCountryTax = createAsyncThunk(
    "countryTax/createCountryTax",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/countrytax", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create country tax");
        }
    }
);

// Update existing country tax
export const updateCountryTax = createAsyncThunk(
    "countryTax/updateCountryTax",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/countrytax", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update country tax");
        }
    }
);

// Delete country tax (soft delete)
export const deleteCountryTax = createAsyncThunk(
    "countryTax/deleteCountryTax",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/countrytax", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete country tax");
        }
    }
);

const countryTaxSlice = createSlice({
    name: "countryTax",
    initialState: {
        countryTax: [],
        allCountryTaxes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCountryTaxes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCountryTaxes.fulfilled, (state, action) => {
                state.loading = false;
                state.allCountryTaxes = action.payload;
            })
            .addCase(fetchAllCountryTaxes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Fetch
        builder
            .addCase(fetchCountryTaxes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(fetchCountryTaxes.fulfilled, (state, action) => {
            //     state.loading = false;
            //     // state.countryTax = action.payload;
            //     state.countryTax = [...action.payload];
            // })

            .addCase(fetchCountryTaxes.fulfilled, (state, action) => {
                state.loading = false;
                state.countryTax = Array.isArray(action.payload)
                    ? action.payload
                    : [action.payload]; // handle single or multiple response
            })
            .addCase(fetchCountryTaxes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create
        builder
            .addCase(createCountryTax.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountryTax.fulfilled, (state, action) => {
                state.loading = false;
                state.countryTax.unshift(action.payload);
            })
            .addCase(createCountryTax.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update
        builder
            .addCase(updateCountryTax.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountryTax.fulfilled, (state, action) => {
                state.loading = false;
                state.countryTax = state.countryTax.map((ct) =>
                    ct.id === action.payload.id ? action.payload : ct
                );
            })
            .addCase(updateCountryTax.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete
        builder
            .addCase(deleteCountryTax.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountryTax.fulfilled, (state, action) => {
                state.loading = false;
                state.countryTax = state.countryTax.filter(
                    (ct) => ct.id !== action.payload.id
                );
            })
            .addCase(deleteCountryTax.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default countryTaxSlice.reducer;
