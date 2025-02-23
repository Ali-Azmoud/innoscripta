import axios from "axios";
import {API_URL} from "../../config";
import {PaginatedArticles} from "../../models/Article";

export const fetchFeeds = async (page: number = 1): Promise<PaginatedArticles> => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !user.token) {
        throw new Error("User is not authenticated.");
    }
    const response = await axios.get(`${API_URL}/user/feed/?page=${page}`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
    return response.data;
};
