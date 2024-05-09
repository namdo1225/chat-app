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

router.get("/", tokenExtractor, userExtractor, async (request, response) => {
    const getAllPublic = request.query.getAllPublic === "true";
    const begin = z.coerce.number().parse(request.query.begin);
    const end = z.coerce.number().parse(request.query.end);

    const { data: chatMembers, error } = getAllPublic
        ? await supabase
              .from("chats")
              .select("*")
              .eq("public", true)
              .order("name", { ascending: true })
              .range(begin, end)
        : await supabase
              .from("chat_members")
              .select("*,chats(*)")
              .eq("user_id", request.user.id)
              .order("name", { referencedTable: "chats", ascending: true })
              .range(begin, end);

    const formattedChats = ChatMemberSchema.array().parse(chatMembers);
    const returnedChats = formattedChats.map(member => member.chats);

    if (error) return response.status(400).json(error);

    return response.json(returnedChats);
});

router.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    chatExtractor,
    async (request, response) => {
        const { error: deleteError } = await supabase
            .from("chats")
            .delete()
            .eq("id", request.chat.id);

        if (deleteError)
            return response.status(400).json({ error: deleteError });

        const { error: deleteMemberError } = await supabase
            .from("chat_members")
            .delete()
            .eq("chat_id", request.chat.id);

        if (deleteError)
            return response.status(400).json({ error: deleteMemberError });

        return response.status(200).json({});
    }
);

export default router;
