import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getChats } from "@/services/chat";
import { ChatMsg } from "@/types/chat";
import * as y from "yup";

export const useMessagesInfinite = (token: string, chatID: string, inclusiveLimit: number = 1, getAllPublic: boolean = true) => {
    const currentMessages = useQuery<ChatMsg[]>({
        queryKey: [`MSG_${chatID}_CURRENT`],
        queryFn: () => {
            return getFriends(token) ?? [];
        },
        enabled: !!token,
    });

    const infiniteMessages = useInfiniteQuery<ChatMsg[], Error>({
        queryKey: [`MSG_${chatID}_INFINITE`],
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

    return { infinite: infiniteMessages, current: currentMessages, finalData: infiniteMessages.data?.pages.flat().concat(currentMessages.data) ?? [] };
};
