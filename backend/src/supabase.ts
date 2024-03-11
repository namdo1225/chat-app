import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from "./utils/config";
import { Database } from "./types/database.types";
import { SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient<Database> | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

export { supabase };
