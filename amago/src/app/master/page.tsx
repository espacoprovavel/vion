import { ARQUETIPOS } from '@/lib/motor/arquetipos';
import { NOMES_CAMADA } from '@/lib/motor/perguntas';
import type { CodigoArquetipo } from '@/lib/motor/tipos';
import { criaClienteServidor } from '@/lib/supabase/servidor';

interface Resumo {
  total_mergulhos: number;
  total_pessoas: number;
  com_fosso: number;
  rede_seguranca: number;
}

export default async function MasterPainel() {
  const supabase = await criaClienteServidor();

  const [resumoRes, arquetiposRes, camadasRes, respostasRes] = await Promise.all([
    supabase!.rpc('agregado_resumo'),
    supabase!.rpc('agregado_arquetipos'),
    supabase!.rpc('agregado_camadas_veu'),
    supabase!.rpc('agregado_respostas'),
  ]);

  const resumo = (resumoRes.data?.[0] ?? {
    total_mergulhos: 0,
    total_pessoas: 0,
    com_fosso: 0,
    rede_seguranca: 0,
  }) as Resumo;

  const porArquetipo = (arquetiposRes.data ?? []) as { arquetipo: string; total: number }[];
  const porCamada = (camadasRes.data ?? []) as { camada: string; total: number }[];
  const porResposta = (respostasRes.data ?? []) as {
    question_chave: string;
    option_chave: string;
    option_texto: string;
    total: number;
  }[];

  const agrupadas = new Map<string, typeof porResposta>();
  for (const linha of porResposta) {
    const lista = agrupadas.get(linha.question_chave) ?? [];
    lista.push(linha);
    agrupadas.set(linha.question_chave, lista);
  }

  return (
    <div>
      <h1 className="display text-2xl mb-2">Painel</h1>
      <p className="text-sm text-tinta-tenue mb-10 max-w-2xl leading-relaxed">
        Números agregados e anónimos. Nenhum ecrã desta área liga uma resposta a uma pessoa, e o
        texto livre que as pessoas escrevem à entrada nunca entra aqui.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        <Cartao rotulo="Mergulhos" valor={resumo.total_mergulhos} />
        <Cartao rotulo="Pessoas" valor={resumo.total_pessoas} />
        <Cartao rotulo="Com fosso" valor={resumo.com_fosso} />
        <Cartao rotulo="Rede de segurança" valor={resumo.rede_seguranca} />
      </div>

      <Seccao titulo="Padrão de sombra dominante">
        <Barras
          linhas={porArquetipo.map((l) => ({
            rotulo: ARQUETIPOS[l.arquetipo as CodigoArquetipo]?.nomeSombra ?? l.arquetipo,
            total: Number(l.total),
          }))}
        />
      </Seccao>

      <Seccao titulo="Camada onde assenta o Véu">
        <Barras
          linhas={porCamada.map((l) => ({
            rotulo: NOMES_CAMADA[l.camada] ?? l.camada,
            total: Number(l.total),
          }))}
        />
      </Seccao>

      <Seccao titulo="Respostas escolhidas, pergunta a pergunta">
        {agrupadas.size === 0 ? (
          <p className="text-sm text-tinta-tenue">Ainda não há respostas.</p>
        ) : (
          <div className="space-y-8">
            {[...agrupadas.entries()]
              .sort(([a], [b]) => a.localeCompare(b, 'pt', { numeric: true }))
              .map(([chave, linhas]) => (
                <div key={chave}>
                  <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue mb-3">
                    {chave}
                  </p>
                  <Barras
                    linhas={linhas.map((l) => ({
                      rotulo: l.option_texto,
                      total: Number(l.total),
                    }))}
                  />
                </div>
              ))}
          </div>
        )}
      </Seccao>
    </div>
  );
}

function Cartao({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="rounded-2xl border border-linha px-5 py-5">
      <p className="display text-3xl tabular-nums">{valor ?? 0}</p>
      <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue mt-1.5">{rotulo}</p>
    </div>
  );
}

function Seccao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="display text-lg mb-5 border-b border-linha pb-3">{titulo}</h2>
      {children}
    </section>
  );
}

function Barras({ linhas }: { linhas: { rotulo: string; total: number }[] }) {
  if (linhas.length === 0) {
    return <p className="text-sm text-tinta-tenue">Ainda não há dados.</p>;
  }
  const maximo = Math.max(...linhas.map((l) => l.total), 1);

  return (
    <ul className="space-y-2.5">
      {linhas.map((l) => (
        <li key={l.rotulo} className="grid grid-cols-[1fr_3rem] items-center gap-3">
          <div>
            <span className="block text-sm mb-1">{l.rotulo}</span>
            <span
              className="block h-1.5 rounded-full bg-barro-suave"
              style={{ width: `${Math.max((l.total / maximo) * 100, 2)}%` }}
            />
          </div>
          <span className="text-sm text-tinta-tenue tabular-nums text-right">{l.total}</span>
        </li>
      ))}
    </ul>
  );
}
