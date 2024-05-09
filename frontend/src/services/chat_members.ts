import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatsSchema, CreateChat, ChatSchema, EditChat } from "@/types/chat";

const api = "chat_members";

const getChatMembers = async (token: string, begin: number, end: number, getAllPublic: boolean = true) => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}&getAllPublic=${getAllPublic}`,
        createAuthHeader(token)
    );

    return ChatsSchema.validate(request.data);
};

const deleteChatMember = async (chatID: string, token: string) => {
    const request = await apiClient.delete(
        `/${api}/${chatID}`,
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

export { getChatMembers, deleteChatMember, joinChatMember };
