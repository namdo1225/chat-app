import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatsSchema } from "@/types/chat";

const api = "chats";

const getChats = async (token: string, begin: number, end: number, getAllPublic: boolean = true) => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}&getAllPublic=${getAllPublic}`,
        createAuthHeader(token)
    );

    return ChatsSchema.validate(request.data);
};

export { getChats };
