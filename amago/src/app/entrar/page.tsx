import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Autenticacao from '@/components/Autenticacao';
import { SUPABASE_ATIVO } from '@/lib/supabase/config';
import { getUtilizador } from '@/lib/supabase/servidor';

export const metadata: Metadata = { title: 'Entrar — Âmago' };
export const dynamic = 'force-dynamic';

export default async function PaginaEntrar() {
  if (!SUPABASE_ATIVO) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-20 surge">
        <h1 className="display text-2xl mb-4">Contas ainda não estão ligadas</h1>
        <p className="text-tinta-suave leading-relaxed mb-8">
          Esta instalação do Âmago está a correr em modo de demonstração, sem base de dados. O
          Mergulho funciona e a leitura aparece no fim, mas não fica guardada.
        </p>
        <Link
          href="/mergulho"
          className="inline-flex items-center rounded-full bg-tinta px-7 py-3.5 text-papel text-sm hover:bg-barro transition-colors"
        >
          Começar o Mergulho
        </Link>
      </div>
    );
  }

  const utilizador = await getUtilizador();
  if (utilizador) redirect('/historico');

  return <Autenticacao />;
}
