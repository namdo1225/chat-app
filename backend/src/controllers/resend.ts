/**
 * Provides /resend with a function definition to handle POST HTTP requests.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { ResendPathSchema } from "@/types/zod";
import { logError } from "@/utils/logger";
import { REDIRECT_URL } from "@/utils/config";
import { hcaptchaVerifier } from "@/utils/middleware";

const router = Router();

router.post("/", hcaptchaVerifier, async (request, response) => {
    const { email, action } = ResendPathSchema.parse(request.body);

    if (action === "CONFIRMATION") {
        const { data, error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: REDIRECT_URL,
            },
        });

        if (error) {
            logError(error);
            return response.status(404).json({ error: "Error occured" });
        }

        return response.status(200).json({ message: data });
    } else if (action === "RESET PASSWORD") {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `${REDIRECT_URL}/resetpassword`,
            }
        );

        if (error) {
            logError(error);
            return response.status(404).json({ error: "Error occured" });
        }

        return response.status(200).json({ message: data });
    }

    return response
        .status(400)
        .json({ error: "action field must be defined in request body." });
});

export default router;
