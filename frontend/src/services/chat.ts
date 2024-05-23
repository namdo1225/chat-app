import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import {
    ChatsSchema,
    CreateChat,
    ChatSchema,
    EditChat,
    Chat,
} from "@/types/chat";
import { AxiosResponse } from "axios";

const api = "chats";

/**
 * Retrieve chat.
 * @param {string} token User access token.
 * @param {number} begin Beginning index for chat range.
 * @param {number} end Inclusive end index for chat range.
 * @param {boolean} getAllPublic Whether to retrieve
 * public chat or the user's chat.
 * @returns {Chat[]} The chat members data.
 */
const getChats = async (
    token: string,
    begin: number,
    end: number,
    getAllPublic: boolean = true
): Promise<Chat[]> => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}&getAllPublic=${getAllPublic}`,
        createAuthHeader(token)
    );

    return ChatsSchema.validate(request.data);
};

/**
 * Creates a chat.
 * @param {CreateChat} chat Beginning index for chat range.
 * @param {string} token User access token.
 * public chat or the user's chat.
 * @returns {Chat} The chat members data.
 */
const createChat = async (chat: CreateChat, token: string): Promise<Chat> => {
    const request = await apiClient.post(
        `/${api}`,
        chat,
        createAuthHeader(token)
    );
    return ChatSchema.validate(request.data);
};

/**
 * Deletes a chat.
 * @param {string} chatID Chat's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const deleteChat = async (
    chatID: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.delete(
        `/${api}/${chatID}`,
        createAuthHeader(token)
    );
    return request;
};

/**
 * Edits a chat.
 * @param {string} id Chat's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const editChat = async (
    id: string,
    editedChat: EditChat,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.put(
        `/${api}/${id}`,
        editedChat,
        createAuthHeader(token)
    );
    return request;
};

export { getChats, createChat, deleteChat, editChat };
