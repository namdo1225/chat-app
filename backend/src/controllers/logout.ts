import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { z } from "zod";
import { logError } from "@/utils/logger";

const router = Router();

router.post("/", async (request, response) => {
    if (!supabase) return response.status(500).json({error: 500});

    const authorization = z.string().parse(request.headers.authorization);
    if (!authorization.startsWith("Bearer "))
        return response
            .status(404)
            .json({ error: "No bearer access token provided" });

    const access_token = authorization.split(" ")[1];

    const { data: foundUser } = await supabase.auth.getUser(access_token);

    if (foundUser?.user?.id) {
        const { error } = await supabase.auth.signOut();
        if (error) {
            logError(error);
            return response.status(400).json(error);
        }

        return response.status(200).json();
    }

    return response.status(404).json({ error: "user id not found or invalid access token" });
});

export default router;
