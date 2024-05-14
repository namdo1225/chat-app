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
        const begin = z.coerce.number().parse(request.query.begin);
        const end = z.coerce.number().parse(request.query.end);
        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .order("sent_at", { ascending: false })
            .range(begin, end);

        const formattedMessages = ChatMsgSchema.array().parse(messages);

        if (error) return response.status(400).json(error);

        return response.json(formattedMessages);
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

        if (error) return response.status(400).json(error);

        return response.status(201).json(ChatMsgSchema.parse(newMessage[0]));
    }
);

router.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
    const { text } = MsgEditSchema.parse(request.body);

    const { data: editedMessage, error } = await supabase
        .from("messages")
        .update(text)
        .eq("id", request.params.id)
        .eq("from_user_id", request.user.id)
        .select();

    if (error) return response.status(404).json(error);

    return response.status(201).json(ChatMsgSchema.parse(editedMessage));
});

router.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const { error: deleteMessageError } = await supabase
            .from("messages")
            .delete()
            .eq("from_user_id", request.user.id)
            .eq("id", request.params.id);

        if (deleteMessageError)
            return response.status(400).json(deleteMessageError);

        return response.status(200).json({});
    }
);

export default router;
