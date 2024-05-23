import { getUser, getUsers } from "@/services/users";
import {
    UseQueryResult,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";
import { Profile } from "@/types/profile";
import { Session, User } from "@supabase/supabase-js";
import * as y from "yup";

const OWN = ["OWN_PROFILE"];
const ALL = ["ALL_PROFILEs"];

/**
 * Hook to retrieve a user's own profile.
 *
 * @param {User | null | undefined} user User access token.
 * @param {Session | null | undefined} session User's website session.
 * @returns {object} The hook.
 */
export const useOwnProfile = (
    user: User | null | undefined,
    session: Session | null | undefined
): UseQueryResult<Profile | null, Error> => {
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

/**
 * Hook to retrieve profiles.
 *
 * @param {boolean} enabled Whether to enable the retrieval of data.
 * @param {number} inclusiveLimit User's page limit.
 * @returns {object} The hook.
 */
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
