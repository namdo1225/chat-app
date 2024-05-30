/**
 * Zod schemas for a chat data.
 */

import { optionalStr, setMinStr } from "./zod";
import z from "zod";

// Only show encryption option if chat is private.
// Of course, chats can't be made public if it is already encrypted.
export const ChatCreateSchema = z.object({
    name: setMinStr(),
    description: optionalStr,
    public: z.boolean(),
    members: z.string().array(),
    encrypted: z.boolean(),
    public_key: optionalStr,
});

export const ChatEditSchema = z.object({
    name: optionalStr,
    description: optionalStr,
    owner_id: optionalStr,
    public: z.boolean().optional(),
    removeMembers: z.string().array().optional(),
    addMembers: z.string().array().optional(),
});

export const ChatSchema = ChatCreateSchema.omit({ members: true }).extend({
    id: setMinStr(),
    created_at: setMinStr(),
    owner_id: setMinStr(),
});

export const ChatsSchema = ChatSchema.array();

export type Chat = z.infer<typeof ChatSchema>;
