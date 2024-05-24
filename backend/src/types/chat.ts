/**
 * Zod schemas for a chat data.
*/

import { setRequiredStr } from "./zod";
import z from "zod";

export const ChatCreateSchema = z.object({
    name: setRequiredStr(),
    description: setRequiredStr(),
    public: z.boolean(),
    members: z.string().array(),
});

export const ChatEditSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    owner_id: z.string().optional(),
    public: z.boolean().optional(),
    removeMembers: z.string().array().optional(),
    addMembers: z.string().array().optional(),
});

export const ChatSchema = ChatCreateSchema.omit({members: true}).extend({
    id: setRequiredStr(),
    created_at: setRequiredStr(),
    owner_id: setRequiredStr(),
});

export const ChatsSchema = ChatSchema.array();

export type Chat = z.infer<typeof ChatSchema>;