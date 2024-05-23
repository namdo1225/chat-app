import { getUser, getUsers } from "@/services/users";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Profile } from "@/types/profile";
import { Session, User } from "@supabase/supabase-js";
import * as y from "yup";

const OWN = ["OWN_PROFILE"];
const ALL = ["ALL_PROFILEs"];

export const useOwnProfile = (
    user: User | null | undefined,
    session: Session | null | undefined
) => {
    return useQuery<Profile | null>({
        queryKey: OWN,
        queryFn: () => {
            if (user && user.id && session)
                return getUser(user.id, session.access_token);
            return null;
        },
        refetchOnWindowFocus(_query) {
            return false;
        },
        enabled: !!user && !!user.id && !!session,
    });
};

export const useProfiles = (
    enabled: boolean = true,
    inclusiveLimit: number = 10
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
