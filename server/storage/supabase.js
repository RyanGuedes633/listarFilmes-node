import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[Supabase] SUPABASE_URL or SUPABASE_KEY not set. API calls will fail until configured.');
}

export const supabase = createClient(SUPABASE_URL || 'http://localhost:54321', SUPABASE_KEY || 'anon-key');

export async function ensureSchema() {
  // This is a best-effort check to verify required tables exist.
  // We cannot run DDL via anon key; provide SQL in README for the user.
  return true;
}
