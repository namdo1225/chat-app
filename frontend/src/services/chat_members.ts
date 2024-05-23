import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import {
    ChatMember,
    ChatMemberProfile,
    ChatMemberProfilesSchema,
    ChatMembersSchema,
} from "@/types/chat_members";
import { AxiosResponse } from "axios";

const api = "chat_members";

/**
 * Retrieve chat members.
 * @param {string} token User access token.
 * @param {string} chatID Chat's id.
 * @returns {ChatMember[]} The chat members data.
 */
const getChatMembers = async (
    token: string,
    chatID: string
): Promise<ChatMember[]> => {
    const request = await apiClient.get(
        `/${api}/${chatID}`,
        createAuthHeader(token)
    );

    return ChatMembersSchema.validateSync(request.data);
};

/**
 * Retrieve chat members with profile data.
 * @param {string} token User access token.
 * @param {string} chatID Chat's id.
 * @returns {ChatMemberProfile[]} The chat members data.
 */
const getChatMembersProfile = async (
    token: string,
    chatID: string
): Promise<ChatMemberProfile[]> => {
    const request = await apiClient.get(
        `/${api}/${chatID}?retrieveProfile=true`,
        createAuthHeader(token)
    );

    return ChatMemberProfilesSchema.validateSync(request.data);
};

/**
 * Leaves a chat.
 * @param {string} chatID Chat's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const deleteChatMember = async (
    chatID: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.delete(
        `/${api}/${chatID}?profile=true`,
        createAuthHeader(token)
    );
    return request;
};

/**
 * Join a public chat.
 * @param {string} chatID Chat's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const joinChatMember = async (
    chatID: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.post(
        `/${api}/${chatID}`,
        {},
        createAuthHeader(token)
    );
    return request;
};

export {
    getChatMembers,
    deleteChatMember,
    joinChatMember,
    getChatMembersProfile,
};
