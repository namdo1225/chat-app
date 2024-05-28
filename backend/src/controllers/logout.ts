/**
 * Provides /logout with a function definition to handle POST requests.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { tokenExtractor } from "@/utils/middleware";

const router = Router();

router.post("/", tokenExtractor, async (request, response) => {
    const { error } = await supabase.auth.admin.signOut(
        request.token as string
    );
    if (error)
        return response
            .status(500)
            .json({ error: "Cannot invalidate session token" });

    return response
        .status(200)
        .json({ message: "User logged out successfully." });
});

export default router;
