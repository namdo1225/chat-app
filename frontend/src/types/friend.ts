import { InferType } from "yup";
import { ProfileSchema } from "./profile";
import { setRequiredStr } from "./yup";
import * as y from "yup";

export const FriendSchema = ProfileSchema.shape({
    id: setRequiredStr(),
    requester: setRequiredStr(),
    requestee: setRequiredStr(),
    pending: y.bool().required(),
});

export const FriendsSchema = y.array().of(FriendSchema).required();

export type Friend = InferType<typeof FriendSchema>;