export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Sem chaves, o Âmago corre em modo demonstração: o Mergulho funciona e a
 * leitura é calculada, mas nada é guardado e não há sessão.
 */
export const SUPABASE_ATIVO = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
