import { User } from "@supabase/supabase-js";
import { Chat } from "./chat";
import { Readable } from "stream";
import { Profile } from "./profile";
export {};

declare global {
    namespace Express {
        /**
         * Additional fields are declared for this application.
         */
        interface Request {
            token: string | null | undefined;
            user: User;
            fileData: Readable;
            fileExtension: string;
            chat: Chat;
            profile: Profile;
            begin: number;
            end: number;
        }
    }
}
