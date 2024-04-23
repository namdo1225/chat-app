import { getUser } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { ProfileType } from "@/types/profile";
import { User } from "@supabase/supabase-js";

const QUERY_KEY = ["OWN_PROFILE"];

export const useOwnProfile = (user: User | null | undefined) => {
    return useQuery<ProfileType | null>({
        queryKey: QUERY_KEY,
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
