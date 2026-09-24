import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const authConfigurationError = !url || !key || !process.env.EXPO_PUBLIC_API_URL
  ? 'Falta configurar Supabase o la API. Revisa el archivo .env y reinicia Expo.'
  : null;

// No crear un cliente con credenciales ficticias si falta la configuracion.
export const supabase = url && key ? createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    storageKey: 'schoolmanager-mobile-auth',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
}) : null;
