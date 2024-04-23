import { z } from "zod";
import { email, first_name, last_name, password, passwordRefine, posSize, setRequiredStr } from "./zod";

export const UserRegisterSchema = z
    .object({
        first_name,
        last_name,
        email,
        password,
        x: posSize,
        y: posSize,
        width: posSize,
        height: posSize,
    })
    .superRefine(passwordRefine);

export const UserChangeSchema = z
    .object({
        first_name: first_name.optional(),
        last_name: last_name.optional(),
        email: email.optional(),
        password: password.optional(),
        x: posSize,
        y: posSize,
        width: posSize,
        height: posSize,
    })
    .superRefine(passwordRefine);

export const UserLoginSchema = z.object({
    email,
    password: z.string(),
});

export const UserSchema = z.object({
    id: z.number().min(1, { message: "This field has to be filled." }),
    first_name,
    last_name,
    created_at: setRequiredStr(),
    profile_photo: setRequiredStr(),
    user_id: setRequiredStr(),
});

export type UserType = z.infer<typeof UserSchema>;