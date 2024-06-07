import { Box, Typography, TextField, Button } from "@mui/material";
import HomeChat from "@/components/pages/chat/HomeChat";
import { useState } from "react";
import Captcha from "../Captcha";
import useCaptcha from "@/hooks/useCaptcha";

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
