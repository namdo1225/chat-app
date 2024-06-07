import { HCAPTCHA_TOKEN } from "@/config/config";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";

type UseCaptcha = {
    captchaToken: string;
    setCaptchaToken: React.Dispatch<React.SetStateAction<string>>;
    captchaRef: React.RefObject<HCaptcha>;
};

/**
 * A hook for managing captcha data.
 * @returns {UseCaptcha} the hook.
 */
const useCaptcha = (): UseCaptcha => {
    const [captchaToken, setCaptchaToken] = useState(HCAPTCHA_TOKEN);
    const captchaRef = useRef<HCaptcha>(null);

    return { captchaToken, setCaptchaToken, captchaRef };
};

export default useCaptcha;
