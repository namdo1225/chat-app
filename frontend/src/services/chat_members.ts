import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatMemberProfilesSchema, ChatMembersSchema } from "@/types/chat_members";

const api = "chat_members";

const getChatMembers = async (token: string, chatID: string) => {
    const request = await apiClient.get(
        `/${api}/${chatID}`,
        createAuthHeader(token)
    );

    return ChatMembersSchema.validateSync(request.data);
};

const getChatMembersProfile = async (token: string, chatID: string) => {
    const request = await apiClient.get(
        `/${api}/${chatID}`,
        createAuthHeader(token)
    );

    return ChatMemberProfilesSchema.validateSync(request.data);
};

const deleteChatMember = async (chatID: string, token: string) => {
    const request = await apiClient.delete(
        `/${api}/${chatID}?profile=true`,
        createAuthHeader(token)
    );
    return request;
};

const joinChatMember = async (chatID: string, token: string) => {
    const request = await apiClient.post(
        `/${api}/${chatID}`,
        {},
        createAuthHeader(token)
    );
    return request;
}; 

export { getChatMembers, deleteChatMember, joinChatMember, getChatMembersProfile };
