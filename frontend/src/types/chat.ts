/**
 * Yup schemas for a chat data.
*/

import { InferType } from "yup";
import { optionalStr, requiredStr } from "./yup";
import * as y from "yup";

export const CreateChatSchema = y.object().shape({
    name: requiredStr,
    description: optionalStr,
    public: y.boolean().required(),
    members: y.array().of(y.string().required()).required(),
    encrypted: y.boolean().required(),
    public_key: optionalStr,
});

export type CreateChat = InferType<typeof CreateChatSchema>;

export const ChatSchema = CreateChatSchema.omit(["members"]).shape({
    id: requiredStr,
    created_at: requiredStr,
    owner_id: requiredStr,
});

export const ChatsSchema = y.array().of(ChatSchema).required();

export const EditChatSchema = y.object().shape({
    name: optionalStr,
    description: optionalStr,
    owner_id: optionalStr,
    public: y.boolean().optional(),
    removeMembers: y.array().of(y.string()).required(),
    addMembers: y.array().of(y.string()).required(),
});

export type EditChat = InferType<typeof EditChatSchema>;

export type Chat = InferType<typeof ChatSchema>;
