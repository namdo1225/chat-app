import { Box, Container, Divider, Typography } from "@mui/material";
import { routes, socialRoutes, supportRoutes } from "@/routes";
import { Link } from "react-router-dom";

/**
 * Footer component for the website.
 */
const Footer = (): JSX.Element => {
    const style = {
        sx: {
            color: "grey.50",
        },
        underline: "hover" as const,
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                zIndex: (theme) => theme.zIndex.drawer - 1,
                position: "sticky",
                minWidth: 150,
            }}
        >
            <Box
                component="footer"
                sx={{ marginTop: "auto", bgcolor: "footer.main", p: 2 }}
            >
                <Box className="flex justify-evenly flex-wrap gap-10">
                    <Typography component={Link} to="/">
                        <Box
                            component="img"
                            sx={{
                                width: 80,
                                height: 80,
                                mr: 1,
                            }}
                            alt="CA Logo"
                            src="./logo.png"
                        />
                    </Typography>
                    {[routes, supportRoutes, socialRoutes].map(
                        (route, index) => (
                            <Box className="flex flex-col flex-wrap" key={`footer-${index}`}>
                                {route.map(({ path, name, link }) => (
                                    <Typography
                                        {...style}
                                        className="hover:underline"
                                        component={Link}
                                        key={name}
                                        to={
                                            path || link
                                                ? link
                                                    ? link
                                                    : path
                                                    ? path
                                                    : "/"
                                                : "/"
                                        }
                                    >
                                        {name}
                                    </Typography>
                                ))}
                            </Box>
                        )
                    )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Container>
                    <Typography {...style.sx} align="center">
                        Made by namdo1225
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Footer;
