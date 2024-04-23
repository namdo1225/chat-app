import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from "./utils/config";
import { Database } from "./types/database.types";

const url = SUPABASE_URL as string;
const key = SUPABASE_SERVICE_KEY as string;

const supabase = createClient<Database>(url, key);

const PROFILE_IMAGE_BUCKET = 'profile_images';
const DEFAULT_PROFILE_URL = "https://onzyqnwywxomvmghummg.supabase.co/storage/v1/object/public/profile_images/default.jpg";

export { supabase, PROFILE_IMAGE_BUCKET, DEFAULT_PROFILE_URL };