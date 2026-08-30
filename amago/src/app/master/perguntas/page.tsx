import { CODIGOS_ARQUETIPO } from '@/lib/motor/arquetipos';
import { criaClienteServidor } from '@/lib/supabase/servidor';
import { Area, BotaoGuardar, Campo, Escolha, Interruptor } from '@/components/master/Campos';
import { guardaPergunta } from '../acoes';

const TIPOS = [
  { valor: 'arquetipo', rotulo: 'arquétipo' },
  { valor: 'camada', rotulo: 'camada' },
  { valor: 'somatica', rotulo: 'somática' },
  { valor: 'autodeclaracao', rotulo: 'auto-declaração' },
];

const CAMADAS = [
  { valor: '', rotulo: '—' },
  { valor: 'comportamento', rotulo: 'Comportamento' },
  { valor: 'historia', rotulo: 'História' },
  { valor: 'funcao', rotulo: 'Função' },
  { valor: 'terreno', rotulo: 'Terreno' },
  { valor: 'comando', rotulo: 'Comando' },
  { valor: 'gatilho', rotulo: 'Gatilho' },
];

const ARQUETIPOS_OPCOES = [
  { valor: '', rotulo: '—' },
  ...CODIGOS_ARQUETIPO.map((c) => ({ valor: c, rotulo: c })),
];

interface Opcao {
  id: string;
  chave: string;
  texto: string;
  arquetipo: string | null;
  camada: string | null;
  peso_camada: number | null;
  ordem: number;
}

interface Pergunta {
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
  answer_options: Opcao[];
}

export default async function MasterPerguntas() {
  const supabase = await criaClienteServidor();
  const { data } = (await supabase!
    .from('questions')
    .select(
      'id, chave, texto, nota, ronda, tipo, peso, peso_camada, ativo, ordem, ' +
        'answer_options ( id, chave, texto, arquetipo, camada, peso_camada, ordem )',
    )
    .order('ordem')) as { data: Pergunta[] | null };

  const perguntas = data ?? [];

  return (
    <div>
      <h1 className="display text-2xl mb-2">Perguntas, rondas e respostas</h1>
      <p className="text-sm text-tinta-suave mb-3 max-w-2xl leading-relaxed">
        Cada resposta pode acionar dois sinais: um <strong className="font-medium">arquétipo</strong>{' '}
        (soma o peso da pergunta à pontuação desse padrão) e uma{' '}
        <strong className="font-medium">camada</strong> (pesa na escolha do Véu).
      </p>
      <p className="text-sm text-tinta-tenue mb-10 max-w-2xl leading-relaxed">
        O peso da camada de uma resposta sobrepõe-se ao da pergunta quando é preenchido. Deixá-lo a
        zero mantém a camada como etiqueta, sem contar para o Véu. As chaves (q1, q1a…) são fixas —
        o motor usa-as para reconhecer as perguntas com papel especial.
      </p>

      {perguntas.length === 0 && (
        <p className="rounded-xl border border-linha px-5 py-4 text-sm text-tinta-suave">
          Não há perguntas na base de dados. Corre <code>supabase/seed.sql</code> para semear o
          conteúdo inicial.
        </p>
      )}

      <div className="space-y-10">
        {perguntas.map((p) => (
          <form
            key={p.id}
            action={guardaPergunta}
            className="rounded-2xl border border-linha px-5 py-5 sm:px-6 sm:py-6"
          >
            <input type="hidden" name="id" value={p.id} />

            <div className="flex items-center justify-between gap-4 mb-5">
              <span className="text-xs uppercase tracking-[0.12em] text-tinta-tenue">
                {p.chave}
              </span>
              <Interruptor rotulo="Ativa" nome="ativo" ligado={p.ativo} />
            </div>

            <div className="space-y-4">
              <Area rotulo="Texto da pergunta" nome="texto" valor={p.texto} linhas={2} />
              <Area
                rotulo="Nota"
                nome="nota"
                valor={p.nota}
                linhas={2}
                ajuda="Linha permissiva mostrada por baixo da pergunta. Opcional."
              />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Campo rotulo="Ronda" nome="ronda" valor={p.ronda} tipo="number" />
                <Escolha rotulo="Tipo" nome="tipo" valor={p.tipo} opcoes={TIPOS} />
                <Campo rotulo="Peso" nome="peso" valor={p.peso} tipo="number" />
                <Campo rotulo="Peso camada" nome="peso_camada" valor={p.peso_camada} tipo="number" />
                <Campo rotulo="Ordem" nome="ordem" valor={p.ordem} tipo="number" />
              </div>
            </div>

            <div className="mt-6 border-t border-linha pt-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue">Respostas</p>
              {[...p.answer_options].sort((a, b) => a.ordem - b.ordem).map((o) => (
                <div
                  key={o.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_9rem_9rem_5rem_4rem] gap-2 items-end"
                >
                  <Campo rotulo={o.chave} nome={`opcao:${o.id}:texto`} valor={o.texto} />
                  <Escolha
                    rotulo="Arquétipo"
                    nome={`opcao:${o.id}:arquetipo`}
                    valor={o.arquetipo}
                    opcoes={ARQUETIPOS_OPCOES}
                  />
                  <Escolha
                    rotulo="Camada"
                    nome={`opcao:${o.id}:camada`}
                    valor={o.camada}
                    opcoes={CAMADAS}
                  />
                  <Campo
                    rotulo="Peso c."
                    nome={`opcao:${o.id}:peso_camada`}
                    valor={o.peso_camada}
                    tipo="number"
                  />
                  <Campo rotulo="Ordem" nome={`opcao:${o.id}:ordem`} valor={o.ordem} tipo="number" />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <BotaoGuardar />
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
