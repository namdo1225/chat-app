import { Box, Container, Divider, Typography } from "@mui/material";
import { routes, socialRoutes, supportRoutes } from "@/routes";
import { Link } from "@mui/material";

const Footer = () => {
    return (
        <Box sx={{ bgcolor: "footer.main", p: 2 }}>
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
                        <Typography key={name} textAlign="center">
                            {path && (
                                <Link
                                    sx={{ color: "grey.50" }}
                                    underline="hover"
                                    href={path}
                                >
                                    {name}
                                </Link>
                            )}
                        </Typography>
                    ))}
                </Box>
                <Box>
                    {supportRoutes.map(({ path, name, link }) => (
                        <Typography key={name} textAlign="center">
                            {
                                <Link
                                    sx={{ color: "grey.50" }}
                                    underline="hover"
                                    href={path ?? link}
                                >
                                    {name}
                                </Link>
                            }
                        </Typography>
                    ))}
                </Box>
                <Box>
                    {socialRoutes.map(({ name, link }) => (
                        <Typography key={name}>
                            {link && (
                                <Link
                                    sx={{ color: "grey.50" }}
                                    underline="hover"
                                    href={link}
                                >
                                    {name}
                                </Link>
                            )}
                        </Typography>
                    ))}
                </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Container>
                <Typography sx={{ color: "grey.50" }} align="center">
                    Made by namdo1225
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
