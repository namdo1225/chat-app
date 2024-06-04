/**
 * Zod schemas for general purpose parsing.
 */

import { ZodEffects, z } from "zod";
import { DOM_PURIFY } from "@/utils/purify";

export const sanitize = <T>(v: T): string | T => {
    return typeof v === "string" ? DOM_PURIFY.sanitize(v) : v;
};

export const setRequiredStr = (
    required_error: string = "This field has to be filled"
): ZodEffects<z.ZodString, string, string> =>
    z
        .string({ required_error })
        .trim()
        .transform((v) => sanitize(v));
export const setMinStr = (
    msg: string = "This field has to be filled"
): ZodEffects<z.ZodString, string, string> =>
    z
        .string()
        .trim()
        .min(1, msg)
        .transform((v) => sanitize(v));

export const email = z
    .string()
    .email("This is not a valid email.")
    .transform((v) => sanitize(v));
export const first_name = setRequiredStr(
    "First name has to be filled."
).transform((v) => sanitize(v));
export const last_name = setRequiredStr(
    "Last name has to be filled."
).transform((v) => sanitize(v));
export const password = z
    .string()
    .min(8, {
        message: "The password has to be at least 8 characters long.",
    })
    .transform((v) => sanitize(v));

export const optionalStr = setRequiredStr().optional().nullable();
export const posSize = z.coerce.number().optional();

export const passwordRefine = (
    {
        password,
    }: {
        password?: string | undefined;
    },
    checkPassComplexity: z.RefinementCtx
): void => {
    if (!password) return;

    const containsUppercase = (ch: string): boolean => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string): boolean => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string): boolean =>
        /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(ch);
    let countOfUpperCase = 0,
        countOfLowerCase = 0,
        countOfNumbers = 0,
        countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
        const ch = password.charAt(i);
        if (!isNaN(+ch)) countOfNumbers++;
        else if (containsUppercase(ch)) countOfUpperCase++;
        else if (containsLowercase(ch)) countOfLowerCase++;
        else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
        !countOfLowerCase ||
        !countOfUpperCase ||
        !countOfSpecialChar ||
        !countOfNumbers
    ) {
        checkPassComplexity.addIssue({
            code: "custom",
            message: "Password does not meet complexity requirements",
        });
    }
};

export const ResendPathSchema = z.object({
    email,
    action: z.union([z.literal("CONFIRMATION"), z.literal("RESET PASSWORD")]),
});

export const HCaptchaSchema = z.object({
    success: z.boolean(),
});

export const EmailSchema = z.object({
    email,
    body: setRequiredStr("An email body is required."),
    _fail: z.boolean().optional(),
});
