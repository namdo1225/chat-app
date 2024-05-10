import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import {
    ChatCreateSchema,
    ChatEditSchema,
    ChatSchema,
} from "@/types/chat";
import { logError } from "@/utils/logger";
import z from "zod";
import {
    tokenExtractor,
    userExtractor,
    chatExtractor,
} from "@/utils/middleware";
import { ChatMemberSchema } from "@/types/chat_members";

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
    const {
        name,
        description,
        public: publicChat,
        members,
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
            .status(400)
            .json({ error: "A chat name must be included." });

    if (!description) delete newChat.description;

    if (members.length !== 0) {
        const memberStr = members.toString();
        const { data: friends, error: friendError } = await supabase
            .from("friends")
            .select()
            .eq("pending", false)
            .or(
                `and(requestee.eq.${request.user.id},requester.in.(${memberStr})),and(requester.eq.${request.user.id},requestee.in.(${memberStr}))`
            );

        if (friendError) {
            logError(friendError);
            return response.status(400).json(friendError);
        }

        if (friends.length !== members.length)
            return response.status(400).json({
                error: "You can only add non-pending friends to private chats.",
            });
    }

    const { data: newCreatedChat, error } = await supabase
        .from("chats")
        .insert([newChat])
        .select();

    if (error) {
        logError(error);
        return response.status(400).json(error);
    }

    const createdChat = ChatSchema.parse(newCreatedChat[0]);

    if (members.length !== 0) {
        const membersData = members.map((member) => ({
            user_id: member,
            chat_id: createdChat.id,
        }));

        const { error: memberError } = await supabase
            .from("chat_members")
            .insert([
                ...membersData,
                { user_id: request.user.id, chat_id: createdChat.id },
            ])
            .select();

        if (memberError) {
            logError(memberError);
            return response.status(400).json(memberError);
        }
    } else {
        const { error: memberSelfError } = await supabase
            .from("chats_members")
            .insert([{ user_id: request.user.id, chat_id: createdChat.id }])
            .select();

        if (memberSelfError) {
            logError(memberSelfError);
            return response.status(400).json(memberSelfError);
        }
    }

    return response.status(201).json(newChat);
});

router.put(
    "/:id",
    tokenExtractor,
    userExtractor,
    chatExtractor,
    async (request, response) => {
        const {
            name,
            description,
            public: publicChat,
            owner_id,
            removeMembers,
            addMembers,
        } = ChatEditSchema.parse(request.body);

        // ensures new owner is a chat member
        if (owner_id !== request.chat.owner_id) {
            const { data: chatMembers, error: chatMemberError } = await supabase
                .from("chat_members")
                .select()
                .eq("chat_id", request.chat.id)
                .eq("user_id", owner_id);

            if (chatMemberError) {
                logError(chatMemberError);
                return response.status(400).json(chatMemberError);
            }

            if (!chatMembers || chatMembers.length === 0)
                return response.status(400).json({
                    error: "New chat owner is not a member of the chat.",
                });
        }

        const editedData: {
            name?: string;
            description?: string;
            owner_id?: string;
            public?: boolean;
        } = {};

        if (owner_id && owner_id !== request.chat.owner_id)
            editedData.owner_id = owner_id;
        if (name) editedData.name = name;
        if (description) editedData.description = description;
        if (publicChat) editedData.public = publicChat;

        // add members:
        if (addMembers && addMembers.length !== 0) {
            const memberStr = addMembers.toString();

            // Check if any potential new members are already in the chat
            const { data: chatMembers, error: chatMemberError } = await supabase
                .from("chat_members")
                .select()
                .eq("chat_id", request.chat.id)
                .in("user_id", addMembers);

            if (chatMemberError) {
                logError(chatMemberError);
                return response.status(400).json(chatMemberError);
            }

            if (chatMembers.length !== 0)
                return response.status(400).json({
                    error: "A user you are trying to add is already in the chat.",
                });

            // Ensures new members are friends with the user
            const { data: friends, error: friendError } = await supabase
                .from("friends")
                .select()
                .or(
                    `and(requestee.eq.${request.user.id},requester.in.(${memberStr})), and(requester.eq.${request.user.id},requestee.in.(${memberStr}))`
                );

            if (friendError) {
                logError(friendError);
                return response.status(400).json(friendError);
            }

            if (friends.length !== addMembers.length)
                return response.status(400).json({
                    error: "You can only add non-pending friends to private chats.",
                });

            const membersData = addMembers.map((member) => ({
                user_id: member,
                chat_id: request.chat.id,
            }));

            const { error: memberError } = await supabase
                .from("chat_members")
                .insert([
                    ...membersData,
                    { user_id: request.user.id, chat_id: request.chat.id },
                ])
                .select();

            if (memberError) {
                logError(memberError);
                return response.status(400).json(memberError);
            }
        }

        // remove members:
        if (removeMembers && removeMembers.length !== 0) {
            const { error: deleteError } = await supabase
                .from("chat_members")
                .delete()
                .in("user_id", removeMembers)
                .eq("chat_id", request.chat.id);

            if (deleteError) {
                logError(deleteError);
                return response.status(400).json(deleteError);
            }
        }

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
