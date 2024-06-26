import {
    useQuery,
    useMutation,
    UseMutationResult,
    UseQueryResult,
} from "@tanstack/react-query";
import {
    getChatMembers,
    joinChatMember,
    deleteChatMember,
    getChatMembersProfile,
} from "@/services/chat_members";
import { ChatMember, ChatMemberProfile } from "@/types/chat_members";
import toast from "react-hot-toast";
import { queryClient } from "@/config/queryClient";
import { AxiosResponse } from "axios";

type ChatMembersQuery = UseQueryResult<ChatMember[], Error>;

/**
 * Hook to retrieve chat members from a chat.
 *
 * @param {string} chatID The chat's ID.
 * @param {string} token User access token.
 * @param {boolean} chatMemberExist Whether a chat member exist.
 * @returns {ChatMembersQuery} The hook.
 */
export const useChatMembers = (
    chatID: string,
    token: string,
    chatMemberExist: boolean = false
): ChatMembersQuery => {
    const chatMembers = useQuery<ChatMember[], Error>({
        queryKey: [`CHAT_MEMBERS_${chatID}`],
        queryFn: async () => {
            const result = await getChatMembers(token, chatID);
            return result ?? [];
        },
        enabled: !!token && !chatMemberExist,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return chatMembers;
};

type ChatMemberProfilesQuery = UseQueryResult<ChatMemberProfile[], Error>;

/**
 * Hook to retrieve chat members with profile info from a chat.
 *
 * @param {string} chatID The chat's ID.
 * @param {string} token User access token.
 * @returns {ChatMemberProfilesQuery} The hook.
 */
export const useChatMembersProfile = (
    chatID: string,
    token: string
): ChatMemberProfilesQuery => {
    const chatMembers = useQuery<ChatMemberProfile[], Error>({
        queryKey: [`CHAT_MEMBERS_${chatID}_PROFILES`],
        queryFn: async () => {
            const result = await getChatMembersProfile(token, chatID);
            return result ?? [];
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return chatMembers;
};

/**
 * Mutation hook to join a chat.
 * @returns {object} The hook.
 */
export const useJoinChatMember = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        chatID: string;
        token: string;
    },
    unknown
> => {
    return useMutation({
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            joinChatMember(chatID, token),
        onSuccess: () => {
            toast.success("Joined chat successfully.");
        },
        onError: () => {
            toast.error(
                "Error joining chat group. Check to make sure you are not in this chat or try again later."
            );
        },
    });
};

/**
 * Mutation hook to leave a chat.
 * @returns {object} The hook.
 */
export const useDeleteChatMember = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        chatID: string;
        token: string;
    },
    unknown
> => {
    return useMutation({
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            deleteChatMember(chatID, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["CHATS"] });
            toast.success("You left the chat successfully.");
        },
    });
};
