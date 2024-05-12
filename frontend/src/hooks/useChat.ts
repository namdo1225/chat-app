import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createChat, deleteChat, editChat, getChats } from "@/services/chat";
import { Chat, CreateChat, EditChat } from "@/types/chat";
import * as y from "yup";
import queryClient from "@/config/queryClient";
import toast from "react-hot-toast";

const CHATS = ["CHATS"];

export const useChats = (
    token: string,
    inclusiveLimit: number = 1,
    getAllPublic: boolean = true
) => {
    const infiniteChats = useInfiniteQuery<Chat[], Error>({
        queryKey: CHATS,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            return (
                getChats(token, page, page + inclusiveLimit, getAllPublic) ?? []
            );
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

    return { ...infiniteChats, data: infiniteChats.data?.pages.flat() ?? [] };
};

export const useDeleteChat = () => {
    return useMutation({
        mutationKey: CHATS,
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            deleteChat(chatID, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHATS });
            toast.success("Chat deleted successfully.");
        },
    });
};

export const useCreateChat = () => {
    return useMutation({
        mutationKey: CHATS,
        mutationFn: ({ chat, token }: { chat: CreateChat; token: string }) =>
            createChat(chat, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHATS });
            toast.success("Chat created successfully.");
        },
    });
};

export const useEditChat = () => {
    return useMutation({
        mutationKey: CHATS,
        mutationFn: ({
            chatID,
            chat,
            token,
        }: {
            chatID: string;
            chat: EditChat;
            token: string;
        }) => editChat(chatID, chat, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHATS });
            toast.success("Chat edited successfully.");
        },
    });
};
