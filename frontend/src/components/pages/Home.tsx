import { Box, Typography, TextField, Button } from "@mui/material";
import HomeChat from "@/components/pages/chat/HomeChat";
import { useState } from "react";
import Captcha from "../Captcha";
import useCaptcha from "@/hooks/useCaptcha";
import { BACKEND_URL, CAPTCHA_SITE_KEY, HCAPTCHA_TOKEN, NODE_ENV, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/config";

/**
 * Component for /home page.
 * @returns {JSX.Element} The React component.
 */
const Home = (): JSX.Element => {
    const [tempChatter, setTempChatter] = useState("");
    const [chatter, setChatter] = useState("");
    const { captchaToken, setCaptchaToken, captchaRef } = useCaptcha();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                my: 5,
                width: { xs: undefined, sm: 2 / 3 },
                mx: "auto",
            }}
        >
            <Typography textAlign="center" variant="h1" fontSize={32}>
                Welcome to CaChat
            </Typography>
            {NODE_ENV !== "production" && (
                <>
                    <Typography>DEV MODE - ENV VARIABLES:</Typography>
                    <Typography>NODE_ENV: {NODE_ENV}</Typography>
                    <Typography>SUPABASE_URL: {SUPABASE_URL}</Typography>
                    <Typography>
                        SUPABASE_ANON_KEY: {SUPABASE_ANON_KEY}
                    </Typography>
                    <Typography>BACKEND_URL: {BACKEND_URL}</Typography>
                    <Typography>
                        CAPTCHA_SITE_KEY: {CAPTCHA_SITE_KEY}
                    </Typography>
                    <Typography>HCAPTCHA_TOKEN: {HCAPTCHA_TOKEN}</Typography>
                </>
            )}
            <Typography textAlign="center" sx={{ m: 2 }}>
                This is a simple chat application to demonstrate my programming
                abilities. We have a demo setup here that demonstrates the user
                interface, but you need to sign up in order to use the actual
                chat application.
            </Typography>
            {chatter && captchaToken ? (
                <HomeChat chatter={chatter} />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        m: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter a name"
                        variant="outlined"
                        value={tempChatter}
                        onChange={({ target }) => setTempChatter(target.value)}
                    />
                    <Captcha
                        captcha={captchaRef}
                        setCaptchaToken={setCaptchaToken}
                    />
                    <Button
                        disabled={!captchaToken || !tempChatter}
                        color="primary"
                        variant="contained"
                        onClick={() => setChatter(tempChatter)}
                    >
                        Set
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Home;
