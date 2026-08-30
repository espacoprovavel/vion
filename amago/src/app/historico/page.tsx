import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SUPABASE_ATIVO } from '@/lib/supabase/config';
import { criaClienteServidor } from '@/lib/supabase/servidor';

export const metadata: Metadata = { title: 'Histórico — Âmago' };
export const dynamic = 'force-dynamic';

const PORTAS: Record<string, string> = {
  duvida: 'uma dúvida',
  curiosidade: 'uma curiosidade',
  dificuldade: 'uma dificuldade',
};

interface LinhaHistorico {
  id: string;
  porta: string;
  criado_em: string;
  results: {
    arquetipo_sombra: string;
    arquetipo_integrado: string;
    camada_veu: string;
    fosso_detetado: boolean;
    leitura: { arquetipoSombra?: { nomeSombra?: string } } | null;
  }[];
}

export default async function Historico() {
  if (!SUPABASE_ATIVO) redirect('/mergulho');

  const supabase = await criaClienteServidor();
  if (!supabase) redirect('/mergulho');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/entrar');

  const { data } = await supabase
    .from('assessments')
    .select(
      'id, porta, criado_em, results ( arquetipo_sombra, arquetipo_integrado, camada_veu, fosso_detetado, leitura )',
    )
    .order('criado_em', { ascending: false });

  const linhas = (data ?? []) as unknown as LinhaHistorico[];

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 surge">
      <h1 className="display text-3xl mb-3">O teu histórico</h1>
      <p className="text-tinta-suave leading-relaxed mb-10">
        Cada mergulho é uma fotografia de um momento. O que muda entre eles costuma dizer tanto
        como cada um deles sozinho.
      </p>

      {linhas.length === 0 ? (
        <div className="rounded-2xl border border-linha px-6 py-10 text-center">
          <p className="text-tinta-suave mb-6">Ainda não fizeste nenhum mergulho.</p>
          <Link
            href="/mergulho"
            className="inline-flex items-center rounded-full bg-tinta px-7 py-3.5 text-papel text-sm hover:bg-barro transition-colors"
          >
            Começar o Mergulho
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-linha border-y border-linha">
          {linhas.map((linha) => {
            const resultado = linha.results?.[0];
            const nome = resultado?.leitura?.arquetipoSombra?.nomeSombra ?? resultado?.arquetipo_sombra;
            return (
              <li key={linha.id}>
                <Link
                  href={`/resultado/${linha.id}`}
                  className="flex items-baseline justify-between gap-4 py-5 group"
                >
                  <span>
                    <span className="display text-xl group-hover:text-barro transition-colors">
                      {nome ?? 'Leitura'}
                    </span>
                    {resultado && (
                      <span className="block text-sm text-tinta-suave mt-1">
                        → {resultado.arquetipo_integrado}
                        {resultado.fosso_detetado && ' · com fosso'}
                      </span>
                    )}
                    <span className="block text-sm text-tinta-tenue mt-1">
                      Entraste com {PORTAS[linha.porta] ?? linha.porta}
                    </span>
                  </span>
                  <time
                    dateTime={linha.criado_em}
                    className="text-sm text-tinta-tenue shrink-0 tabular-nums"
                  >
                    {new Date(linha.criado_em).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </time>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-10">
        <Link
          href="/mergulho"
          className="inline-flex items-center rounded-full border border-linha px-6 py-3 text-sm hover:border-barro transition-colors"
        >
          Mergulhar outra vez
        </Link>
      </div>
    </div>
  );
}
