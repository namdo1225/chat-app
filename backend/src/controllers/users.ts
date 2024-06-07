/**
 * Provides /users with function definitions to handle HTTP request.
 */

import "express-async-errors";
import { Router } from "express";
import {
    supabase,
    PROFILE_IMAGE_BUCKET,
    DEFAULT_PROFILE_URL,
} from "@/supabase";
import { UserRegisterSchema, UserChangeSchema } from "@/types/user";
import { ProfilesSchema } from "@/types/profile";
import {
    imageParser,
    tokenExtractor,
    userExtractor,
    hcaptchaVerifier,
    profileImgEditor,
    paginationVerifier,
} from "@/utils/middleware";
import { cacheData } from "@/utils/cache";
import redisClient from "@/utils/redis";
import { NODE_ENV, REDIRECT_URL, SUPABASE_DEFAULT_PIC } from "@/utils/config";
import { randomUUID } from "crypto";

const router = Router();

router.get("/", paginationVerifier, async (request, response) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .is("public_profile", true)
        .order("last_name")
        .range(request.begin, request.end);

    if (error)
        return response.status(500).json({ error: "Error retrieving users." });

    const profiles = ProfilesSchema.parse(data);
    return response.status(200).json(profiles);
});

router.get("/:id", tokenExtractor, userExtractor, async (request, response) => {
    if (request.params.id !== request.user.id)
        return response
            .status(400)
            .json({ error: "You are not authorized to perform this action." });

    const data = await cacheData(request.params.id, async () =>
        supabase.from("profiles").select("*").eq("user_id", request.params.id)
    );

    if (data?.error) {
        await redisClient.del(request.params.id);
    }

    const profiles = ProfilesSchema.parse(data?.data);
    if (profiles && profiles.length === 1)
        return response.status(200).json(profiles[0]);
    return response.status(400).json({ error: "No user found." });
});

router.post(
    "/",
    hcaptchaVerifier,
    imageParser,
    profileImgEditor,
    async (request, response) => {
        const { first_name, last_name, email, password } =
            UserRegisterSchema.parse(request.body);

        const foundUser = (
            await supabase.auth.admin.listUsers()
        ).data.users.find((user) => user.email === email);

        const { data: newUser, error: newUserError } =
            await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: NODE_ENV !== "production",
                user_metadata: {
                    first_name,
                    last_name,
                },
            });

        // Do not let client knows that the user already exists.
        if (newUserError || !newUser.user)
            return response.status(201).json({
                first_name,
                last_name,
                user_id: randomUUID(),
                profile_photo: SUPABASE_DEFAULT_PIC,
                public_profile: false,
                created_at: `${new Date().toISOString().slice(0, -1)}+00`,
            });

        if (NODE_ENV === "production")
            await supabase.auth.resend({
                type: "signup",
                email,
                options: {
                    emailRedirectTo: REDIRECT_URL,
                },
            });

        const userData: {
            first_name: string;
            last_name: string;
            user_id: string;
            profile_photo?: string;
        } = { first_name, last_name, user_id: newUser.user?.id };

        if (request.file && userData.user_id && !foundUser) {
            const photoData = request.fileData;
            const extension = request.fileExtension;
            const bucketPath = `${userData.user_id}.${extension}`;
            const { error } = await supabase.storage
                .from(PROFILE_IMAGE_BUCKET)
                .upload(bucketPath, photoData, {
                    contentType: "image/*",
                    upsert: true,
                    duplex: "half",
                });

            console.log("ERROR:", error);

            if (error) return response.status(400).json(error);
            else {
                const { data } = supabase.storage
                    .from(PROFILE_IMAGE_BUCKET)
                    .getPublicUrl(bucketPath);

                userData.profile_photo = data.publicUrl;
            }
        }

        if (newUser && !foundUser) {
            const { error } = await supabase
                .from("profiles")
                .insert([userData]);

            if (error) return response.status(500).json({ error });
            return response.status(201).json({
                ...userData,
                profile_photo: userData.profile_photo ?? SUPABASE_DEFAULT_PIC,
                public_profile: false,
                created_at: newUser.user.created_at,
            });
        }
        return response
            .status(400)
            .json({ error: "You cannot create an account." });
    }
);

router.put(
    "/:id",
    tokenExtractor,
    userExtractor,
    imageParser,
    profileImgEditor,
    async (request, response) => {
        if (request.user.id === request.params.id) {
            const { first_name, last_name, email, password, public_profile } =
                UserChangeSchema.parse(request.body);
            const editedData: {
                first_name?: string;
                last_name?: string;
                profile_photo?: string;
                public_profile?: boolean;
            } = {};

            if (first_name) editedData.first_name = first_name;
            if (last_name) editedData.last_name = last_name;

            const editedUser: {
                password?: string;
                user_metadata?: object;
            } = {};

            if (password) editedUser.password = password;
            if (Object.keys(editedData).length !== 0)
                editedUser.user_metadata = editedData;

            if (email) {
                return response.status(400).json({
                    error: "You should not use this API to change your email.",
                });
            } else {
                const { error: updateUserError } =
                    await supabase.auth.admin.updateUserById(
                        request.user.id,
                        editedUser
                    );

                if (updateUserError)
                    return response
                        .status(500)
                        .json({ error: updateUserError });
            }

            if (request.file) {
                const bucketPath = `${request.user.id}.${request.fileExtension}`;
                const { error } = await supabase.storage
                    .from(PROFILE_IMAGE_BUCKET)
                    .upload(bucketPath, request.fileData, {
                        contentType: "image/*",
                        upsert: true,
                        duplex: "half",
                    });

                if (error) return response.status(500).json({ error });
                else {
                    const { data } = supabase.storage
                        .from(PROFILE_IMAGE_BUCKET)
                        .getPublicUrl(bucketPath);

                    editedData.profile_photo = data.publicUrl;
                }
            }

            if (public_profile) editedData.public_profile = public_profile;

            const { data: newProfile, error } = await supabase
                .from("profiles")
                .update(editedData)
                .eq("user_id", request.user.id)
                .select();

            await redisClient.del(request.user.id);

            if (error) return response.status(500).json({ error });

            return response.status(201).json(newProfile);
        }

        return response.status(400).json({ error: "user id not found" });
    }
);

router.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        if (request.user.id === request.params.id) {
            const { data: profiles } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", request.user.id);

            const parsedProfiles = ProfilesSchema.parse(profiles);

            if (
                parsedProfiles.length === 1 &&
                parsedProfiles[0].profile_photo !== DEFAULT_PROFILE_URL
            ) {
                const { error } = await supabase.storage
                    .from(PROFILE_IMAGE_BUCKET)
                    .remove([`${request.user.id}.jpg`]);
                if (error) return response.status(500).json({ error });
            }

            const { error } = await supabase.auth.admin.deleteUser(
                request.user.id
            );

            if (error) return response.status(500).json({ error });
            return response
                .status(200)
                .json({ message: "User profile deleted." });
        }
        return response.status(400).json({ error: "user id not found" });
    }
);

export default router;
