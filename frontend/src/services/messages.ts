import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatsSchema } from "@/types/chat";

const api = "messages";

const getMessages = async (token: string, begin: number, end: number) => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}`,
        createAuthHeader(token)
    );

    return ChatMsgSchema.validate(request.data);
};

const sendMessage = async (token: string, message: ChatMsg) => {
    const request = await apiClient.post(
        `/${api}`,
        message,
        createAuthHeader(token)
    );

    return ChatMsgSchema.validate(request.data);
};

const editMessage = async (token: string, msgID: number, text: string) => {
    const request = await apiClient.put(
        `/${api}/${msgID}`,
        {text}
        createAuthHeader(token)
    );

    return request;
};

const deleteMessage = async (token: string, msgID: number) => {
    const request = await apiClient.delete(
        `/${api}/${msgID}`,
        createAuthHeader(token)
    );

    return request);
};
export { getMessages, editMessage, deleteMessage };
