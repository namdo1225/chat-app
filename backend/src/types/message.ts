/**
 * Zod schemas for a message data.
*/

import { setMinStr } from "./zod";
import z from "zod";

export const MsgEditSchema = z.object({
    text: setMinStr(),
});

export const BaseMsgSchema = MsgEditSchema.extend({
    id: setMinStr(),
    sent_at: setMinStr(),
});

export const ChatMsgSchema = BaseMsgSchema.extend({
    chat_id: setMinStr(),
    from_user_id: setMinStr(),
});

export const HomeMsgSchema = BaseMsgSchema.extend({
    chatter: setMinStr(),
});

export type HomeMsg = z.infer<typeof HomeMsgSchema>;