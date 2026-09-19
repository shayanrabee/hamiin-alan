import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://egijieqkaizqljyysqed.supabase.co";

const supabaseAnonKey =
  "sb_publishable_8HeUo_dMm7lsWmDzx3wKRg_ZcCQb";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
