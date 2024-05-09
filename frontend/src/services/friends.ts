import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { FriendsSchema } from "@/types/friend";

const api = "friends";

const getFriends = async (token: string, begin: number, end: number) => {
    const request = await apiClient.get(
        `/${api}?begin=${begin}&end=${end}`,
        createAuthHeader(token)
    );
    return FriendsSchema.validate(request.data);
};

const addFriend = async (requestee: string, token: string) => {
    const request = await apiClient.post(
        `/${api}/${requestee}`,
        {},
        createAuthHeader(token)
    );
    return request;
};

const removeFriend = async (friendRequestID: string, token: string) => {
    const request = await apiClient.delete(
        `/${api}/${friendRequestID}`,
        createAuthHeader(token)
    );
    return request;
};

const verifyFriend = async (friendRequestID: string, token: string) => {
    const request = await apiClient.put(
        `/${api}/${friendRequestID}`,
        {},
        createAuthHeader(token)
    );
    return request;
};

export { addFriend, getFriends, removeFriend, verifyFriend };
