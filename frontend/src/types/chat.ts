import { InferType } from "yup";
import { optionalStr, requiredStr } from "./yup";
import * as y from "yup";

export const CreateChatSchema = y.object().shape({
    name: requiredStr,
    description: optionalStr,
    public: y.boolean().required(),
    members: y.array().of(y.string().required()).required(),
});

export type CreateChat = InferType<typeof CreateChatSchema>;

export const ChatSchema = CreateChatSchema.omit(["members"]).shape({
    id: requiredStr,
    created_at: requiredStr,
    owner_id: requiredStr,
});

export const ChatsSchema = y.array().of(ChatSchema).required();

export const EditChatSchema = y.object().shape({
    name: optionalStr,
    description: optionalStr,
    owner_id: optionalStr,
    public: y.boolean().optional(),
});

export type EditChat = InferType<typeof EditChatSchema>;

export type Chat = InferType<typeof ChatSchema>;

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

export type BaseMsg = InferType<typeof BaseMsgSchema>;

export type HomeMsg = InferType<typeof HomeMsgSchema>;
