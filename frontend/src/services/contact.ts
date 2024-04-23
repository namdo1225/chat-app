import { createCaptchaHeader } from "./common";
import apiClient from "@/config/apiClient";

const api = "contact";

const sendEmail = async (email: string, body: string, captchaToken: string) => {
    const request = await apiClient.post(
        `/${api}`,
        { email, body },
        createCaptchaHeader(captchaToken)
    );
    return request;
};

export { sendEmail };
