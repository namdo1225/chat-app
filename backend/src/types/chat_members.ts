import { setRequiredStr } from "./zod";
import { ChatSchema } from "./chat";
import z from "zod";

export const ChatMemberOnlySchema = z.object({
    id: setRequiredStr(),
    chat_id: setRequiredStr(),
    user_id: setRequiredStr(),
});

export const ChatMemberSchema = ChatMemberOnlySchema.extend({
    chats: ChatSchema,
});
