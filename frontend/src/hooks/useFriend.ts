import {
    InfiniteData,
    UseInfiniteQueryResult,
    UseMutationResult,
    useInfiniteQuery,
    useMutation,
} from "@tanstack/react-query";
import {
    addFriend,
    getFriends,
    removeFriend,
    verifyFriend,
} from "@/services/friends";
import { Friend } from "@/types/friend";
import { queryClient } from "@/config/queryClient";
import * as y from "yup";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";

const FRIENDS = ["FRIENDS"];

type InfiniteFriends = {
    infiniteFriends: UseInfiniteQueryResult<
        InfiniteData<Friend[], unknown>,
        Error
    >;
    data: Friend[];
};

/**
 * Hook to retrieve friends.
 *
 * @param {string} token User access token.
 * @param {number} inclusiveLimit Number of entries to retrieve.
 * @returns {InfiniteFriends} The hook.
 */
export const useFriends = (
    token: string,
    inclusiveLimit: number = 10
): InfiniteFriends => {
    const infiniteFriends = useInfiniteQuery<Friend[], Error>({
        queryKey: FRIENDS,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            return getFriends(token, page, page + inclusiveLimit);
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const page = y.number().required().validateSync(lastPageParam);
            if (
                lastPage &&
                lastPage.length > 0 &&
                lastPage.length >= inclusiveLimit
            )
                return page + inclusiveLimit + 1;
            return null;
        },
        enabled: !!token,
    });

    return {
        infiniteFriends,
        data: infiniteFriends.data?.pages.flat() ?? [],
    };
};

/**
 * Mutation hook to add a friend.
 * @returns {object} The hook.
 */
export const useAddFriend = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        id: string;
        token: string;
    },
    unknown
> => {
    return useMutation({
        mutationKey: FRIENDS,
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            addFriend(id, token),
        onSuccess: () => {
            toast.success("Sent friend request successfully.");
            queryClient.invalidateQueries({ queryKey: FRIENDS });
        },
        onError: () => {
            toast.error(
                "Unable to send the friend request. Make sure you haven't sent a request to this user yet."
            );
        },
    });
};

/**
 * Mutation hook to remove a friend.
 * @returns {object} The hook.
 */
export const useRemoveFriend = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        id: string;
        token: string;
    },
    unknown
> => {
    return useMutation({
        mutationKey: FRIENDS,
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            removeFriend(id, token),
        onSuccess: () => {
            toast.success("Removed friend successfully.");
            queryClient.invalidateQueries({ queryKey: FRIENDS });
        },
        onError: () => {
            toast.error("Unable to send the remove friend. Try again later.");
        },
    });
};

/**
 * Mutation hook to verify a friend's request.
 * @returns {object} The hook.
 */
export const useVerifyFriend = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        id: string;
        token: string;
    },
    unknown
> => {
    return useMutation({
        mutationKey: FRIENDS,
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            verifyFriend(id, token),
        onSuccess: () => {
            toast.success("Accepted pending friend request.");
            queryClient.invalidateQueries({ queryKey: FRIENDS });
        },
        onError: () => {
            toast.error("Unable to send accept friend request. Try again later.");
        },
    });
};
