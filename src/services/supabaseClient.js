import { createClient } from '@supabase/supabase-js'

// --- MANUAL CONFIGURATION (HARDCODED) TO CORRECT THE ERROR ---
// CORRECT URL (With the 'v' at the end) - Sanitized from user input
const supabaseUrl = 'https://mtusqruptgetqmxatvbv.supabase.co'

// JWT ANON KEY (Sanitized: Removed spaces from user input)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dXNxcnVwdGdldHFteGF0dmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNzI5NDQsImV4cCI6MjA4NTY0ODk0NH0.BLMEKgtX8fCkXHEl84zJckRnSETWRJW_i3FfpsVKRa8'

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log("✅ Supabase logged in: ", supabaseUrl);
