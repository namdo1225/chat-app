import {
    InfiniteData,
    UseInfiniteQueryResult,
    UseMutationResult,
    useInfiniteQuery,
    useMutation,
} from "@tanstack/react-query";
import { createChat, deleteChat, editChat, getChats } from "@/services/chat";
import { Chat, CreateChat, EditChat } from "@/types/chat";
import * as y from "yup";
import { queryClient } from "@/config/queryClient";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";

const CHATS = ["CHATS"];

type InfiniteChats = {
    infiniteChats: UseInfiniteQueryResult<InfiniteData<Chat[], unknown>, Error>;
    data: Chat[];
};

/**
 * Hook to retrieve chats.
 *
 * @param {string} token User access token.
 * @param {number} inclusiveLimit Chat's page range.
 * @param {boolean} getAllPublic Whether to retrieve
 * public chats or a user's chats.
 * @returns {InfiniteChats} The hook.
 */
export const useChats = (
    token: string,
    inclusiveLimit: number = 5,
    getAllPublic: boolean = true
): InfiniteChats => {
    const infiniteChats = useInfiniteQuery<Chat[], Error>({
        queryKey: CHATS,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            const result = await getChats(
                token,
                page,
                page + inclusiveLimit,
                getAllPublic
            );
            return result ?? [];
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

    return { infiniteChats, data: infiniteChats.data?.pages.flat() ?? [] };
};

/**
 * Mutation hook to delete a chat.
 * @returns {object} The hook.
 */
export const useDeleteChat = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        chatID: string;
        token: string;
    },
    unknown
> => {
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

/**
 * Mutation hook to create a chat.
 * @returns {object} The hook.
 */
export const useCreateChat = (): UseMutationResult<
    Chat,
    Error,
    {
        chat: CreateChat;
        token: string;
    },
    unknown
> => {
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

/**
 * Mutation hook to edit a chat.
 * @returns {object} The hook.
 */
export const useEditChat = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        chatID: string;
        chat: EditChat;
        token: string;
    },
    unknown
> => {
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
