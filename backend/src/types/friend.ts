import { z } from "zod";
import { ProfileSchema } from "./profile";
import { setRequiredStr } from "./zod";

export const BaseFriendSchema = z.object({
    id: setRequiredStr(),
    requester: setRequiredStr(),
    requestee: setRequiredStr(),
    pending: z.boolean(),
});


export const FriendSchema = BaseFriendSchema.extend({
    profiles: ProfileSchema, 
});

export const FriendsSchema = FriendSchema.array();