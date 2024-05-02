import { z } from "zod";
import { email, first_name, last_name, password, passwordRefine, posSize } from "./zod";
import { ProfileSchema } from "./profile";

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
        public_profile: z.coerce.boolean().optional(),
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

export const UserSchema = ProfileSchema.extend({
    id: z.number().min(1, { message: "This field has to be filled." }),
});

export type UserType = z.infer<typeof UserSchema>;