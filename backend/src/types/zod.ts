/**
 * Zod schemas for general purpose parsing.
*/

import { z } from "zod";

export const setRequiredStr = (
    message: string = "This field has to be filled"
): z.ZodString => z.string().min(1, { message });
export const email = z.string().email("This is not a valid email.");
export const first_name = setRequiredStr("First name has to be filled.");
export const last_name = setRequiredStr("Last name has to be filled.");
export const password = z.string().min(8, {
    message: "The password has to be at least 8 characters long.",
});

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
});
