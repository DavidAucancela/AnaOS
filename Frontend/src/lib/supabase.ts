import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://qmmubykqkbrgaalgpsgz.supabase.co';
const supabaseKey = 'sb_publishable_ZWYgS6QLS3C0JqQyq_lg9g_n_4TJKIX';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };