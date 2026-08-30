import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import LeituraCompleta from '@/components/Leitura';
import type { Leitura } from '@/lib/motor/tipos';
import { criaClienteServidor } from '@/lib/supabase/servidor';

export const metadata: Metadata = { title: 'A tua leitura — Âmago' };
export const dynamic = 'force-dynamic';

export default async function PaginaResultado({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await criaClienteServidor();
  if (!supabase) redirect('/mergulho');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/entrar');

  // O RLS já limita a leitura ao dono do mergulho; o filtro explícito é a
  // segunda tranca, para o caso de uma política ser afrouxada por engano.
  const { data } = await supabase
    .from('results')
    .select('leitura, criado_em, assessments!inner(user_id)')
    .eq('assessment_id', id)
    .eq('assessments.user_id', user.id)
    .maybeSingle();

  if (!data?.leitura) notFound();

  const data_ = new Date(data.criado_em).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return <LeituraCompleta leitura={data.leitura as Leitura} guardado data={data_} />;
}
