import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: update user
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/auth/updateUser", userData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update user");
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user;
                state.list = state.list.map((u) =>
                    u.id === updatedUser.id ? updatedUser : u
                );
                if (!state.list.some((u) => u.id === updatedUser.id)) {
                    state.list.push(updatedUser);
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default userSlice.reducer;
