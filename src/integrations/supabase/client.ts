import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: verifique se as variáveis estão sendo carregadas
console.log('🔍 VITE_SUPABASE_URL:', supabaseUrl);
console.log('🔍 VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Carregada' : '❌ Não carregada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente não configuradas!');
  console.error('Certifique-se de que o arquivo .env existe na raiz do projeto');
  console.error('E contém VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);