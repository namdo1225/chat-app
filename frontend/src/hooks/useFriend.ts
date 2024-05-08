import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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

/*
const TEST = ["TEST"];
const test_friends: Friend[] = [
    {
        created_at: new Date().toDateString(),
        first_name: "Nam",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "1",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Nam",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "2",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Naam",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "3",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Naaam",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "4",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Naaaaam",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "5",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Naaaaam",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "6",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Nim",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "7",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Nam",
        last_name: "Du",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "8",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Nam",
        last_name: "Du",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "9",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Name",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "10",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Nameq",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "11",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
    {
        created_at: new Date().toDateString(),
        first_name: "Namp",
        last_name: "Do",
        profile_photo:
            "https://as1.ftcdn.net/v2/jpg/03/65/42/00/1000_F_365420014_xjsSDkKzrhq4gr9GFzP6S97H7MJyNI5B.jpg",
        public_profile: true,
        id: "12",
        requestee: "1",
        requester: "2",
        pending: false,
        user_id: "1",
    },
];

export const useTestFriends = () => {
    return useInfiniteQuery<Friend[], Error>({
        queryKey: TEST,
        initialPageParam: 0,
        queryFn: ({ pageParam }) =>
            test_friends.slice(pageParam as number, (pageParam as number) + 4),
        getNextPageParam: (lastPage, allPages) => {
            if (test_friends.length > allPages.length * 4)
                return allPages.length * 4;
        },
    });
};


export const useFriends = (token: string | undefined | null) => {
    return useQuery<Friend[] | null | undefined>({
        queryKey: FRIENDS,
        queryFn: () => {
            return token ? getFriends(token) : null;
        },
        refetchOnWindowFocus(_query) {
            return false;
        },
        enabled: !!token,
    });
};
*/

export const useFriends = (token: string, inclusiveLimit: number = 1) => {
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
