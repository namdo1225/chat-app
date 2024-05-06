import { getUser, getUsers } from "@/services/users";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Profile } from "@/types/profile";
import { User } from "@supabase/supabase-js";
import * as y from "yup";

const OWN = ["OWN_PROFILE"];
const ALL = ["ALL_PROFILEs"];

export const useOwnProfile = (user: User | null | undefined) => {
    return useQuery<Profile | null>({
        queryKey: OWN,
        queryFn: () => {
            if (user && user.id) return getUser(user.id);
            return null;
        },
        refetchOnWindowFocus(_query) {
            return false;
        },
        enabled: !!user && !!user.id,
    });
};

/*
NON-PAGINATION VERSION
export const useProfiles = (enabled: boolean = true) => {
    return useQuery<Profile[] | undefined>({
        queryKey: ALL,
        queryFn: () => getUsers(),
        refetchOnWindowFocus(_query) {
            return false;
        },
        enabled
    });
};
*/

export const useProfiles = (
    enabled: boolean = true,
    inclusiveLimit: number = 1
) => {
    const infiniteProfiles = useInfiniteQuery<Profile[], Error>({
        queryKey: ALL,
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            return getUsers(page, page + inclusiveLimit);
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
        enabled: !!enabled,
    });

    return { ...infiniteProfiles, data: infiniteProfiles.data?.pages.flat() };
};
