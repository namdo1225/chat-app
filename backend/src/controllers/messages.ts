/**
 * Provides /messages with function definitions to handle HTTP request.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import {
    tokenExtractor,
    userExtractor,
    chatMemberExtractor,
} from "@/utils/middleware";
import { ChatMsgSchema, MsgEditSchema } from "@/types/message";
import z from "zod";

const router = Router();

router.get(
    "/:chatID",
    tokenExtractor,
    userExtractor,
    chatMemberExtractor,
    async (request, response) => {
        const chatID = request.params.chatID;

        const beforeTimestamp = z.coerce
            .string()
            .parse(request.query.beforeTimestamp);
        const numLimit = z.coerce.number().parse(request.query.limit);
        const limit = numLimit < 10 ? numLimit : 10;

        if (!beforeTimestamp)
            return response.status(400).json({
                error: "This API route needs a beforeTimestamp in your query.",
            });

        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatID)
            .order("sent_at", { ascending: false })
            .lt("sent_at", `${beforeTimestamp.slice(0, -6)}Z`)
            .limit(limit);

        const formattedMessages = ChatMsgSchema.array().parse(messages);

        if (error) return response.status(500).json({ error });

        return response.status(200).json(formattedMessages);
    }
);

router.post(
    "/:chatID",
    tokenExtractor,
    userExtractor,
    chatMemberExtractor,
    async (request, response) => {
        const { text } = MsgEditSchema.parse(request.body);

        const { data: newMessage, error } = await supabase
            .from("messages")
            .insert([
                {
                    from_user_id: request.user.id,
                    text,
                    chat_id: request.params.chatID,
                },
            ])
            .select();

        if (error) return response.status(500).json({ error });

        return response.status(201).json(ChatMsgSchema.parse(newMessage[0]));
    }
);

router.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
    const { text } = MsgEditSchema.parse(request.body);

    const { data: editedMessage, error } = await supabase
        .from("messages")
        .update({ text: text })
        .eq("id", request.params.id)
        .eq("from_user_id", request.user.id)
        .select();

    if (error) return response.status(500).json(error);

    if (editedMessage && editedMessage.length === 1)
        return response.status(201).json(ChatMsgSchema.parse(editedMessage[0]));

    return response.status(400).json({ error: "No messages found" });
});

router.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const { error: deleteMessageError } = await supabase
            .from("messages")
            .delete()
            .eq("id", request.params.id)
            .eq("from_user_id", request.user.id);

        if (deleteMessageError)
            return response.status(500).json(deleteMessageError);

        return response.status(200).json({ message: "Message deleted." });
    }
);

export default router;
