import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";

interface User {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    "auth/login",
    async (userData: { email: string; password: string }, thunkAPI) => {
        try {
            return await authService.login(userData);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData: { name: string; email: string; password: string }, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await authService.logout();
        return;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("user");
            });
    },
});

export default authSlice.reducer;
