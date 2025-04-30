import { API_STOCKBOT } from "./axiosInstance";
import { API_URLS } from "./api-constants";

export interface AskRequest {
    message : string
}

export interface AskResponse {
    action : string
    response: string[]
}

export const AskApi = {
    sendMessage: async (payload: AskRequest): Promise<AskResponse> => {
        const res = await API_STOCKBOT.post(API_URLS.CHATBOT, payload)
        console.log('API Return:', res.data)
        return res.data
    }
}