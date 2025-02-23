import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import articleService from "./articleService";
import {PaginatedArticles} from "../../models/Article"; // Import model

interface ArticleState {
    articles: PaginatedArticles | null;
    loading: boolean;
    error: string | null;
}

const initialState: ArticleState = {
    articles: null,
    loading: false,
    error: null,
};

export const fetchArticles = createAsyncThunk(
    "articles/fetch",
    async (searchParams: any, thunkAPI) => {
        try {
            return await articleService.searchArticles(searchParams);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch articles");
        }
    }
);

const articleSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default articleSlice.reducer;
