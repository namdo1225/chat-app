import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
    addFriend,
    getFriends,
    removeFriend,
    verifyFriend,
} from "@/services/friends";
import { Friend } from "@/types/friend";
import queryClient from "@/config/queryClient";
import * as y from "yup";

const FRIENDS = ["FRIENDS"];

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

    return { ...infiniteFriends, data: infiniteFriends.data?.pages.flat() ?? [] };
};

export const useAddFriend = () => {
    return useMutation({
        mutationKey: FRIENDS,
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            addFriend(id, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIENDS }),
    });
};

export const useRemoveFriend = () => {
    return useMutation({
        mutationKey: FRIENDS,
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            removeFriend(id, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIENDS }),
    });
};

export const useVerifyFriend = () => {
    return useMutation({
        mutationKey: FRIENDS,
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            verifyFriend(id, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIENDS }),
    });
};
