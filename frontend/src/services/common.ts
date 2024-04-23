export const createCaptchaHeader = (captchaToken: string) => {
    return {
        headers: {
            "CACHAT-HCAPTCHA-TOKEN": captchaToken,
        },
    };
};

export const createAuthHeader = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
