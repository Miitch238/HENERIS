import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://marwnmbfwlaoeaxdoolg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcndubWJmd2xhb2VheGRvb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjczNzAsImV4cCI6MjA5NDEwMzM3MH0.h_ZXshdAle7lIbFOVBCKW9_LiHG_B1AmYynqKkBAZKE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
