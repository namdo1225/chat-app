import {
    useQuery,
    useMutation,
    UseMutationResult,
} from "@tanstack/react-query";
import {
    getChatMembers,
    joinChatMember,
    deleteChatMember,
    getChatMembersProfile,
} from "@/services/chat_members";
import { ChatMember, ChatMemberProfile } from "@/types/chat_members";
import toast from "react-hot-toast";
import queryClient from "@/config/queryClient";
import { AxiosResponse } from "axios";

/**
 * Hook to retrieve chat members from a chat.
 *
 * @param {string} chatID The chat's ID.
 * @param {string} token User access token.
 * @param {boolean} chatMemberExist Whether a chat member exist.
 * @returns {object} The hook.
 */
export const useChatMembers = (
    chatID: string,
    token: string,
    chatMemberExist: boolean = false
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
) => {
    const chatMembers = useQuery<ChatMember[], Error>({
        queryKey: [`CHAT_MEMBERS_${chatID}`],
        queryFn: () => getChatMembers(token, chatID),
        enabled: !!token && !chatMemberExist,
    });

    return { ...chatMembers, data: chatMembers.data ?? [] };
};

/**
 * Hook to retrieve chat members with profile info from a chat.
 *
 * @param {string} chatID The chat's ID.
 * @param {string} token User access token.
 * @returns {object} The hook.
 */
export const useChatMembersProfile = (chatID: string, token: string) => {
    const chatMembers = useQuery<ChatMemberProfile[], Error>({
        queryKey: [`CHAT_MEMBERS_${chatID}_PROFILES`],
        queryFn: () => getChatMembersProfile(token, chatID),
        enabled: !!token,
    });

    return { ...chatMembers, data: chatMembers.data ?? [] };
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
