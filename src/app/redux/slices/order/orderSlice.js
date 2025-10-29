// // redux/slices/orderSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Create order and get Cashfree payment token
// export const createOrder = createAsyncThunk(
//     "order/createOrder",
//     async (orderData, { rejectWithValue }) => {
//         try {
//             const res = await axios.post("/api/orders", orderData); // Your backend API
//             return res.data; // Should return { orderId, cashfreeToken, amount, currency, ... }
//         } catch (err) {
//             return rejectWithValue(err.response?.data || "Failed to create order");
//         }
//     }
// );

// const orderSlice = createSlice({
//     name: "order",
//     initialState: { order: null, loading: false, error: null },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(createOrder.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(createOrder.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.order = action.payload;
//             })
//             .addCase(createOrder.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// export default orderSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// =========================
// 🟢 Create Order (Cashfree)
// =========================
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/orders", orderData); // Your backend API
            return res.data; // { orderId, cashfreeToken, ... }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create order");
        }
    }
);

// 🔵 Fetch Orders (with tracking number)
export const fetchOrders = createAsyncThunk(
    "order/fetchOrders",
    async (trackingNumber, { rejectWithValue }) => {
        try {
            if (!trackingNumber) {
                throw new Error("Tracking number missing");
            }

            const res = await axios.get(`/api/orders/track?tracking=${trackingNumber}`);
            return res.data.data || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch orders");
        }
    }
);



const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: null, // for newly created order (Cashfree)
        orders: [],  // for fetched Envia orders
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // 🟢 Create Order
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // 🔵 Fetch Orders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
