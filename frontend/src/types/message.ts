/**
 * Yup schemas for a message data.
*/

import { InferType } from "yup";
import { optionalStr, requiredStr } from "./yup";
import * as y from "yup";

export const BaseMsgSchema = y.object().shape({
    id: requiredStr,
    sent_at: requiredStr,
    text: requiredStr,
});

export const ChatMsgSchema = BaseMsgSchema.shape({
    chat_id: requiredStr,
    from_user_id: requiredStr,
});

export const HomeMsgSchema = BaseMsgSchema.shape({
    chatter: requiredStr,
});

export const FrontendMsgSchema = ChatMsgSchema.shape({
    chatter: requiredStr,
    from_user_id: optionalStr,
});

export type BaseMsg = InferType<typeof BaseMsgSchema>;

export type HomeMsg = InferType<typeof HomeMsgSchema>;

export type ChatMsg = InferType<typeof ChatMsgSchema>;

export type FrontendMsg = InferType<typeof FrontendMsgSchema>;

export const ChatMsgsSchema = y.array().of(ChatMsgSchema).required();