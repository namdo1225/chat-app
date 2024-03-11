import { z } from "zod";

export const UserRegisterSchema = z
    .object({
        first_name: z
            .string()
            .min(1, { message: "This field has to be filled." }),
        last_name: z
            .string()
            .min(1, { message: "This field has to be filled." }),
        email: z.string().email("This is not a valid email."),
        password: z.string().min(8, {
            message: "The password has to be at least 8 characters long.",
        }),
    })
    .superRefine(({ password }, checkPassComplexity) => {
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
            countOfLowerCase < 1 ||
            countOfUpperCase < 1 ||
            countOfSpecialChar < 1 ||
            countOfNumbers < 1
        ) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "Password does not meet complexity requirements",
            });
        }
    });

export const UserChangeSchema = z
    .object({
        first_name: z
            .string()
            .optional(),
        last_name: z
            .string()
            .optional(),
        email: z.string().email("This is not a valid email.").optional(),
        password: z.string().min(8, {
            message: "The password has to be at least 8 characters long.",
        }).optional(),
    })
    .superRefine(({ password }, checkPassComplexity) => {
        if (!password)
            return;
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
            countOfLowerCase < 1 ||
            countOfUpperCase < 1 ||
            countOfSpecialChar < 1 ||
            countOfNumbers < 1
        ) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "Password does not meet complexity requirements",
            });
        }
    });

export const UserLoginSchema = z
    .object({
        email: z.string().email("This is not a valid email."),
        password: z.string(),
    });

export const ResendPathSchema = z
    .object({
        email: z.string().email("This is not a valid email."),
        action: z.union([
            z.literal('CONFIRMATION'),
            z.literal('RESET PASSWORD'),
        ]),
    });