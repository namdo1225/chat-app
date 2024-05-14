import { Box, Container, Divider, Typography } from "@mui/material";
import { routes, socialRoutes, supportRoutes } from "@/routes";
import { Link } from "@mui/material";

const Footer = () => {
    const style = {
        sx: {
            color: "grey.50",
        },
        underline: "hover" as "hover",
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                zIndex: (theme) => theme.zIndex.drawer - 1,
                position: "sticky",
            }}
        >
            <Box component="footer" sx={{ marginTop: "auto", bgcolor: "footer.main", p: 2 }}>
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
                    <Box>
                        {routes.map(({ path, name }) => (
                            <Typography key={name}>
                                <Link {...style} href={path ?? "/"}>
                                    {name}
                                </Link>
                            </Typography>
                        ))}
                    </Box>
                    <Box>
                        {supportRoutes.map(({ path, name, link }) => (
                            <Typography key={name}>
                                <Link {...style} href={path ?? link}>
                                    {name}
                                </Link>
                            </Typography>
                        ))}
                    </Box>
                    <Box>
                        {socialRoutes.map(({ name, link }) => (
                            <Typography key={name}>
                                <Link {...style} href={link ?? "/"}>
                                    {name}
                                </Link>
                            </Typography>
                        ))}
                    </Box>
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
