// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qrhwhcpugvonetlnwtdw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaHdoY3B1Z3ZvbmV0bG53dGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDAyODMsImV4cCI6MjA2NjQxNjI4M30.c01mMsgTf86RbZ5ZE8FcEpP975PKN5zBtzprXbnsPkk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);