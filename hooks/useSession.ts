import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Auth } from '@/lib/auth';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Auth.sessao().then((s) => {
      setSession(s);
      setLoading(false);
    });
    const sub = Auth.onSessionChange((s) => setSession(s));
    return () => sub.unsubscribe?.();
  }, []);

  return {
    session,
    loading,
    user: session?.user ?? null,
    autenticado: !!session,
    nome:
      (session?.user?.user_metadata?.nome as string | undefined) ??
      session?.user?.email?.split('@')[0] ??
      null,
  };
}
