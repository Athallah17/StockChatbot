import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const API_STOCKBOT = axios.create({
    baseURL: `${BASE_BACKEND_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

//use interceptor to add token to every request
API_STOCKBOT.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export { API_STOCKBOT}