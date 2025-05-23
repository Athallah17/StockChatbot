import { API_STOCKBOT } from "./axiosInstance";
import { API_URLS } from "./api-constants";

// Tipe untuk 1 pesan dalam sesi
export interface ChatMessage {
  sender: "user" | "bot";
  message: string;
  timestamp: string;
}

// Tipe untuk 1 sesi chat
export interface ChatSession {
  session_id: number;
  title: string;
  created_at: string;
  messages: ChatMessage[];
}

export const ChatApi = {
  getHistory: async (): Promise<ChatSession[]> => {
    const res = await API_STOCKBOT.get(API_URLS.HISTORY);
    return res.data;
  },
};