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
} from "@/utils/middleware";
import { cacheData } from "@/utils/cache";
import redisClient from "@/utils/redis";

const router = Router();

router.get("/", async (_request, response) => {
    const data = await cacheData(
        "ALL_PROFILES",
        async () =>
            await supabase
                .from("profiles")
                .select("*")
                .is("public_profile", true),
        1800
    );
    const profiles = ProfilesSchema.parse(data?.data);
    return response.json(profiles);
});

router.get("/:id", async (request, response) => {
    const data = await cacheData(request.params.id, async () =>
        supabase.from("profiles").select("*").eq("user_id", request.params.id)
    );

    const profiles = ProfilesSchema.parse(data?.data);
    if (profiles && profiles.length === 1) return response.json(profiles[0]);
    return response.status(404).json({ error: "No user found." });
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
        ).data.users.filter((user) => user.email === email);

        const { data: newUser, error: newUserError } =
            await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name,
                        last_name,
                    },
                },
            });

        if (newUserError || !newUser.user)
            return response.status(404).json(newUserError);

        const userData: {
            first_name: string;
            last_name: string;
            user_id: string;
            profile_photo?: string;
        } = { first_name, last_name, user_id: newUser.user?.id };

        if (request.file && userData.user_id && foundUser.length === 0) {
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

            if (error) return response.status(400).json(error);
            else {
                const { data } = supabase.storage
                    .from(PROFILE_IMAGE_BUCKET)
                    .getPublicUrl(bucketPath);

                userData.profile_photo = data.publicUrl;
            }
        }

        if (foundUser.length === 0) {
            const { data: newProfile, error } = await supabase
                .from("profiles")
                .insert([userData])
                .select();

            if (error) return response.status(404).json(error);
            return response.status(201).json(newProfile);
        }
        return response.status(201).json({ test: "hi" });
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
                email?: string;
                password?: string;
                user_metadata?: object;
            } = {};

            if (email) editedUser.email = email;
            if (password) editedUser.password = password;
            if (Object.keys(editedData).length !== 0)
                editedUser.user_metadata = editedData;

            if (email) {
                return response.status(404).json({
                    error: "You should not use this API to change your email.",
                });
            } else {
                const { error: updateUserError } =
                    await supabase.auth.admin.updateUserById(
                        request.user.id,
                        editedUser
                    );

                if (updateUserError)
                    return response.status(404).json(updateUserError);
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

                if (error) return response.status(404).json(error);
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

            if (error) return response.status(404).json(error);

            return response.status(201).json(newProfile);
        }

        return response.status(404).json({ error: "user id not found" });
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
            console.log(profiles);
            if (
                parsedProfiles.length === 1 &&
                parsedProfiles[0].profile_photo !== DEFAULT_PROFILE_URL
            ) {
                console.log(
                    "HERE: ",
                    `${PROFILE_IMAGE_BUCKET}/${request.user.id}.jpg`
                );
                const { error } = await supabase.storage
                    .from(PROFILE_IMAGE_BUCKET)
                    .remove([`${request.user.id}.jpg`]);
                if (error) return response.status(404).json(error);
            }

            const { data, error } = await supabase.auth.admin.deleteUser(
                request.user.id
            );

            if (error) return response.status(404).json(error);
            return response.status(200).json(data);
        }
        return response.status(404).json({ error: "user id not found" });
    }
);

export default router;
