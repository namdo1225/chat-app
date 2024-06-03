/**
 * Provides /users with function definitions to handle HTTP request.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase, PROFILE_IMAGE_BUCKET } from "@/supabase";
import { NODE_ENV } from "@/utils/config";

const router = Router();
const RANDOM_UUID = "00000000-0000-0000-0000-000000000000";

router.delete("/", async (_request, response) => {
    if (NODE_ENV === "production") response.status(404).json();
    await supabase.from("profiles").delete().neq("id", RANDOM_UUID);
    await supabase.from("chats").delete().neq("id", RANDOM_UUID);
    await supabase.from("chat_members").delete().neq("id", RANDOM_UUID);
    await supabase.from("friends").delete().neq("id", RANDOM_UUID);
    await supabase.from("messages").delete().neq("id", RANDOM_UUID);
    await supabase.storage.emptyBucket(PROFILE_IMAGE_BUCKET);

    return response.status(200).json({ message: "Done." });
});

export default router;
