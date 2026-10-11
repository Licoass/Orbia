import { createClient } from '@supabase/supabase-js';

// Obtenemos las credenciales desde variables de entorno o desde localStorage (para configuración fácil sin recompilar)
const defaultUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('orbia_supabase_url') || '';
const defaultKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('orbia_supabase_anon_key') || '';

let supabaseInstance = null;

if (defaultUrl && defaultKey) {
  try {
    supabaseInstance = createClient(defaultUrl, defaultKey);
  } catch (err) {
    console.warn('Error al inicializar Supabase:', err);
  }
}

export const getSupabaseClient = () => supabaseInstance;

export const initSupabaseClient = (url, key) => {
  if (!url || !key) {
    supabaseInstance = null;
    localStorage.removeItem('orbia_supabase_url');
    localStorage.removeItem('orbia_supabase_anon_key');
    return null;
  }
  localStorage.setItem('orbia_supabase_url', url);
  localStorage.setItem('orbia_supabase_anon_key', key);
  supabaseInstance = createClient(url, key);
  return supabaseInstance;
};

export const isSupabaseConfigured = () => Boolean(supabaseInstance);
