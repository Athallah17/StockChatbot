import { API_STOCKBOT } from "./axiosInstance";
import { API_URLS } from "./api-constants";

export interface AuthRequest {
    email: string
    password: string
}

export interface RegisterRequest extends AuthRequest {
    name: string
}

export interface AuthResponse {
    accessToken: string
}

export const AuthApi = {
    login: async (payload: AuthRequest): Promise<AuthResponse> => {
        const res = await API_STOCKBOT.post(API_URLS.LOGIN, payload)
        const token = res.data?.access_token

        if (!token) throw new Error("No access_token returned from API")

        return { accessToken: token }
    },

    register: async (payload: RegisterRequest): Promise<AuthResponse> => {
        const res = await API_STOCKBOT.post(API_URLS.REGISTER, payload)
        const token = res.data?.access_token

        if (!token) throw new Error("No access_token returned from API")

        return { accessToken: token }
    },
}