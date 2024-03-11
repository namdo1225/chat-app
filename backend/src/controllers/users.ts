import "express-async-errors";
import { Router } from "express";
import { supabase } from "@/supabase";
import { UserRegisterSchema, UserChangeSchema } from "@/types/zod";
import { logError } from "@/utils/logger";
import { z } from "zod";

const router = Router();

router.get("/", async (_request, response) => {
    if (!supabase) return response.status(500);

    const { data: profiles } = await supabase.from("profiles").select("*");
    return response.json(profiles);
});

router.post("/", async (request, response) => {
    if (!supabase) return response.status(500);
    const { first_name, last_name, email, password } =
        UserRegisterSchema.parse(request.body);

    const { data: newUser } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name,
                last_name,
            },
        },
    });

    const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert([{ first_name, last_name, user_id: newUser.user?.id }])
        .select();

    if (error) {
        logError(error);
        return response.status(404).json(error);
    }

    return response.status(201).json(newProfile);
});

router.put("/", async (request, response) => {
    if (!supabase) return response.status(500);

    const authorization = z.string().parse(request.headers.authorization);
    if (!authorization.startsWith("Bearer "))
        return response
            .status(404)
            .json({ error: "No bearer access token provided" });
    const access_token = authorization.split(" ")[1];
    const { data: foundUser } = await supabase.auth.getUser(access_token);

    if (foundUser?.user?.id) {
        const { first_name, last_name, email, password } =
            UserChangeSchema.parse(request.body);

        const editedData: { first_name?: string; last_name?: string } = {};

        if (first_name) editedData.first_name = first_name;
        if (last_name) editedData.last_name = last_name;

        const editedUser: {
            email?: string;
            password?: string;
            data?: object;
        } = {};

        if (email) editedUser.email = email;
        if (password) editedUser.password = password;
        if (editedData) editedUser.data = editedData;

        const { error: updateUserError } =
            await supabase.auth.updateUser(editedUser);

        if (updateUserError) {
            logError(updateUserError);
            return response.status(404).json(updateUserError);
        }

        const { data: newProfile, error } = await supabase
            .from("profiles")
            .update(editedData)
            .eq("user_id", foundUser.user.id)
            .select();

        if (error) {
            logError(error);
            return response.status(404).json(error);
        }

        return response.status(201).json(newProfile);
    }

    return response.status(404).json({ error: "user id not found" });
});

router.delete("/", async (request, response) => {
    if (!supabase) return response.status(500);

    const authorization = z.string().parse(request.headers.authorization);
    if (!authorization.startsWith("Bearer "))
        return response
            .status(404)
            .json({ error: "No bearer access token provided" });

    const access_token = authorization.split(" ")[1];

    const { data: foundUser } = await supabase.auth.getUser(access_token);

    if (foundUser?.user?.id) {
        const { data, error } = await supabase.auth.admin.deleteUser(
            foundUser.user?.id
        );

        if (error) {
            logError(error);
            return response.status(404).json(error);
        }

        return response.status(200).json(data);
    }

    return response.status(404).json({ error: "user id not found" });
});

export default router;
