import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseKey) return false;
  if (supabaseKey === "YOUR_PUBLISHABLE_KEY" || supabaseKey.startsWith("YOUR_")) return false;
  return supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://");
};

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn("Failed to initialize Supabase client:", error);
  }
}

export const supabase = client;
