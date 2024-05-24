import {
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
import queryClient from "@/config/queryClient";
import * as y from "yup";
import { AxiosResponse } from "axios";

const FRIENDS = ["FRIENDS"];

/**
 * Hook to retrieve friends.
 *
 * @param {string} token User access token.
 * @param {number} inclusiveLimit Number of entries to retrieve.
 * @returns {object} The hook.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useFriends = (token: string, inclusiveLimit: number = 10) => {
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
        ...infiniteFriends,
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIENDS }),
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIENDS }),
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIENDS }),
    });
};
