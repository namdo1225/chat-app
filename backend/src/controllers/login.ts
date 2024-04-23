import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { UserLoginSchema } from "@/types/user";
import { logError } from "@/utils/logger";

const router = Router();

router.post("/", async (request, response) => {
    const { email, password } = UserLoginSchema.parse(
        request.body
    );

    const { data: newUser, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        logError(error);
        return response.status(404).json(error);
    }

    return response.status(201).json(newUser);
});

export default router;
