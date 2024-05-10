import { useQuery, useMutation } from "@tanstack/react-query";
import { getChatMembers, joinChatMember, deleteChatMember } from "@/services/chat_members";
import { ChatMember } from "@/types/chat_members";

export const useChatMembers = (chatID: string, token: string) => {
    const chatMembers = useQuery<ChatMember[], Error>({
        queryKey: [`CHAT_MEMBERS_${chatID}`],
        queryFn: () => getChatMembers(token, chatID) ?? [],
        enabled: !!token,
    });

    return {...chatMembers, data: chatMembers.data ?? []};
};

export const useJoinChatMember = () => {
    return useMutation({
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            joinChatMember(chatID, token),
    });
};

export const useDeleteChatMember = () => {
    return useMutation({
        mutationFn: ({ chatID, token }: { chatID: string; token: string }) =>
            deleteChatMember(chatID, token),
    });
};
