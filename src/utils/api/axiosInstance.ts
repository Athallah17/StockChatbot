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

export { API_STOCKBOT}