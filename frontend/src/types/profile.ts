/**
 * Yup schemas for a profile data.
*/

import { InferType } from "yup";
import { RegistrationSchema, optionalStr, requiredStr } from "./yup";
import * as y from "yup";

export const EditProfileSchema = RegistrationSchema.shape({
    email: optionalStr,
    password: optionalStr,
    passwordConfirm: optionalStr,
    publicProfile: y.bool().optional(),
});

export type EditProfile = InferType<typeof EditProfileSchema>;

export const ProfileSchema = y.object().shape({
    // id: requiredStr,
    created_at: requiredStr,
    first_name: requiredStr,
    last_name: requiredStr,
    profile_photo: requiredStr,
    user_id: requiredStr,
    public_profile: y.bool().required(),
});

export const ProfilesSchema = y.array().of(ProfileSchema).required();

export type Profile = InferType<typeof ProfileSchema>;