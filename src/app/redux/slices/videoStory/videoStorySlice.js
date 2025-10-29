import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all videos
export const fetchVideos = createAsyncThunk(
    "videos/fetchVideos",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/videoStory");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch videos");
        }
    }
);

// Upload new video
export const createVideo = createAsyncThunk(
    "videos/createVideo",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/videoStory", payload); // JSON
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create video");
        }
    }
);


// Update video (title, URL, active)
export const updateVideo = createAsyncThunk(
    "videos/updateVideo",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/videoStory", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update video");
        }
    }
);

// Delete video (soft delete)
export const deleteVideo = createAsyncThunk(
    "videos/deleteVideo",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/videoStory", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete video");
        }
    }
);

const videoSlice = createSlice({
    name: "videos",
    initialState: {
        videos: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch videos
        builder
            .addCase(fetchVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create video
        builder
            .addCase(createVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.videos.unshift(action.payload);
            })
            .addCase(createVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update video
        builder
            .addCase(updateVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = state.videos.map((v) =>
                    v.id === action.payload.id ? action.payload : v
                );
            })
            .addCase(updateVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete video
        builder
            .addCase(deleteVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = state.videos.filter((v) => v.id !== action.payload.id);
            })
            .addCase(deleteVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default videoSlice.reducer;
