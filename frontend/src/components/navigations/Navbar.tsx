import { routes, profileRoutes } from "@/routes";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";

import {
    MenuItem,
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    Switch,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useAuth } from "@/context/AuthProvider";
import Logo from "@/components/branding/Logo";

const Navbar = () => {
    const { user, signOut, profile, themeMode, setThemeMode } = useAuth();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const anchorNav = useRef<HTMLButtonElement>(null);
    const anchorUser = useRef<HTMLButtonElement>(null);

    const [mainOpen, setMainOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const handleOpenNavMenu = () => {
        setMainOpen(true);
    };
    const handleOpenUserMenu = () => {
        setUserOpen(true);
    };

    const handleCloseNavMenu = () => {
        setMainOpen(false);
    };

    const handleCloseUserMenu = () => {
        setUserOpen(false);
    };

    useEffect(() => {
        setUserOpen(false);
    }, [user]);

    return (
        <>
            <AppBar position="sticky">
                <Container maxWidth="xl" sx={{px: smScreen ? 1 : null}}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                        disableGutters
                    >
                        <Logo
                            onNav={true}
                            display={{ xs: "none", md: "flex" }}
                            link="/"
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                display: { xs: "none", md: "block" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".1rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            CACHAT
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "contents" },
                                visibility: { md: "hidden" },
                            }}
                        >
                            <Tooltip title="Open menu">
                                <IconButton
                                    ref={anchorNav}
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon
                                        sx={{
                                            fontSize: smScreen
                                                ? "small"
                                                : "medium",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            {anchorNav.current && (
                                <Box>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={() =>
                                            anchorNav.current as HTMLButtonElement
                                        }
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "left",
                                        }}
                                        open={mainOpen}
                                        onClose={handleCloseNavMenu}
                                        sx={{
                                            display: {
                                                xs: "block",
                                                md: "none",
                                            },
                                        }}
                                    >
                                        {routes.map(
                                            ({ path, name }) =>
                                                path && (
                                                    <Link to={path} key={path}>
                                                        <MenuItem>
                                                            <Typography textAlign="center">
                                                                {name}
                                                            </Typography>
                                                        </MenuItem>
                                                    </Link>
                                                )
                                        )}
                                    </Menu>
                                </Box>
                            )}
                        </Box>
                        <Switch
                            size= {smScreen ? "small" : "medium"}
                            value={themeMode === "dark"}
                            onChange={() => {
                                setThemeMode(
                                    themeMode === "light" ? "dark" : "light"
                                );
                            }}
                        />
                        <Logo
                            onNav={true}
                            display={{ xs: "flex", md: "none" }}
                            link="/"
                        />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {
                                    xs: "none",
                                    sm: "block",
                                    md: "none",
                                },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".1rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            CACHAT
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {routes.map(({ path, name }) => (
                                <Button
                                    key={path}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    {path && (
                                        <Link
                                            to={path}
                                            className="no-underline text-white"
                                        >
                                            {name}
                                        </Link>
                                    )}
                                </Button>
                            ))}
                        </Box>

                        {user ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        ref={anchorUser}
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Typography
                                            sx={{
                                                mx: 2,
                                                display: {
                                                    xs: "none",
                                                    sm: "block",
                                                },
                                            }}
                                            color="white"
                                        >
                                            {user.user_metadata.first_name}{" "}
                                            {user.user_metadata.last_name}
                                        </Typography>
                                        <Avatar
                                            alt="User Avatar"
                                            src={profile?.profile_photo}
                                            sx={{ width: smScreen ? 18 : 24, height: smScreen ? 18 : 24 }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                {anchorUser.current && (
                                    <Menu
                                        sx={{
                                            display: {
                                                xs: "block",
                                            },
                                        }}
                                        id="menu-appbar"
                                        anchorEl={() =>
                                            anchorUser.current as HTMLButtonElement
                                        }
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={userOpen}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {profileRoutes.map(
                                            ({ path, name }) =>
                                                path && (
                                                    <Link key={name} to={path}>
                                                        <MenuItem>
                                                            <Typography textAlign="center">
                                                                {name}
                                                            </Typography>
                                                        </MenuItem>
                                                    </Link>
                                                )
                                        )}
                                        <MenuItem onClick={signOut}>
                                            <Typography textAlign="center">
                                                Logout
                                            </Typography>
                                        </MenuItem>
                                    </Menu>
                                )}
                            </Box>
                        ) : (
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link to="/login">Login</Link>
                                </Typography>
                            </MenuItem>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;
