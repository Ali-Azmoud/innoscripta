import axios from "axios";
import {API_URL} from "../../config";

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

const register = async (userData: RegisterData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (userData: LoginData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

const logout = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !user.token) {
        throw new Error("User is not authenticated.");
    }

    await axios.post(
        `${API_URL}/logout`,
        {}, // Empty request body
        {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }
    );

    localStorage.removeItem("user");
};

const authService = { register, login, logout };
export default authService;
