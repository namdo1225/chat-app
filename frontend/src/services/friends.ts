import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { Friend, FriendsSchema } from "@/types/friend";
import { AxiosResponse } from "axios";

const api = "friends";

/**
 * Retrieve friends.
 * @param {string} token User access token.
 * @param {number} begin Beginning index for friend range.
 * @param {number} end Inclusive end index for friend range.
 * @returns {Friend[]} The chat members data.
 */
const getFriends = async (
    token: string,
    begin: number,
    end: number
): Promise<Friend[]> => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}`,
        createAuthHeader(token)
    );
    return FriendsSchema.validate(request.data);
};

/**
 * Adds a friend.
 * @param {string} requestee Requestee's user id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} The chat members data.
 */
const addFriend = async (
    requestee: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.post(
        `/${api}/${requestee}`,
        {},
        createAuthHeader(token)
    );
    return request;
};

/**
 * Removes a friend.
 * @param {string} friendRequestID The friend request's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const removeFriend = async (
    friendRequestID: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.delete(
        `/${api}/${friendRequestID}`,
        createAuthHeader(token)
    );
    return request;
};

/**
 * Verifies a friend.
 * @param {string} friendRequestID The friend request's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const verifyFriend = async (
    friendRequestID: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.put(
        `/${api}/${friendRequestID}`,
        {},
        createAuthHeader(token)
    );
    return request;
};

export { addFriend, getFriends, removeFriend, verifyFriend };
