import { useQuery, useMutation } from "@tanstack/react-query";
import { createChat, deleteChat, editChat, getChats } from "@/services/chat";
import { Chat, CreateChat, EditChat } from "@/types/chat";
import * as y from "yup";
import queryClient from "@/config/queryClient";

export const useChatMembers = (chatID: string, token: string, inclusiveLimit: number = 1, getAllPublic: boolean = true) => {
    return useQuery<ChatMember[], Error>({
        queryKey: `CHAT_MEMBERS_${chatID}`,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            return getChats(token, page, page + inclusiveLimit, getAllPublic) ?? [];
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
};

export const useDeleteChatMember = () => {
    return useMutation({
        mutationKey: `CHATS`,
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            deleteChat(chatID, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CHATS }),
    });
};
