import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || "3001";
export const SECRET = process.env.SECRET || "Test";
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
export const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const REDIRECT_URL = (
    NODE_ENV === "production"
        ? process.env.PROD_REDIRECT_URL
        : process.env.DEV_REDIRECT_URL
) as string;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const PROFILE_WIDTH_HEIGHT = 200;
export const REDIS_URL = (
    NODE_ENV === "production"
        ? process.env.PROD_REDIRECT_URL
        : process.env.DEV_REDIS_URL
) as string;
