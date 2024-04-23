import { InferType } from "yup";
import { requiredStr } from "./yup";
import * as y from "yup";

export const BaseMsgSchema = y.object().shape({
    id: requiredStr,
    sent_at: requiredStr,
    text: requiredStr,
})

export const ChatMsgSchema = BaseMsgSchema.shape({
    chat_id: requiredStr,
    from_user_id: requiredStr,
})

export const HomeMsgSchema = BaseMsgSchema.shape({
    chatter: requiredStr,
})

export type BaseMsg = InferType<typeof BaseMsgSchema>;

export type HomeMsg = InferType<typeof HomeMsgSchema>;