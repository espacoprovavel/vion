import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_ATIVO, SUPABASE_URL } from './config';

/** Cliente Supabase do lado do servidor. Devolve null em modo demonstração. */
export async function criaClienteServidor() {
  if (!SUPABASE_ATIVO) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado a partir de um Server Component: o middleware trata da renovação.
        }
      },
    },
  });
}

export interface PerfilUtilizador {
  id: string;
  email: string | null;
  role: 'user' | 'master';
}

export async function getUtilizador(): Promise<PerfilUtilizador | null> {
  const supabase = await criaClienteServidor();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: perfil } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: perfil?.email ?? user.email ?? null,
    role: (perfil?.role as 'user' | 'master') ?? 'user',
  };
}

export async function exigeMaster(): Promise<PerfilUtilizador | null> {
  const perfil = await getUtilizador();
  return perfil?.role === 'master' ? perfil : null;
}
