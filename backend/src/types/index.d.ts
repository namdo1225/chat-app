import { User } from "@supabase/supabase-js";
import { Chat } from "./chat";
import { Readable } from "stream";
import { Profile } from "./database.types";
export {};

declare global {
    namespace Express {
        interface Request {
            token: string | null | undefined;
            user: User;
            fileData: Readable;
            fileExtension: string;
            chat: Chat
            profile: Profile,
        }
    }
}
