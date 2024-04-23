import { InferType } from "yup";
import { RegistrationSchema, optionalStr, requiredStr } from "./yup";
import * as y from "yup";

export const EditProfileSchema = RegistrationSchema.shape({
    email: optionalStr,
    password: optionalStr,
    passwordConfirm: optionalStr
});

export type EditProfileType = InferType<typeof EditProfileSchema>;

export const ProfileSchema = y.object().shape({
    // id: requiredStr,
    created_at: requiredStr,
    first_name: requiredStr,
    last_name: requiredStr,
    profile_photo: requiredStr,
    user_id: requiredStr,
})

export const ProfilesSchema = y.array().of(ProfileSchema);

export type ProfileType = InferType<typeof ProfileSchema>;