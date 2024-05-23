import { Box, Container, Divider, Typography } from "@mui/material";
import { routes, socialRoutes, supportRoutes } from "@/routes";
import { Link } from "@mui/material";

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
                    <Link href="/">
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
                    </Link>
                    {[routes, supportRoutes, socialRoutes].map(
                        (route, index) => (
                            <Box key={`footer-${index}`}>
                                {route.map(({ path, name, link }) => (
                                    <Typography key={name}>
                                        <Link
                                            {...style}
                                            href={
                                                path || link
                                                    ? link
                                                        ? link
                                                        : path
                                                    : "/"
                                            }
                                        >
                                            {name}
                                        </Link>
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
