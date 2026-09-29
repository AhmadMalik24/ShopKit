// src/integrations/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Uploads will fail.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'shopkit-media';
export default supabase;