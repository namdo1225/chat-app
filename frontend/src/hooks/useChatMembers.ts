import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getChatMembers,
    joinChatMember,
    deleteChatMember,
} from "@/services/chat_members";
import { ChatMember } from "@/types/chat_members";
import toast from "react-hot-toast";
import queryClient from "@/config/queryClient";

export const useChatMembers = (chatID: string, token: string) => {
    const chatMembers = useQuery<ChatMember[], Error>({
        queryKey: [`CHAT_MEMBERS_${chatID}`],
        queryFn: () => getChatMembers(token, chatID),
        enabled: !!token,
    });

    return { ...chatMembers, data: chatMembers.data ?? [] };
};

export const useJoinChatMember = () => {
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

export const useDeleteChatMember = () => {
    return useMutation({
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            deleteChatMember(chatID, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["CHATS"] });
            toast.success("You left the chat successfully.");
        },
    });
};
