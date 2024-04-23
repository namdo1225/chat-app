import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { tokenExtractor } from "@/utils/middleware";

const router = Router();

router.post("/", tokenExtractor, async (request, response) => {
    await supabase.auth.admin.signOut(request.token as string);
    response.status(200).json("");
});

export default router;
