import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import filterService from "./filterService";

interface FilterState {
    categories: string[];
    sources: string[];
    authors: string[];
    loading: boolean;
    error: string | null;
}

const initialState: FilterState = {
    categories: [],
    sources: [],
    authors: [],
    loading: false,
    error: null,
};

export const fetchFilters = createAsyncThunk(
    "filters/fetch",
    async (_, thunkAPI) => {
        try {
            return await filterService.getFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch filters");
        }
    }
);

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
                state.sources = action.payload.sources;
                state.authors = action.payload.authors;
            })
            .addCase(fetchFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default filterSlice.reducer;
