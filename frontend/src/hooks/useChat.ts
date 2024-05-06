import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getChats } from "@/services/chat";
import { Chat } from "@/types/chat";
import * as y from "yup";

const CHATS = ["CHATS"];

export const useChats = (token: string, inclusiveLimit: number = 1, getAllPublic: boolean = true) => {
    const infiniteChats = useInfiniteQuery<Chat[], Error>({
        queryKey: CHATS,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            return getChats(token, page, page + inclusiveLimit, getAllPublic);
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const page = y.number().required().validateSync(lastPageParam);
            if (
                lastPage &&
                lastPage.length > 0 &&
                lastPage.length >= inclusiveLimit
            )
                return page + inclusiveLimit + 1;
            return null;
        },
        enabled: !!token,
    });

    return { ...infiniteChats, data: infiniteChats.data?.pages.flat() };
};