export const NODE_ENV = import.meta.env.MODE;
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const BACKEND_URL = NODE_ENV === "development" ? import.meta.env.VITE_DEV_BACKEND_URL : "";
export const MAX_FILE_SIZE = 50_000; //50KB
export const VALID_IMAGE_TYPES = ["png", "jpg", "jpeg"];
export const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY;