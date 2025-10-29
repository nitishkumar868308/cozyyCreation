import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: get all users
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/auth/getAllUser");
            return response.data; // API se pura data return karna
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch users");
        }
    }
);

const usersSlice = createSlice({
    name: "getAllUser",
    initialState: {
        list: [],   
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data || [];
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default usersSlice.reducer;
