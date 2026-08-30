import 'server-only';
import { ARQUETIPOS } from '@/lib/motor/arquetipos';
import { PERGUNTAS_SEMENTE } from '@/lib/motor/perguntas';
import type { Arquetipo, CodigoArquetipo, Pergunta, Ronda, TipoPergunta } from '@/lib/motor/tipos';
import { criaClienteServidor } from '@/lib/supabase/servidor';

/**
 * O conteúdo do Mergulho vive na base de dados e é gerido na área Master.
 * Sem Supabase — ou se a leitura falhar — cai no conteúdo-semente em código,
 * para que a app nunca fique sem perguntas.
 */

interface LinhaOpcao {
  id: string;
  chave: string;
  texto: string;
  arquetipo: string | null;
  camada: string | null;
  peso_camada: number | null;
  ordem: number;
}

interface LinhaPergunta {
  id: string;
  chave: string;
  texto: string;
  nota: string | null;
  ronda: number;
  tipo: string;
  peso: number;
  peso_camada: number;
  ativo: boolean;
  ordem: number;
  answer_options: LinhaOpcao[];
}

export interface ConteudoMergulho {
  perguntas: Pergunta[];
  arquetipos: Record<CodigoArquetipo, Arquetipo>;
  /** true quando o conteúdo veio da base de dados. */
  daBaseDeDados: boolean;
  /** chave -> uuid, para gravar as respostas com as chaves estrangeiras certas. */
  idsPergunta: Record<string, string>;
  idsOpcao: Record<string, string>;
}

function mapeiaPergunta(l: LinhaPergunta): Pergunta {
  return {
    id: l.chave,
    texto: l.texto,
    nota: l.nota ?? undefined,
    ronda: l.ronda as Ronda,
    tipo: l.tipo as TipoPergunta,
    ativo: l.ativo,
    ordem: l.ordem,
    peso: Number(l.peso),
    pesoCamada: Number(l.peso_camada),
    opcoes: (l.answer_options ?? [])
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .map((o) => ({
        id: o.chave,
        texto: o.texto,
        arquetipo: (o.arquetipo as CodigoArquetipo | null) ?? null,
        camada: (o.camada as Pergunta['opcoes'][number]['camada']) ?? null,
        pesoCamada: o.peso_camada === null ? undefined : Number(o.peso_camada),
        ordem: o.ordem,
      })),
  };
}

export async function carregaConteudo(): Promise<ConteudoMergulho> {
  const semente: ConteudoMergulho = {
    perguntas: PERGUNTAS_SEMENTE.filter((p) => p.ativo),
    arquetipos: ARQUETIPOS,
    daBaseDeDados: false,
    idsPergunta: {},
    idsOpcao: {},
  };

  const supabase = await criaClienteServidor();
  if (!supabase) return semente;

  const [{ data: perguntas }, { data: arquetipos }] = await Promise.all([
    supabase
      .from('questions')
      .select(
        'id, chave, texto, nota, ronda, tipo, peso, peso_camada, ativo, ordem, ' +
          'answer_options ( id, chave, texto, arquetipo, camada, peso_camada, ordem )',
      )
      .eq('ativo', true)
      .order('ordem'),
    supabase.from('archetypes').select('*').eq('ativo', true).order('ordem'),
  ]);

  if (!perguntas?.length) return semente;

  const mapaArquetipos = { ...ARQUETIPOS };
  for (const a of arquetipos ?? []) {
    const codigo = a.codigo as CodigoArquetipo;
    if (!(codigo in mapaArquetipos)) continue;
    mapaArquetipos[codigo] = {
      codigo,
      nomeSombra: a.nome_sombra,
      nomeIntegrado: a.nome_integrado,
      medo: a.medo,
      caminho: a.caminho,
      descricao: a.descricao ?? '',
      proximoPasso: a.proximo_passo ?? ARQUETIPOS[codigo].proximoPasso,
      textoToque: {
        reconhece: a.toque_reconhece ?? '',
        agradece: a.toque_agradece ?? '',
        liberta: a.toque_liberta ?? '',
      },
    };
  }

  const mapeadas = (perguntas as unknown as LinhaPergunta[])
    .map(mapeiaPergunta)
    .filter((p) => p.opcoes.length > 0);

  if (!mapeadas.length) return semente;

  const idsPergunta: Record<string, string> = {};
  const idsOpcao: Record<string, string> = {};
  for (const l of perguntas as unknown as LinhaPergunta[]) {
    idsPergunta[l.chave] = l.id;
    for (const o of l.answer_options ?? []) idsOpcao[o.chave] = o.id;
  }

  return {
    perguntas: mapeadas,
    arquetipos: mapaArquetipos,
    daBaseDeDados: true,
    idsPergunta,
    idsOpcao,
  };
}
