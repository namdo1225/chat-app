import { setRequiredStr } from "./zod";
import z from "zod";

export const ChatCreateSchema = z.object({
    name: setRequiredStr(),
    description: setRequiredStr(),
    public: z.boolean(),
});

export const ChatEditSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    owner_id: z.string().optional(),
    public: z.boolean().optional(),
});

export const ChatSchema = ChatCreateSchema.extend({
    id: setRequiredStr(),
    created_at: setRequiredStr(),
    owner_id: setRequiredStr(),
});

export const ChatsSchema = ChatSchema.array();

export const BaseMsgSchema = z.object({
    id: setRequiredStr(),
    sent_at: setRequiredStr(),
    text: setRequiredStr(),
});

export const ChatMsgSchema = BaseMsgSchema.extend({
    chat_id: setRequiredStr(),
    from_user_id: setRequiredStr(),
});

export const HomeMsgSchema = BaseMsgSchema.extend({
    chatter: setRequiredStr(),
});

export type HomeMsg = z.infer<typeof HomeMsgSchema>;

export type ChatCreateType = z.infer<typeof ChatSchema>;

export type Chat = z.infer<typeof ChatSchema>;