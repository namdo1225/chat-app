import { setRequiredStr } from "./zod";
import z from "zod";

export const MsgEditSchema = z.object({
    text: setRequiredStr(),
});

export const BaseMsgSchema = MsgEditSchema.extend({
    id: setRequiredStr(),
    sent_at: setRequiredStr(),
});

export const ChatMsgSchema = BaseMsgSchema.extend({
    chat_id: setRequiredStr(),
    from_user_id: setRequiredStr(),
});

export const HomeMsgSchema = BaseMsgSchema.extend({
    chatter: setRequiredStr(),
});

export type HomeMsg = z.infer<typeof HomeMsgSchema>;