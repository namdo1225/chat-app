import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

const url = SUPABASE_URL as string;
const key = SUPABASE_ANON_KEY as string;

const supabase = createClient(url, key);

export { supabase };