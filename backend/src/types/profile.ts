import { z } from "zod";
import { first_name, last_name, setRequiredStr } from "./zod";

export const ProfileSchema = z.object({
    first_name,
    last_name,
    profile_photo: setRequiredStr(),
    user_id: setRequiredStr(),
    created_at: setRequiredStr(),
    public_profile: z.boolean(),
});

export const ProfilesSchema = ProfileSchema.array();