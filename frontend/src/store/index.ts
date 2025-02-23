import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import filterReducer from "../features/filters/filterSlice";
import articleReducer from "../features/articles/articleSlice";
import userPreferencesReducer from "../features/preferences/userPreferencesSlice";
import feedReducer from "../features/feeds/feedSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        filters: filterReducer,
        articles: articleReducer,
        preferences: userPreferencesReducer,
        feeds: feedReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
