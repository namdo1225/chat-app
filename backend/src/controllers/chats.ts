import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { ChatCreateSchema, ChatEditSchema, ChatsSchema } from "@/types/chat";
import { logError } from "@/utils/logger";
import z from "zod";
import {
    tokenExtractor,
    userExtractor,
    chatExtractor,
} from "@/utils/middleware";

const router = Router();

router.get("/", tokenExtractor, userExtractor, async (request, response) => {
    const getAllPublic = z.coerce.boolean().parse(request.query.getAllPublic);
    const begin = z.coerce.number().parse(request.query.begin);
    const end = z.coerce.number().parse(request.query.end);

    const { data: chats } = getAllPublic
        ? await supabase
            .from("chats")
            .select("*")
            .eq("public", true)
            .order("name", { ascending: true })
            .range(begin, end)
        : await supabase
            .from("chat_members")
            .select("chats(*)")
            .eq("user_id", request.user.id)
            .order("name", { referencedTable: "chats", ascending: true })
            .range(begin, end);

    return response.json(ChatsSchema.parse(chats));
});

router.get(
    "/:id",
    tokenExtractor,
    userExtractor,
    chatExtractor,
    (request, response) => {
        if (request.chat.owner_id !== request.user.id)
            response.status(400).json({
                error: "You do not have authorization to make this request.",
            });

        return response.json(request.chat);
    }
);

router.post("/", tokenExtractor, userExtractor, async (request, response) => {
    const {
        name,
        description,
        public: publicChat,
    } = ChatCreateSchema.parse(request.body);

    const newChat: {
        name: string;
        description?: string;
        owner_id: string;
        public: boolean;
    } = {
        name,
        description,
        owner_id: request.user.id,
        public: publicChat,
    };

    if (!name)
        return response
            .status(404)
            .json({ error: "A chat name must be included." });

    if (!description) delete newChat.description;

    const { data: newCreatedChat, error } = await supabase
        .from("chats")
        .insert([newChat])
        .select();

    if (error) {
        logError(error);
        return response.status(404).json(error);
    }

    return response.status(201).json(newCreatedChat);
});

router.put(
    "/:id",
    tokenExtractor,
    userExtractor,
    chatExtractor,
    async (request, response) => {
        if (request.chat.owner_id !== request.user.id)
            return response.status(400).json({
                error: "You do not have authorization to make this request.",
            });

        const {
            name,
            description,
            public: publicChat,
            owner_id
        } = ChatEditSchema.parse(request.body);

        // also ensures new owner is a chat member if
        // owner_id !== request.chat.owner_id
        const editedData: {
            name?: string;
            description?: string;
            owner_id?: string;
            public?: boolean
        } = {};

        if (owner_id && owner_id !== request.chat.owner_id)
            editedData.owner_id = owner_id;
        if (name) editedData.name = name;
        if (description) editedData.description = description;
        if (publicChat) editedData.public = publicChat;

        const { data: editedChat, error } = await supabase
            .from("chats")
            .update(editedData)
            .eq("id", request.chat.id)
            .select();

        if (error) {
            logError(error);
            return response.status(404).json(error);
        }

        return response.status(201).json(editedChat);
    }
);

router.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    chatExtractor,
    async (request, response) => {
        if (request.chat.owner_id !== request.user.id)
            return response.status(400).json({
                error: "You do not have authorization to make this request.",
            });

        const { error: deleteError } = await supabase
            .from("chats")
            .delete()
            .eq("id", request.chat.id);

        if (deleteError)
            return response.status(400).json({ error: deleteError });

        return response.status(200).json({});
    }
);

export default router;
