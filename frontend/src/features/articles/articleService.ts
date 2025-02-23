import axios from "axios";
import {API_URL} from "../../config";
import {PaginatedArticles} from "../../models/Article";

const searchArticles = async (params: any): Promise<PaginatedArticles> => {
    const response = await axios.post(`${API_URL}/articles/search`, params);
    return response.data;
};

const articleService = {
    searchArticles,
};

export default articleService;
