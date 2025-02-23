import axios from "axios";
import {FiltersResponse} from "../../models/FilterResponse";
import {API_URL} from "../../config";

// Function to fetch filters from the API
const getFilters = async (): Promise<FiltersResponse> => {
    const response = await axios.get(`${API_URL}/articles/filters`);
    return response.data;
};

const filterService = {
    getFilters,
};

export default filterService;
