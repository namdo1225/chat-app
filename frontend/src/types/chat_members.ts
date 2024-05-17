import { InferType } from "yup";
import { requiredStr } from "./yup";
import * as y from "yup";
import { ProfileSchema } from "./profile";

export const ChatMemberSchema = y.object().shape({
    id: requiredStr,
    chat_id: requiredStr,
    user_id: requiredStr,
});

export const ChatMembersSchema = y.array().of(ChatMemberSchema).required();

export type ChatMember = InferType<typeof ChatMemberSchema>;

export const ChatMemberProfileSchema = y.object().shape({
    id: requiredStr,
    chat_id: requiredStr,
    profiles: ProfileSchema
});

export const ChatMemberProfilesSchema = y
    .array()
    .of(ChatMemberProfileSchema)
    .required();

export type ChatMemberProfile = InferType<typeof ChatMemberProfileSchema>;
