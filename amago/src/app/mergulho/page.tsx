import type { Metadata } from 'next';
import Mergulho from '@/components/Mergulho';
import { carregaConteudo } from '@/lib/conteudo';
import { getUtilizador } from '@/lib/supabase/servidor';

export const metadata: Metadata = { title: 'O Mergulho — Âmago' };
export const dynamic = 'force-dynamic';

export default async function PaginaMergulho() {
  const [conteudo, utilizador] = await Promise.all([carregaConteudo(), getUtilizador()]);

  return <Mergulho perguntas={conteudo.perguntas} autenticado={Boolean(utilizador)} />;
}
