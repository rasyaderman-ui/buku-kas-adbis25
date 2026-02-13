import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqowefwqxdvnqwaeuyfi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxb3dlZndxeGR2bnF3YWV1eWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjE0MDksImV4cCI6MjA4NjQ5NzQwOX0.oIyQzd7h50sVH_mbWYa6v5A9BeZlU8lJXmGyCPSPLXQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
