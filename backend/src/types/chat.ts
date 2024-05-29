/**
 * Zod schemas for a chat data.
 */

import { optionalStr, setRequiredStr } from "./zod";
import z from "zod";

// Only show encryption option if chat is private.
export const ChatCreateSchema = z.object({
    name: setRequiredStr(),
    description: optionalStr,
    public: z.boolean(),
    members: z.string().array(),
    encrypted: z.boolean().optional(),
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
    id: setRequiredStr(),
    created_at: setRequiredStr(),
    owner_id: setRequiredStr(),
});

export const ChatsSchema = ChatSchema.array();

export type Chat = z.infer<typeof ChatSchema>;
