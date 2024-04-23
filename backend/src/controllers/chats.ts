import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { ChatCreateSchema } from "@/types/chat";
import { logError } from "@/utils/logger";
//import multer from "multer";
//import { unlink } from "fs";
//import { fileResultHandler } from "@/utils/handler";
import {
    tokenExtractor,
    userExtractor,
    chatExtractor,
} from "@/utils/middleware";

const router = Router();
//const upload = multer({ dest: "uploads/" });

router.get("/", tokenExtractor, userExtractor, async (request, response) => {
    const { data: chats } = await supabase
        .from("chat_members")
        .select("chats(id, owner_id, name, description)")
        .eq("user_id", request.user.id);

    return response.json(chats);
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

// Assuming 'photo' is the name of our profile picture field in the form
// upload.single("photo")
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

/*
router.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
    const { name, description, owner_id } = ChatCreateSchema.parse(
        request.body
    );

    const editedData: {
        name?: string;
        description?: string;
        owner_id?: string;
    } = {};

    if (owner_id) editedData.owner_id = owner_id;
    if (name) editedData.name = name;
    if (description) editedData.description = description;
    const { data: newProfile, error } = await supabase
        .from("profiles")
        .update(editedData)
        .eq("user_id", foundUser.user.id)
        .select();

    if (error) {
        logError(error);
        return response.status(404).json(error);
    }

    return response.status(201).json(newProfile);

    return response.status(404).json({ error: "user id not found" });
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
*/
export default router;