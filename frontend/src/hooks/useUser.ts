import { getUser, getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/types/profile";
import { User } from "@supabase/supabase-js";

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
