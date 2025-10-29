import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create
export const sendContactMessage = createAsyncThunk(
    "contactMessage/sendContactMessage",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/contactMessage", payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to send message");
        }
    }
);

// Read all messages
export const fetchContactMessages = createAsyncThunk(
    "contactMessage/fetchContactMessages",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/contactMessage");
            return response.data.messages;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch messages");
        }
    }
);

// Update message
export const updateContactMessage = createAsyncThunk(
    "contactMessage/updateContactMessage",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/contactMessage", payload);
            return response.data.updatedMessage;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update message");
        }
    }
);

// Delete message
export const deleteContactMessage = createAsyncThunk(
    "contactMessage/deleteContactMessage",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/contactMessage", { data: { id } });
            return response.data.id;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete message");
        }
    }
);

const contactMessageSlice = createSlice({
    name: "contactMessage",
    initialState: {
        messages: [],
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        resetContactState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send
            .addCase(sendContactMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(sendContactMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.messages.push(action.payload.contactMessage);
            })
            .addCase(sendContactMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            // Fetch
            .addCase(fetchContactMessages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchContactMessages.fulfilled, (state, action) => { state.loading = false; state.messages = action.payload; })
            .addCase(fetchContactMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.error.message; })

            // Update
            .addCase(updateContactMessage.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateContactMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = state.messages.map(msg => msg.id === action.payload.id ? action.payload : msg);
            })
            .addCase(updateContactMessage.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.error.message; })

            // Delete
            .addCase(deleteContactMessage.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteContactMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = state.messages.filter(msg => msg.id !== action.payload);
            })
            .addCase(deleteContactMessage.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.error.message; });
    },
});

export const { resetContactState } = contactMessageSlice.actions;
export default contactMessageSlice.reducer;
