/**
 * Provides /friends with function definitions to handle HTTP request.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { logError } from "@/utils/logger";
import { tokenExtractor, userExtractor, paginationVerifier } from "@/utils/middleware";
import { BaseFriendSchema, FriendsSchema } from "@/types/friend";

const router = Router();
const FRIENDS = "friends";

router.get("/", tokenExtractor, userExtractor, paginationVerifier, async (request, response) => {
    const id = request.user.id;

    const { data: requestee, error: requesteeError } = await supabase
        .from(FRIENDS)
        .select(
            "*,profiles!friends_requestee_fkey(first_name, last_name, profile_photo, user_id, created_at, public_profile)"
        )
        .eq("requester", id)
        .order("last_name", { referencedTable: "profiles", ascending: true })
        .range(request.begin, request.end);

    if (requesteeError)
        return response.status(500).json({ error: requesteeError });

    const { data: requestor, error: requesterError } = await supabase
        .from(FRIENDS)
        .select(
            "*,profiles!friends_requester_fkey(first_name, last_name, profile_photo, user_id, created_at, public_profile)"
        )
        .eq("requestee", id)
        .order("last_name", { referencedTable: "profiles", ascending: true })
        .range(request.begin, request.end);

    if (requesterError)
        return response.status(500).json({ error: requesterError });

    const allRequests = FriendsSchema.parse(requestee.concat(requestor));
    const formattedRequests = allRequests.map((data) => {
        return {
            id: data.id,
            pending: data.pending,
            requester: data.requester,
            requestee: data.requestee,
            ...data.profiles,
        };
    });
    return response.status(200).json(formattedRequests);
});

router.post(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const userID = request.user.id;
        const friendID = request.params.id;
        if (friendID === userID)
            return response.status(400).json({
                error: "Requester's and requestee's ids are identitcal.",
            });

        const { data: friendProfile, error: friendProfileError } =
            await supabase.from("profiles").select("*").eq("user_id", friendID);

        if (friendProfile && friendProfile.length == 0)
            return response.status(400).json({
                error: "Requestee not found.",
            });
        else if (friendProfileError)
            return response.status(500).json({
                error: friendProfileError,
            });

        const { data: friendship, error: foundError } = await supabase
            .from(FRIENDS)
            .select()
            .or(
                `and(requester.eq.${userID},requestee.eq.${friendID}),and(requester.eq.${friendID},requestee.eq.${userID})`
            );

        // If they're already friends.
        if (friendship && friendship.length > 0)
            return response.status(400).json({
                error: "The users are already friends.",
            });
        else if (foundError)
            return response.status(500).json({
                error: foundError,
            });

        const { error } = await supabase
            .from(FRIENDS)
            .insert([
                {
                    requester: userID,
                    requestee: friendID,
                },
            ]);
        
        if (error)
            return response.status(500).json({ error });

        return response.status(200).json({message: "Friends request sent successfully."});
    }
);

router.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const userID = request.user.id;
        const friendRequestID = request.params.id;

        const { data, error: foundError } = await supabase
            .from(FRIENDS)
            .select("*")
            .eq("id", friendRequestID);

        if (foundError) return response.status(500).json({ error: foundError });

        if (data && data.length === 1) {
            const friendship = BaseFriendSchema.parse(data[0]);
            if (
                friendship.requestee === userID ||
                friendship.requester === userID
            ) {
                const { error: deleteError } = await supabase
                    .from(FRIENDS)
                    .delete()
                    .eq("id", friendRequestID);

                if (deleteError)
                    return response.status(500).json({ error: deleteError });

                return response.status(200).json({ message: "Friend request deleted." });
            }
        }

        return response.status(400).json({ error: "No friend request found." });
    }
);

router.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
    const userID = request.user.id;
    const friendRequestID = request.params.id;

    const { data, error: foundError } = await supabase
        .from(FRIENDS)
        .select("*")
        .eq("id", friendRequestID);

    if (foundError) return response.status(500).json({ error: foundError });

    if (data && data.length === 1) {
        const friendship = BaseFriendSchema.parse(data[0]);
        if (friendship.requestee === userID) {
            const { error: verifyError } = await supabase
                .from(FRIENDS)
                .update({ pending: false })
                .eq("id", friendRequestID);

            if (verifyError)
                return response.status(500).json({ error: verifyError });

            return response.status(200).json({ message: "Accepted pending friend request." });
        }
    }

    return response.status(400).json({ error: "No friend request found." });
});

export default router;
