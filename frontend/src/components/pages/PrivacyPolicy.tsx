import { Box, Typography } from "@mui/material";

const PrivacyPolicy = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                width: 3 / 4,
                mx: "auto",
                my: 5,
            }}
        >
            <Typography textAlign="center" variant="h5">
                Privacy Policy
            </Typography>
            <Typography>
                I will state it now: this app is a demonstration of my skill,
                and I will not check your messages. I will not sell your data to
                others. While this website will be publicly available, it's just
                not something I can actively maintain everyday. I promise to
                keep your data as secured as I can, but at the end of the day,
                you can easily find alternative apps like Discord. Therefore, if
                you have any confidential messages you want to send to your
                friends, don't send it here.
            </Typography>
            <Typography>
                Just in case, I would like offer a full privacy policy:
            </Typography>
        </Box>
    );
};

export default PrivacyPolicy;
