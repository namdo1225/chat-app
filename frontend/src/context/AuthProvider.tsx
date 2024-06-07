import { useState, useEffect, useMemo } from "react";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";
import { logout } from "@/services/users";
import { useOwnProfile } from "@/hooks/useUser";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import {
    THEME_VALUES,
    LIGHT_THEME_COLORS,
    DARK_THEME_COLORS,
    ChatMessageTheme,
    PALETTE_COLORS,
    PaletteColors,
} from "@/types/theme";
import { AuthContext, CAAuth } from "./AuthContext";

/**
 * The auth provider component.
 * Thank you to:
 * https://github.com/daniellaera/react-supabase-auth-provider/blob/main/src/hooks/Auth.tsx
 *
 * @param {JSX.Element} props.children The children for this component.
 * @returns
 */
const AuthProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [session, setSession] = useState<Session | null>();
    const { data: profile } = useOwnProfile(user, session);
    const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
        const theme = localStorage.getItem("theme");
        return theme === "light" || theme === "dark" ? theme : "light";
    });

    const handleChatTheme = (): void => {
        const fromMessageBox = PALETTE_COLORS.includes(
            localStorage.getItem("fromMessageBox") as PaletteColors
        )
            ? (localStorage.getItem("fromMessageBox") as PaletteColors)
            : "secondary.main";
        const toMessageBox = PALETTE_COLORS.includes(
            localStorage.getItem("toMessageBox") as PaletteColors
        )
            ? (localStorage.getItem("toMessageBox") as PaletteColors)
            : "info.main";

        const fromMessageText = PALETTE_COLORS.includes(
            localStorage.getItem("fromMessageText") as PaletteColors
        )
            ? (localStorage.getItem("fromMessageText") as PaletteColors)
            : undefined;
        const toMessageText = PALETTE_COLORS.includes(
            localStorage.getItem("toMessageText") as PaletteColors
        )
            ? (localStorage.getItem("toMessageText") as PaletteColors)
            : undefined;

        setChatTheme({
            fromMessageBox,
            toMessageBox,
            fromMessageText,
            toMessageText,
        });
    };

    const clearChatTheme = (): void => {
        localStorage.removeItem("fromMessageBox");
        localStorage.removeItem("toMessageBox");
        localStorage.removeItem("fromMessageText");
        localStorage.removeItem("toMessageText");

        setChatTheme({
            fromMessageBox: "secondary.main",
            toMessageBox: "primary.main",
            fromMessageText: undefined,
            toMessageText: undefined,
        });
    };

    const [chatTheme, setChatTheme] = useState<ChatMessageTheme>({
        fromMessageBox: "secondary.main",
        toMessageBox: "info.main",
        fromMessageText: undefined,
        toMessageText: undefined,
    });

    const color =
        themeMode === "light"
            ? LIGHT_THEME_COLORS.palette
            : DARK_THEME_COLORS.palette;

    const theme = useMemo(
        () =>
            createTheme({
                ...THEME_VALUES,
                palette: {
                    mode: themeMode,
                    ...color,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [themeMode]
    );

    const signOut = async (): Promise<void> => {
        try {
            let token = null;
            if (session) token = session.access_token;

            setNull();
            localStorage.clear();
            if (token) await logout(token);
            await supabase.auth.signOut();
        } catch (e) {
            console.error(e);
        }
    };

    const setNull = (): void => {
        setUser(null);
        setSession(null);
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<AuthError | null> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return error;
        } catch (e) {
            throw new Error("Cannot login.");
        }
    };

    const refreshToken = async (): Promise<void> => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            const { session: newSession, user: newUser } = data;
            if (error) throw error;
            setSession(newSession);
            setUser(newUser);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const getSupabase = (): (() => void) => {
            supabase.auth
                .getSession()
                .then(({ data: { session }, error: supabaseError }) => {
                    if (supabaseError) throw supabaseError;
                    setSession(session);
                });

            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session && session.user) {
                    setSession(session);
                    setUser(session.user);
                }
            });

            return () => subscription.unsubscribe();
        };

        try {
            return getSupabase();
        } catch (error) {
            console.error(error);
        }

        return undefined;
    }, []);

    const value: CAAuth = {
        session,
        user,
        profile,
        signOut,
        signInWithPassword: signIn,
        setNull,
        refreshToken,
        setThemeMode,
        themeMode,
        chatTheme,
        handleChatTheme,
        clearChatTheme,
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <AuthContext.Provider value={value}>
                    {children}
                </AuthContext.Provider>
            </CssBaseline>
        </ThemeProvider>
    );
};

export default AuthProvider;
