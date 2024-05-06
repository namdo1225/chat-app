import { InferType } from "yup";
import { requiredStr } from "./yup";
import * as y from "yup";

export const ChatSchema = y.object().shape({
    id: requiredStr,
    created_at: requiredStr,
    owner_id: requiredStr,
    name: requiredStr,
    description: requiredStr,
    public: y.boolean().required(),
})

export const ChatsSchema = y.array().of(ChatSchema).required();

export type Chat = InferType<typeof ChatSchema>;

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