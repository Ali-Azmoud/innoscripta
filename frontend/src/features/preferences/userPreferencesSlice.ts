import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userPreferencesService, {fetchUserPreferences} from "./userPreferencesService";

interface PreferencesState {
    selectedSources: string[];
    selectedCategories: string[];
    selectedAuthors: string[];
    loading: boolean;
    error: string | null;
}

const initialState: PreferencesState = {
    selectedSources: [],
    selectedCategories: [],
    selectedAuthors: [],
    loading: false,
    error: null,
};

export const getUserPreferences = createAsyncThunk("preferences/getUserPreferences", async (_, { rejectWithValue }) => {
    try {
        return await fetchUserPreferences();
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch preferences");
    }
});

export const updateUserPreferences = createAsyncThunk(
    "preferences/update",
    async (preferences: { source: string[]; category: string[]; author: string[] }, thunkAPI) => {
        try {
            return await userPreferencesService.updateUserPreferences(preferences);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update preferences");
        }
    }
);

const userPreferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setSelectedSources: (state, action) => {
            state.selectedSources = action.payload;
        },
        setSelectedCategories: (state, action) => {
            state.selectedCategories = action.payload;
        },
        setSelectedAuthors: (state, action) => {
            state.selectedAuthors = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserPreferences.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCategories = action.payload.filter((p: any) => p.type === "category").map((p: any) => p.value);
                state.selectedSources = action.payload.filter((p: any) => p.type === "source").map((p: any) => p.value);
                state.selectedAuthors = action.payload.filter((p: any) => p.type === "author").map((p: any) => p.value);
            })
            .addCase(getUserPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserPreferences.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUserPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedSources, setSelectedCategories, setSelectedAuthors } = userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;
