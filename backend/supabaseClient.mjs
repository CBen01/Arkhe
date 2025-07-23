import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xrdwoluqqzilvbrmavko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZHdvbHVxcXppbHZicm1hdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjUyNzAsImV4cCI6MjA2ODYwMTI3MH0.D2mjDIvlyRYIcz8CaCF3LZEDFvJX38rvu-ZiGlko4Cw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);