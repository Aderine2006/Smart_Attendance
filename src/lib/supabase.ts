import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client if environment variables are not set
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a flag to check if we're using mock data
export const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Predefined team members
export const TEAM_MEMBERS = [
  { email: 'admin@team.com', name: 'Team Lead', role: 'admin' as const },
  { email: 'member1@team.com', name: 'Developer 1', role: 'member' as const },
  { email: 'member2@team.com', name: 'Designer', role: 'member' as const },
  { email: 'member3@team.com', name: 'Developer 2', role: 'member' as const },
  { email: 'member4@team.com', name: 'QA Engineer', role: 'member' as const },
  { email: 'member5@team.com', name: 'Project Manager', role: 'member' as const },
];