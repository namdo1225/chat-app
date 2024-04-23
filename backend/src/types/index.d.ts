import { User } from "@supabase/supabase-js";
import { ChatCreateType } from "./zod";
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
            chat: ChatCreateType
            profile: Profile,
        }
    }
}
