import { useState, useEffect, useMemo, Dispatch } from "react";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { supabase } from "@/config/supabase";
import { logout } from "@/services/users";
import { Profile } from "@/types/profile";
import { useOwnProfile } from "@/hooks/useUser";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import {
    THEME_VALUES,
    LIGHT_THEME_COLORS,
    DARK_THEME_COLORS,
} from "@/types/theme";

const AuthContext = createContext<{
    session: Session | null | undefined;
    user: User | null | undefined;
    profile: Profile | null | undefined;
    signInWithPassword: (
        email: string,
        password: string
    ) => Promise<AuthError | null>;
    signOut: () => void;
    setNull: () => void;
    refreshToken: () => Promise<void>;
    setThemeMode: Dispatch<React.SetStateAction<"dark" | "light">>;
    themeMode: string;
}>({
    session: null,
    user: null,
    profile: null,
    signOut: async () => {},
    signInWithPassword: async () => {
        return null;
    },
    setNull: () => {},
    refreshToken: async () => {},
    setThemeMode: () => {},
    themeMode: "light",
});

/**
 *
 * Thank you to: https://github.com/daniellaera/react-supabase-auth-provider/blob/main/src/hooks/Auth.tsx
 *
 * @param param0
 * @returns
 */
const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>();
    const [session, setSession] = useState<Session | null>();
    const { data: profile } = useOwnProfile(user);
    const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
        const theme = localStorage.getItem("theme");
        return theme === "light" || theme === "dark" ? theme : "light";
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
        [themeMode]
    );

    const signOut = async () => {
        try {
            let token = null;
            if (session) token = session.access_token;

            setNull();
            if (token) await logout(token);
            await supabase.auth.signOut();
        } catch (e) {
            console.error(e);
        }
    };

    const setNull = () => {
        setUser(null);
        setSession(null);
    };

    const signIn = async (email: string, password: string) => {
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

    const refreshToken = async () => {
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
        const getSupabase = () => {
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

    const value = {
        session,
        user,
        profile,
        signOut,
        signInWithPassword: signIn,
        setNull,
        refreshToken,
        setThemeMode,
        themeMode,
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

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
