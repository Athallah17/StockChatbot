import {useQuery, useInfiniteQuery} from "@tanstack/react-query"
import {ChatApi,ChatMessage,ChatSession} from "@/utils/api/chat-history-api"
import {useEffect, useState} from "react"

export const useChatHistory = () => {
    const [page, setPage] = useState(1);
    const [allSessions, setAllSessions] = useState<ChatSession[]>([]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["chat-history", page],
        queryFn: async () => {
        const all = await ChatApi.getHistory();
        const start = (page - 1) * 10;
        return all.slice(start, start + 10);
        },
        keepPreviousData: true,
    });

    useEffect(() => {
    if (data) {
        setAllSessions((prev) => {
        const newSessions = data.filter(
            (newSession) => !prev.some((s) => s.session_id === newSession.session_id)
        )
        return [...prev, ...newSessions]
        })
    }
    }, [data])

    return {
        sessions: allSessions,
        isLoading,
        loadMore: () => setPage((p) => p + 1),
        refetchHistory: refetch,
    };
    };