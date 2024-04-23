import { Dispatch, RefObject, SetStateAction } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { CAPTCHA_SITE_KEY } from "@/config/config";
import { Box, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthProvider";

const Captcha = ({
    setCaptchaToken,
    captcha,
}: {
    setCaptchaToken: Dispatch<SetStateAction<string>>;
    captcha: RefObject<HCaptcha>;
}) => {
    const {themeMode} = useAuth();

    return (
        <>
            <Box
                sx={{ mx: "auto", display: { xs: "none", hcaptcha: "block" } }}
            >
                <HCaptcha
                    sitekey={CAPTCHA_SITE_KEY}
                    onVerify={setCaptchaToken}
                    onExpire={() => setCaptchaToken("")}
                    ref={captcha}
                    theme={themeMode}
                />
            </Box>
            <Typography
                color="error"
                sx={{ display: { hcaptcha: "block", sm: "none" } }}
            >
                * Zooming in will cause the captcha to hide.
            </Typography>
        </>
    );
};

export default Captcha;
