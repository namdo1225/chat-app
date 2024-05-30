/**
 * Zod schemas for a friend member data.
 */

import { z } from "zod";
import { ProfileSchema } from "./profile";
import { setMinStr } from "./zod";

export const BaseFriendSchema = z.object({
    id: setMinStr(),
    requester: setMinStr(),
    requestee: setMinStr(),
    pending: z.coerce.boolean(),
});

export const FriendSchema = BaseFriendSchema.extend({
    profiles: ProfileSchema,
});

export const FriendsSchema = FriendSchema.array();
