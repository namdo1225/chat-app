/**
 * Zod schemas for a profile data.
 */

import { z } from "zod";
import { first_name, last_name, setMinStr } from "./zod";

export const ProfileSchema = z.object({
    first_name,
    last_name,
    profile_photo: setMinStr(),
    user_id: setMinStr(),
    created_at: setMinStr(),
    public_profile: z.coerce.boolean(),
});

export const ProfilesSchema = ProfileSchema.array();

export type Profile = z.infer<typeof ProfileSchema>;
