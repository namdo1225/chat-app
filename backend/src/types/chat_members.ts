/**
 * Zod schemas for a chat member data.
 */

import { setRequiredStr } from "./zod";
import { ChatSchema } from "./chat";
import { ProfileSchema } from "./profile";
import z from "zod";

export const ChatMemberOnlySchema = z.object({
    id: setRequiredStr(),
    chat_id: setRequiredStr(),
    user_id: setRequiredStr(),
});

export const ChatMemberSchema = ChatMemberOnlySchema.extend({
    chats: ChatSchema,
});

export const ChatMemberProfileSchema = ChatMemberOnlySchema.omit({
    user_id: true,
}).extend({
    profiles: ProfileSchema,
});

export const ChatMemberProfilesSchema = ChatMemberProfileSchema.array();
