/**
 * Provides /users with function definitions to handle HTTP request.
 */

import "express-async-errors";
import { Router } from "express";
import { supabase, PROFILE_IMAGE_BUCKET } from "@/supabase";
import { NODE_ENV } from "@/utils/config";

const router = Router();
const RANDOM_UUID = "00000000-0000-0000-0000-000000000000";
const TEST_PARTIAL_USER_UUID = "90241aa1-9820-4499-bc05-1daff7c8043";

router.delete("/", async (_request, response) => {
    if (NODE_ENV === "production") response.status(404).json();
    const { data } = await supabase.auth.admin.listUsers();

    if (data) {
        data.users.forEach(async (user) => {
            if (!user.id.includes(TEST_PARTIAL_USER_UUID))
                await supabase.auth.admin.deleteUser(user.id);
        });
    }

    // await supabase.from("profiles").delete().neq("user_id", RANDOM_UUID);
    await supabase.from("chats").delete().neq("id", RANDOM_UUID);
    await supabase.from("chat_members").delete().neq("id", RANDOM_UUID);
    await supabase.from("friends").delete().neq("id", RANDOM_UUID);
    await supabase.from("messages").delete().neq("id", RANDOM_UUID);
    await supabase.storage.emptyBucket(PROFILE_IMAGE_BUCKET);

    return response.status(200).json({ message: "Done." });
});

export default router;
