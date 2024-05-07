import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatsSchema, CreateChat, ChatSchema } from "@/types/chat";

const api = "chats";

const getChats = async (token: string, begin: number, end: number, getAllPublic: boolean = true) => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}&getAllPublic=${getAllPublic}`,
        createAuthHeader(token)
    );

    return ChatsSchema.validate(request.data);
};

const createChat = async (chat: CreateChat, token: string) => {
    const request = await apiClient.post(
        `/${api}`,
        chat,
        createAuthHeader(token)
    );
    return ChatSchema.validate(request.data);
};

export { getChats, createChat };
