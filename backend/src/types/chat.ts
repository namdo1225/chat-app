import { setRequiredStr } from "./zod";
import z from "zod";

export const ChatSchema = z.object({
    id: setRequiredStr(),
    created_at: setRequiredStr(),
    owner_id: setRequiredStr(),
    name: setRequiredStr(),
    description: setRequiredStr(),
    public: z.boolean(),
});

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

export const ChatCreateSchema = z.object({
    name: setRequiredStr(),
    description: setRequiredStr(),
    owner_id: setRequiredStr(),
});

export const ChatsSchema = ChatSchema.array();

export type ChatCreateType = z.infer<typeof ChatSchema>;

export type Chat = z.infer<typeof ChatSchema>;