import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { ChatCreateSchema, ChatsSchema } from "@/types/chat";
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
            .order("name", { referencedTable: "chats",  ascending: true })
            .range(begin, end);

    return response.json(ChatsSchema.parse(chats));
});

router.get(
    "/:id",
    tokenExtractor,
    userExtractor,
    chatExtractor,
    (request, response) => {
        return response.json(request.chat);
    }
);

router.post("/", tokenExtractor, userExtractor, async (request, response) => {
    const { name, description } = ChatCreateSchema.parse(request.body);

    const newChat: { name?: string; description?: string; owner_id?: string } =
        {
            owner_id: request.user.id,
            name,
            description,
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

router.put("/:id", tokenExtractor, userExtractor, chatExtractor, async (request, response) => {
    if (request.chat.owner_id !== request.user.id)
        return response.status(400).json({error: "You do not have authorization to make this request."); 
        
    const { name, description, owner_id } = ChatCreateSchema.parse(
        request.body
    );

    // also ensures new owner is a chat member if owner_id !== request.chat.owner_id
    
    const editedData: {
        name?: string;
        description?: string;
        owner_id?: string;
    } = {};

    if (owner_id && owner_id !== request.chat.owner_id) editedData.owner_id = owner_id;
    if (name) editedData.name = name;
    if (description) editedData.description = description
        
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
});

router.delete("/", async (request, response) => {
    const authorization = z.string().parse(request.headers.authorization);
    if (!authorization.startsWith("Bearer "))
        return response
            .status(404)
            .json({ error: "No bearer access token provided" });

    const access_token = authorization.split(" ")[1];

    const { data: foundUser } = await supabase.auth.getUser(access_token);

    if (foundUser?.user?.id) {
        const { data, error } = await supabase.auth.admin.deleteUser(
            foundUser.user?.id
        );

        if (error) {
            logError(error);
            return response.status(404).json(error);
        }

        return response.status(200).json(data);
    }

    return response.status(404).json({ error: "user id not found" });
});

export default router;
