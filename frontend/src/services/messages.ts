import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatMsgSchema, ChatMsgsSchema } from "@/types/message";

const api = "messages";

const getMessages = async (token: string, chatID: string, begin: number, end: number, beforeTimestamp: string) => {
    const request = await apiClient.get(
        `/${api}/${chatID}?beforeTimestamp=${beforeTimestamp}&begin=${begin}&end=${end}`,
        createAuthHeader(token)
    );

    return ChatMsgsSchema.validate(request.data);
};

const sendMessage = async (token: string, text: string, chatID: string) => {
    const request = await apiClient.post(
        `/${api}/${chatID}`,
        {text},
        createAuthHeader(token)
    );

    return ChatMsgSchema.validate(request.data);
};

const editMessage = async (token: string, msgID: string, text: string) => {
    const request = await apiClient.put(
        `/${api}/${msgID}`,
        {text},
        createAuthHeader(token)
    );

    return request;
};

const deleteMessage = async (token: string, msgID: string) => {
    const request = await apiClient.delete(
        `/${api}/${msgID}`,
        createAuthHeader(token)
    );

    return request;
};
export { getMessages, editMessage, deleteMessage, sendMessage };
