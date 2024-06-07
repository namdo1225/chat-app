import {
    BACKEND_URL,
    CAPTCHA_SITE_KEY,
    HCAPTCHA_TOKEN,
    NODE_ENV,
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
} from "@/config/config";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import ClearIcon from "@mui/icons-material/Clear";

/**
 * Component to display useful information for dev in dev mode.
 * @returns {JSX.Element} The React component.
 */
const DevInfo = (): JSX.Element => {
    const [hideDev, setHideDev] = useState(true);

    if (hideDev)
        return (
            <Box
                className="bottom-12 right-5 md:bottom-10 md:right-10 cursor-pointer rounded-xl"
                onClick={() => setHideDev(false)}
                sx={{
                    bgcolor: "secondary.light",
                    position: "fixed",
                    zIndex: (theme) => theme.zIndex.drawer + 5,
                }}
            >
                <DeveloperModeIcon className="hover:text-[#e5ffbb]" />
            </Box>
        );

    const fontSize = {
        fontSize: {
            xs: 8,
            sm: 12,
            md: 18,
            lg: 24,
            xl: 48,
        },
    } as const;

    return (
        <Box
            sx={{
                position: "fixed",
                maxHeight: { xs: 50, sm: 200, md: 400, lg: 800 },
                maxWidth: 4 / 5,
                left: 0,
                bottom: 0,
                bgcolor: "#fa4bb0aa",
                overflowY: "scroll",
                p: 3,
                m: 2,
                whiteSpace: "nowrap",
                zIndex: (theme) => theme.zIndex.drawer + 6,
                border: 1,
            }}
        >
            <Typography sx={fontSize} fontWeight="bold">
                <ClearIcon
                    fontSize="large"
                    className="hover:text-[#e5ffbb]"
                    onClick={() => setHideDev(true)}
                />
                DEV MODE - ENV VARIABLES:
            </Typography>
            <Typography sx={fontSize}>NODE_ENV: {NODE_ENV}</Typography>
            <Typography sx={fontSize}>SUPABASE_URL: {SUPABASE_URL}</Typography>
            <Typography sx={fontSize}>
                SUPABASE_ANON_KEY: {SUPABASE_ANON_KEY}
            </Typography>
            <Typography sx={fontSize}>BACKEND_URL: {BACKEND_URL}</Typography>
            <Typography sx={fontSize}>
                CAPTCHA_SITE_KEY: {CAPTCHA_SITE_KEY}
            </Typography>
            <Typography sx={fontSize}>
                HCAPTCHA_TOKEN: {HCAPTCHA_TOKEN}
            </Typography>
        </Box>
    );
};

export default DevInfo;
