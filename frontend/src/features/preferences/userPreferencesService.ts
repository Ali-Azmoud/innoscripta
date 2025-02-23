import axios from "axios";
import {API_URL} from "../../config";

interface Preferences {
    source: string[];
    category: string[];
    author: string[];
}

export const fetchUserPreferences = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !user.token) {
        throw new Error("User is not authenticated.");
    }

    try {
        const response = await axios.get(`${API_URL}/user/preferences`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user preferences:", error);
        throw error;
    }
};

const updateUserPreferences = async (preferences: Preferences) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !user.token) {
        throw new Error("User is not authenticated.");
    }

    const response = await axios.post(`${API_URL}/user/preferences`, preferences, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
    return response.data;
};

const userPreferencesService = {
    updateUserPreferences,
};

export default userPreferencesService;
