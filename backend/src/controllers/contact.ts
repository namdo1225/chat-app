/**
 * Provides /contact with a function definition to handle POST requests.
 */

import "express-async-errors";
import { Router } from "express";
import { hcaptchaVerifier } from "@/utils/middleware";
import { resend } from "@/utils/resend";
import { EmailSchema } from "@/types/zod";
import { NODE_ENV } from "@/utils/config";

const router = Router();

router.post("/", hcaptchaVerifier, async (request, response) => {
    const { email, body, _fail } = EmailSchema.parse(request.body);
    let toEmail = "namdo1204@gmail.com";
    if (NODE_ENV === "test") {
        toEmail = _fail ? "test@purposefullyfail.dev" : "delivered@resend.dev";
    }
    const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: toEmail,
        subject: "CA: Chat App Contact Form Email",
        html: `<p>
        <p>Email: ${email}.</p>
        <p>Email content:</p>
        <p>${body}</p>
        </p>`,
    });

    console.log("toEmail:", toEmail);

    if (error)
        return response.status(500).json({
            error: "Unknown error while trying to send contact email.",
        });
    return response
        .status(200)
        .send({ message: "Contact email sent successfully." });
});

export default router;
