import { Profile } from "@/types/profile";
import { ChatMessageTheme } from "@/types/theme";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { Dispatch, createContext } from "react";

export type CAAuth = {
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
    chatTheme: ChatMessageTheme;
    handleChatTheme: () => void;
    clearChatTheme: () => void;
};

export const AuthContext = createContext<CAAuth>({
    session: null,
    user: null,
    profile: null,
    signOut: async () => {},
    // eslint-disable-next-line @typescript-eslint/require-await
    signInWithPassword: async () => {
        return null;
    },
    setNull: () => {},
    refreshToken: async () => {},
    setThemeMode: () => {},
    themeMode: "light",
    chatTheme: {
        fromMessageBox: "secondary.main",
        toMessageBox: "info.main",
        fromMessageText: undefined,
        toMessageText: undefined,
    },
    handleChatTheme: () => {},
    clearChatTheme: () => {},
});
