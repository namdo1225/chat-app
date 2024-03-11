import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const SECRET = process.env.SECRET || "Test";
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;