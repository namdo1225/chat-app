import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { ChatMsg, ChatMsgSchema, ChatMsgsSchema } from "@/types/message";
import { AxiosResponse } from "axios";

const api = "messages";

/**
 * Retrieve messages.
 * @param {string} token User access token.
 * @param {string} chatID Chat's id.
 * @param {number} limit Message limit.
 * @param {string} beforeTimestamp Get messages sent before this timestamp.
 * @returns {ChatMsg[]} The chat members data.
 */
const getMessages = async (
    token: string,
    chatID: string,
    limit: number,
    beforeTimestamp: string
): Promise<ChatMsg[]> => {
    const request = await apiClient.get(
        `/${api}/${chatID}?beforeTimestamp=${beforeTimestamp}&limit=${limit}`,
        createAuthHeader(token)
    );

    return ChatMsgsSchema.validate(request.data);
};

/**
 * Sends a message to chat.
 * @param {string} token User access token.
 * @param {string} text Message's content.
 * @param {string} chatID Chat's id.
 * @returns {ChatMsg} The chat message sent.
 */
const sendMessage = async (
    token: string,
    text: string,
    chatID: string
): Promise<ChatMsg> => {
    const request = await apiClient.post(
        `/${api}/${chatID}`,
        { text },
        createAuthHeader(token)
    );

    return ChatMsgSchema.validate(request.data);
};

/**
 * Edits a message.
 * @param {string} token User access token.
 * @param {string} msgID Message's id.
 * @param {string} text Message's edited content.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const editMessage = async (
    token: string,
    msgID: string,
    text: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.put(
        `/${api}/${msgID}`,
        { text },
        createAuthHeader(token)
    );

    return request;
};

/**
 * Deletes a message.
 * @param {string} token User access token.
 * @param {string} msgID Message's id.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const deleteMessage = async (
    token: string,
    msgID: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.delete(
        `/${api}/${msgID}`,
        createAuthHeader(token)
    );

    return request;
};
export { getMessages, editMessage, deleteMessage, sendMessage };
