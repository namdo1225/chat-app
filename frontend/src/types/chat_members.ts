import { InferType } from "yup";
import { requiredStr } from "./yup";
import * as y from "yup";

export const ChatMemberSchema = y.object().shape({
    id: requiredStr,
    chat_id: requiredStr,
    user_id: requiredStr,
});

export const ChatMembersSchema = y.array().of(ChatMemberSchema).required();

export type ChatMember = InferType<typeof ChatMemberSchema>;