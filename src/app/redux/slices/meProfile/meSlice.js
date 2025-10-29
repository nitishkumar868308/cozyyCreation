import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMe = createAsyncThunk(
    "me/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/auth/me", {
                withCredentials: true, // ✅ send cookies
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch profile");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "me/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post("/api/auth/logout", null, {
                withCredentials: true, // ✅ send cookies
            });
            return true; // success flag
        } catch (err) {
            return rejectWithValue(err.response?.data || "Logout failed");
        }
    }
);

const meSlice = createSlice({
    name: "me",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null; // clear user
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default meSlice.reducer;
