import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wlwlpkizjxtbgjiwmpdk.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rWG8AwDd_PYGGBDpPvlEvg_-Y1XdsL1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
