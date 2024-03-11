import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { ResendPathSchema } from "@/types/zod";
import { logError } from "@/utils/logger";

const router = Router();

router.post("/", async (request, response) => {
    if (!supabase) return response.status(500).json({error: 500});

    const { email, action } = ResendPathSchema.parse(request.body);

    if (action === "CONFIRMATION") {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: 'https://localhost:3000'
            }
        });

        if (error) {
            logError(error);
            return response.status(404).json({error: "Error occured"});
        }
    
        return response.status(200).json({message: data});
    } else if (action === "RESET PASSWORD") {
        const { data, error } =
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://localhost:3000'
        });

        if (error) {
            logError(error);
            return response.status(404).json({error: "Error occured"});
        }
    
        return response.status(200).json({message: data});
    }

    return response.status(400).json({error: "action field must be defined in request body."});
});

export default router;
