/**
 * Provides /resend with a function definition to handle POST HTTP requests.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { ResendPathSchema } from "@/types/zod";
import { REDIRECT_URL } from "@/utils/config";
import { hcaptchaVerifier } from "@/utils/middleware";

const router = Router();

router.post("/", hcaptchaVerifier, async (request, response) => {
    const { email, action } = ResendPathSchema.parse(request.body);

    if (action === "CONFIRMATION") {
        await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: REDIRECT_URL,
            },
        });

        // Do NOT let frontend know if request failed.
        return response
            .status(200)
            .json({ message: "Confirmation email sent if account exists." });
    } else if (action === "RESET PASSWORD") {
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${REDIRECT_URL}/resetpassword`,
        });

        // Do NOT let frontend know if request failed.
        return response
            .status(200)
            .json({ message: "Password reset email sent if account exists." });
    }

    return response
        .status(400)
        .json({ error: "action field must be defined in request body." });
});

export default router;
