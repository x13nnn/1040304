import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usuwykorxtigcfgcyogv.supabase.co'; // 替換為您的實際 URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzdXd5a29yeHRpZ2NmZ2N5b2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDEwNzEsImV4cCI6MjA1ODQ3NzA3MX0.drJOXzL7m9CG9dvev6S2amOG-bAQePV9IkVdChd8CMo'; // 替換為您的匿名金鑰
export const supabase = createClient(supabaseUrl, supabaseKey);