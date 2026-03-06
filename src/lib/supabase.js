import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = (val) => !val || val.includes('your_supabase');

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
    console.error('❌ Supabase credentials missing or still set to defaults in .env.');
    console.warn('Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file with values from your Supabase Dashboard (Project Settings > API).');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
