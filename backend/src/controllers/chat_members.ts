import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import {
    ChatCreateSchema,
    ChatEditSchema,
    ChatMemberSchema,
    ChatSchema,
} from "@/types/chat";
import { logError } from "@/utils/logger";
import z from "zod";
import {
    tokenExtractor,
    userExtractor,
    chatExtractor,
} from "@/utils/middleware";

const router = Router();

router.get("/:chatID", tokenExtractor, userExtractor, async (request, response) => {
    const chatID = request.params.chatID;

    const { data: chatMembers, error } = await supabase
        .from("chat_members")
        .select()
        .eq("chat_id", chatID)
    if (error) return response.status(400).json(error);
    
    const formattedChatMembers = ChatMemberSchema.parse(chatMembers);
    
    if (formattedChatMembers.find(member => member.user_id === request.user.id)) {
        return response.status(200).json(formattedChatMembers.filter(member => member.user_id === request.user.id));
    }

    return response.status(400).json({error: "You are not authorized to perform this action".);
});

router.delete(
    "/:chatID",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const chatID = request.params.chatID;
        
        const { error: deleteMemberError } = await supabase
            .from("chat_members")
            .delete()
            .eq("chat_id", chatID)
            .eq("user_id", request.user.id);

        if (deleteError)
            return response.status(400).json({ error: deleteMemberError });

        return response.status(200).json({});
    }
);

export default router;
