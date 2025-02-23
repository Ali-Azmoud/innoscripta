import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFeeds } from "./feedService";
import {PaginatedArticles} from "../../models/Article";

interface FeedState {
    feeds: PaginatedArticles | null;
    loading: boolean;
    error: string | null;
}

const initialState: FeedState = {
    feeds: null,
    loading: false,
    error: null,
};

export const getFeeds = createAsyncThunk("feeds/getFeeds", async (page: number = 1, { rejectWithValue }) => {
    try {
        return await fetchFeeds(page);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch feeds");
    }
});

const feedSlice = createSlice({
    name: "feeds",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeeds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeeds.fulfilled, (state, action) => {
                state.loading = false;
                state.feeds = action.payload;
            })
            .addCase(getFeeds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default feedSlice.reducer;
