import { Box, Typography } from "@mui/material";

/**
 * Component for /about page.
 * @returns {JSX.Element} The React component.
 */
const About = (): JSX.Element => {
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
                CaChat
            </Typography>
            <Typography>
                CaChat or Chat App Chat (I know, very original), is a web
                application made by Nam Do (namdo1225 on GitHub). This is meant
                to demonstrate my full-stack web development skills,
                specifically my web development practices, capability to
                integrate APIs, implementation of security standards, and
                utilization of modern web development tools and frameworks like
                React.
            </Typography>
            <Typography>
                CaChat is a simple chat app. It is not a social media app, but
                it has some social media capability. Users can create chats and
                add other users to them. Within the chat, users can communicate
                with others (appropriately) and share images. Users can also
                discover public chat and make friends.
            </Typography>
            <Typography>
                I know that this app might seem limited, but this is the work of
                one person. I believe it demonstrates that if I can get this
                fully running, then adding features like allowing users to share
                videos or making a photo editor should not be too hard.
            </Typography>
            <Typography>But, anyway, welcome to the app!</Typography>
        </Box>
    );
};

export default About;
