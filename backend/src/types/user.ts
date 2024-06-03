/**
 * Zod schemas for user forms.
 */

import { z } from "zod";
import {
    email,
    first_name,
    last_name,
    optionalStr,
    password,
    passwordRefine,
    posSize,
} from "./zod";

const posAndSize = { x: posSize, y: posSize, width: posSize, height: posSize };

export const UserRegisterSchema = z
    .object({
        first_name,
        last_name,
        email,
        password,
        ...posAndSize,
    })
    .superRefine(passwordRefine);

export const UserChangeSchema = z
    .object({
        first_name: optionalStr,
        last_name: optionalStr,
        email: email.optional(),
        password: password.optional(),
        public_profile: z.coerce.boolean().optional(),
        ...posAndSize,
    })
    .superRefine(passwordRefine);
