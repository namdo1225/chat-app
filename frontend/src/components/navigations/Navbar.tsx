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

    const changeTheme = () => {
        const newTheme = themeMode === "light" ? "dark" : "light";
        setThemeMode(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        setUserOpen(false);
    }, [user]);

    return (
        <AppBar
            position="sticky"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 2, minWidth: 150 }}
        >
            <Container sx={{ px: { xs: 1, sm: undefined } }}>
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
                        component={Link}
                        to="/"
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
                                        fontSize: { xs: "small", md: "medium" },
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        {anchorNav.current && (
                            <Box>
                                <Menu
                                    disableScrollLock={true}
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
                                    <MenuItem to="/" component={Link}>
                                        Home
                                    </MenuItem>
                                    {routes.map(({ path, name }) => (
                                        <MenuItem
                                            to={path ?? "/"}
                                            key={path ?? name}
                                            component={Link}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                    <MenuItem onClick={changeTheme}>
                                        Theme
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Box>
                    <Tooltip
                        sx={{
                            display: { xs: "none", md: "flex" },
                        }}
                        title="Toggle dark mode"
                    >
                        <Switch
                            value={themeMode === "dark"}
                            onChange={changeTheme}
                        />
                    </Tooltip>
                    <Logo
                        onNav={true}
                        display={{ xs: "flex", md: "none" }}
                        link="/"
                    />
                    <Typography
                        variant="h5"
                        component={Link}
                        to="/"
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
                                component={Link}
                                to={path ?? "/"}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                            >
                                {name}
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
                                        sx={{
                                            width: { xs: 18, md: 24 },
                                            height: { xs: 18, md: 24 },
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            {anchorUser.current && (
                                <Menu
                                    disableScrollLock={true}
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
                                    {profileRoutes.map(({ path, name }) => (
                                        <MenuItem
                                            component={Link}
                                            key={name}
                                            to={path ?? "/"}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                    <MenuItem onClick={signOut}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            )}
                        </Box>
                    ) : (
                        <MenuItem
                            component={Link}
                            to="/login"
                            onClick={handleCloseNavMenu}
                        >
                            Login
                        </MenuItem>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
