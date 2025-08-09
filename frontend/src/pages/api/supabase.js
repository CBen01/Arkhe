import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xrdwoluqqzilvbrmavko.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZHdvbHVxcXppbHZicm1hdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjUyNzAsImV4cCI6MjA2ODYwMTI3MH0.D2mjDIvlyRYIcz8CaCF3LZEDFvJX38rvu-ZiGlko4Cw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);