/**
 * Provides /chat-members with function definitions to handle HTTP request.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import {
    chatMemberExtractor,
    tokenExtractor,
    userExtractor,
} from "@/utils/middleware";
import {
    ChatMemberOnlySchema,
    ChatMemberProfilesSchema,
} from "@/types/chat_members";
import { ChatSchema } from "@/types/chat";

const router = Router();

router.get(
    "/:chatID",
    tokenExtractor,
    userExtractor,
    chatMemberExtractor,
    async (request, response) => {
        const chatID = request.params.chatID;
        const retrieveProfile = request.query.retrieveProfile === "true";

        if (!retrieveProfile) {
            const { data: chatMembers, error } = await supabase
                .from("chat_members")
                .select()
                .eq("chat_id", chatID)
                .neq("user_id", request.user.id);

            if (error) return response.status(500).json({ error });

            const formattedChatMembers =
                ChatMemberOnlySchema.array().parse(chatMembers);

            return response.status(200).json(formattedChatMembers);
        } else {
            const { data: chatMembers, error } = await supabase
                .from("chat_members")
                .select("id,chat_id,profiles(*)")
                .eq("chat_id", chatID)
                .neq("user_id", request.user.id);

            if (error) return response.status(500).json({ error });

            const formattedChatMembers =
                ChatMemberProfilesSchema.parse(chatMembers);
            return response.status(200).json(formattedChatMembers);
        }
    }
);

router.post(
    "/:chatID",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const chatID = request.params.chatID;


        const { data: foundMembership, error: foundMembershipError } =
            await supabase
                .from("chat_members")
                .select()
                .eq("chat_id", chatID)
                .eq("user_id", request.user.id)
                .select();

        if (foundMembershipError)
            return response.status(500).json({ error: foundMembershipError });

        if (foundMembership.length > 0)
            return response
                .status(400)
                .json({ error: "You already joined this chat group." });

        const { error } = await supabase
            .from("chat_members")
            .insert([{ user_id: request.user.id, chat_id: chatID }])
            .eq("chat_id", chatID)
            .eq("public", true);


        if (error) return response.status(500).json({ error });

        return response.status(201).json();
    }
);

router.delete(
    "/:chatID",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const chatID = request.params.chatID;

        const { data: chat, error: chatError } = await supabase
            .from("chats")
            .select("*")
            .eq("id", chatID);

        if (chatError) return response.status(500).json({ error: chatError });

        const formattedChat = ChatSchema.parse(chat[0]);
        if (formattedChat.owner_id === request.user.id)
            return response.status(400).json({
                error: "You are the owner of this chat. You cannot leave this chat.",
            });

        const { error: deleteMemberError } = await supabase
            .from("chat_members")
            .delete()
            .eq("chat_id", chatID)
            .eq("user_id", request.user.id);

        if (deleteMemberError)
            return response.status(500).json({ error: deleteMemberError });

        return response.status(200).json({ message: "Membership deleted." });
    }
);

export default router;
