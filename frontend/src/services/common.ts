type CaptchaHeader = {
    headers: {
        "CACHAT-HCAPTCHA-TOKEN": string;
    };
};

type AuthHeader = {
    headers: {
        Authorization: string;
    };
};

/**
 * Creates a captcha header from provided captcha token.
 * @param {string} captchaToken
 * @returns {CaptchaHeader} The object with captcha header.
 */
export const createCaptchaHeader = (captchaToken: string): CaptchaHeader => {
    return {
        headers: {
            "CACHAT-HCAPTCHA-TOKEN": captchaToken,
        },
    };
};

/**
 * Creates a auth header from provided Bearer access token.
 * @param {string} token
 * @returns {AuthHeader} The object with auth header.
 */
export const createAuthHeader = (token: string): AuthHeader => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
