import "express-async-errors";
import { Router } from "express";
import { hcaptchaVerifier } from "@/utils/middleware";
import { resend } from "@/utils/resend";
import { EmailSchema } from "@/types/zod";

const router = Router();

router.post("/", hcaptchaVerifier, async (request, response) => {
    const { email, body } = EmailSchema.parse(request.body);
    const {data, error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "namdo1204@gmail.com",
        subject: "CA: Chat App Contact Form Email",
        html: `<p>
        <p>Email: ${email}.</p>
        <p>Email content:</p>
        <p>${body}</p>
        </p>`,
    });

    if (error)
        return response.status(400);
    return response.status(200).send(data);
});


export default router;