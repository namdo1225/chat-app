import { AxiosResponse } from "axios";
import { createCaptchaHeader } from "./common";
import apiClient from "@/config/apiClient";

const api = "contact";

/**
 * Sends a contact email.
 * @param {string} email Visitor's email.
 * @param {string} body The email's body.
 * @param {string} captchaToken The captcha token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const sendEmail = async (
    email: string,
    body: string,
    captchaToken: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.post(
        `/${api}`,
        { email, body },
        createCaptchaHeader(captchaToken)
    );
    return request;
};

export { sendEmail };
