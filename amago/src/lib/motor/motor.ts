import {
  ARQUETIPOS,
  ARQUETIPOS_QUE_RECUAM,
  CODIGOS_ARQUETIPO,
  PRIORIDADE_DESEMPATE,
} from './arquetipos';
import { linhaDasLentes } from './lentes';
import {
  AFIRMACOES_FORTES,
  DESCRICOES_CAMADA,
  IDS_ESPECIAIS,
  NOMES_CAMADA,
} from './perguntas';
import type {
  Arquetipo,
  Camada,
  CodigoArquetipo,
  EntradaMergulho,
  Fosso,
  Leitura,
  MapaRespostas,
  OpcaoResposta,
  Pergunta,
} from './tipos';

const CAMADAS: Camada[] = [
  'comportamento',
  'historia',
  'funcao',
  'terreno',
  'comando',
  'gatilho',
];

/** Desempate das camadas: a mais funda ganha quando a pontuação empata. */
const PRIORIDADE_CAMADA: Camada[] = [
  'comando',
  'terreno',
  'funcao',
  'historia',
  'gatilho',
  'comportamento',
];

interface RespostaResolvida {
  pergunta: Pergunta;
  opcao: OpcaoResposta;
}

function resolveRespostas(perguntas: Pergunta[], respostas: MapaRespostas): RespostaResolvida[] {
  const out: RespostaResolvida[] = [];
  for (const pergunta of perguntas) {
    const opcaoId = respostas[pergunta.id];
    if (!opcaoId) continue;
    const opcao = pergunta.opcoes.find((o) => o.id === opcaoId);
    if (opcao) out.push({ pergunta, opcao });
  }
  return out;
}

/** Pontuação por arquétipo: soma dos pesos das perguntas respondidas. */
function pontuaArquetipos(resolvidas: RespostaResolvida[]): Record<CodigoArquetipo, number> {
  const pontos = Object.fromEntries(
    CODIGOS_ARQUETIPO.map((c) => [c, 0]),
  ) as Record<CodigoArquetipo, number>;

  for (const { pergunta, opcao } of resolvidas) {
    if (!opcao.arquetipo || pergunta.peso <= 0) continue;
    pontos[opcao.arquetipo] += pergunta.peso;
  }
  return pontos;
}

function dominante(pontos: Record<CodigoArquetipo, number>): CodigoArquetipo {
  let melhor: CodigoArquetipo = PRIORIDADE_DESEMPATE[0];
  for (const codigo of PRIORIDADE_DESEMPATE) {
    if (pontos[codigo] > pontos[melhor]) melhor = codigo;
  }
  return melhor;
}

/**
 * Pontuação das camadas — só contam as perguntas que perguntam pelo que a
 * pessoa NÃO vê. As camadas marcadas nas respostas de arquétipo ficam como
 * metadados (pesoCamada 0) e servem o painel Master.
 */
function pontuaCamadas(resolvidas: RespostaResolvida[]): Record<Camada, number> {
  const pontos = Object.fromEntries(CAMADAS.map((c) => [c, 0])) as Record<Camada, number>;

  for (const { pergunta, opcao } of resolvidas) {
    if (!opcao.camada) continue;
    const peso = opcao.pesoCamada ?? pergunta.pesoCamada;
    if (peso > 0) pontos[opcao.camada] += peso;
  }
  return pontos;
}

function camadaDominante(pontos: Record<Camada, number>): Camada {
  let melhor: Camada = PRIORIDADE_CAMADA[0];
  for (const camada of PRIORIDADE_CAMADA) {
    if (pontos[camada] > pontos[melhor]) melhor = camada;
  }
  // Nenhum sinal: a Função é a camada em que o Véu assenta por omissão,
  // porque é a que a pessoa menos costuma conseguir nomear sozinha.
  return pontos[melhor] > 0 ? melhor : 'funcao';
}

function textoDaOpcao(
  perguntas: Pergunta[],
  respostas: MapaRespostas,
  perguntaId: string,
): string | null {
  const pergunta = perguntas.find((p) => p.id === perguntaId);
  if (!pergunta) return null;
  const opcao = pergunta.opcoes.find((o) => o.id === respostas[pergunta.id]);
  return opcao?.texto ?? null;
}

/**
 * Frases escritas à mão para cada auto-declaração: compor por concatenação daria
 * ambiguidades feias em português ("avanças sempre que aparece…").
 */
const FRASE_AVANCO: Record<string, string> = {
  Sempre: 'que avanças sem hesitar quando aparece uma hipótese de crescer',
  'Quase sempre': 'que quase sempre avanças sem hesitar quando aparece uma hipótese de crescer',
};

const FRASE_RESPONSABILIDADE: Record<string, string> = {
  Sempre: 'que assumes sempre a responsabilidade quando algo corre mal',
  'Quase sempre': 'que quase sempre assumes a responsabilidade quando algo corre mal',
};

/**
 * O FOSSO consciente/inconsciente: comparar o que a pessoa AFIRMA sobre si com
 * o PADRÃO que as respostas mostram. Onde não batem certo, está o Véu.
 */
function detetaFosso(
  perguntas: Pergunta[],
  respostas: MapaRespostas,
  arquetipo: CodigoArquetipo,
  a: Arquetipo,
): { fosso: Fosso; reforcoCamada: Partial<Record<Camada, number>> } {
  const recua = ARQUETIPOS_QUE_RECUAM.includes(arquetipo);

  const respResponsabilidade = textoDaOpcao(
    perguntas,
    respostas,
    IDS_ESPECIAIS.autodeclaracaoResponsabilidade,
  );
  const respAvanco = textoDaOpcao(perguntas, respostas, IDS_ESPECIAIS.autodeclaracaoAvanco);

  const afirmaResponsabilidade = !!respResponsabilidade && AFIRMACOES_FORTES.includes(respResponsabilidade);
  const afirmaAvanco = !!respAvanco && AFIRMACOES_FORTES.includes(respAvanco);

  if (!recua || (!afirmaResponsabilidade && !afirmaAvanco)) {
    return {
      fosso: { detetado: false, oQueDizes: '', oQueMostras: '', camadaApontada: null },
      reforcoCamada: {},
    };
  }

  const reforcoCamada: Partial<Record<Camada, number>> = {};
  const diz: string[] = [];
  const mostra: string[] = [];

  if (afirmaAvanco) {
    // Diz que avança, mas o padrão dominante é de recuo:
    // o que ainda não está visto é a Função — o medo que trava.
    reforcoCamada.funcao = (reforcoCamada.funcao ?? 0) + 4;
    diz.push(FRASE_AVANCO[respAvanco!] ?? FRASE_AVANCO.Sempre);
    mostra.push(`um padrão que trava: ${a.nomeSombra} protege-te ${a.medo}`);
  }

  if (afirmaResponsabilidade) {
    // Diz que assume a responsabilidade, mas o padrão é de recuo:
    // o que ainda não está visto é o Comando — quem, cá dentro, decide.
    reforcoCamada.comando = (reforcoCamada.comando ?? 0) + 3;
    diz.push(FRASE_RESPONSABILIDADE[respResponsabilidade!] ?? FRASE_RESPONSABILIDADE.Sempre);
    mostra.push('escolhas em que a decisão parece ser tomada por outra parte de ti, sem te pedir licença');
  }

  const camadaApontada: Camada = reforcoCamada.funcao ? 'funcao' : 'comando';

  return {
    fosso: {
      detetado: true,
      oQueDizes: diz.join(' e '),
      oQueMostras: mostra.join('; e '),
      camadaApontada,
    },
    reforcoCamada,
  };
}

// ── Composição do texto, no tom do Toque ────────────────────────────────────

const ABERTURA_POR_PORTA: Record<string, string> = {
  duvida:
    'Trouxeste uma dúvida. As dúvidas costumam ser perguntas que já sabem a resposta e ainda não a querem dizer em voz alta.',
  curiosidade:
    'Trouxeste curiosidade. É uma boa porta de entrada — vem-se por curiosidade e fica-se por reconhecimento.',
  dificuldade:
    'Trouxeste uma dificuldade. Custa mais entrar por aqui, e é preciso alguma coragem para o fazer.',
};

const CORPO_POR_RESPOSTA: Record<string, string> = {
  'Peito apertado': 'no peito, nesse aperto',
  'Estômago': 'no estômago',
  'Garganta': 'na garganta',
  'Ombros/nuca': 'nos ombros e na nuca',
  'Não sei localizar': 'no corpo, mesmo sem saberes ainda onde',
};

function fraseSomatica(somatica: string | null): string {
  if (!somatica) return '';
  const local = CORPO_POR_RESPOSTA[somatica] ?? 'no corpo';
  if (somatica === 'Não sei localizar') {
    return 'Ainda não sabes onde é que isto mora no corpo — e não faz mal nenhum. O corpo costuma responder antes de nós percebermos a pergunta; havemos de lá chegar.';
  }
  return `E o corpo já sabia: sentes isto ${local}, e é aí que costuma chegar primeiro, antes de qualquer pensamento.`;
}

export interface DadosLeitura {
  perguntas: Pergunta[];
  respostas: MapaRespostas;
  entrada: EntradaMergulho;
  /** Textos dos arquétipos. Vêm da base de dados quando o Master os edita. */
  arquetipos?: Record<CodigoArquetipo, Arquetipo>;
}

/** O motor. Regras e pontuação — sem IA, sem aleatoriedade. */
export function interpreta({
  perguntas,
  respostas,
  entrada,
  arquetipos = ARQUETIPOS,
}: DadosLeitura): Leitura {
  const resolvidas = resolveRespostas(perguntas, respostas);

  const pontuacoes = pontuaArquetipos(resolvidas);
  const codigo = dominante(pontuacoes);
  const arquetipo = arquetipos[codigo] ?? ARQUETIPOS[codigo];

  const { fosso, reforcoCamada } = detetaFosso(perguntas, respostas, codigo, arquetipo);

  const pontuacoesCamada = pontuaCamadas(resolvidas);
  for (const [camada, peso] of Object.entries(reforcoCamada)) {
    pontuacoesCamada[camada as Camada] += peso ?? 0;
  }

  // Quando há fosso, é ele que decide a camada — é essa a premissa do método:
  // o Véu está onde o que a pessoa afirma não bate certo com o que mostra.
  // As respostas de q9/q10 são auto-relato consciente e só decidem sem fosso.
  // O reforço fica na pontuação para o painel Master poder ver o porquê.
  const camadaVeu =
    fosso.detetado && fosso.camadaApontada
      ? fosso.camadaApontada
      : camadaDominante(pontuacoesCamada);

  const somatica = textoDaOpcao(perguntas, respostas, IDS_ESPECIAIS.somatica);

  const nomeCamada = NOMES_CAMADA[camadaVeu] ?? camadaVeu;
  const descricaoCamada = DESCRICOES_CAMADA[camadaVeu] ?? '';

  const texto = {
    abertura: ABERTURA_POR_PORTA[entrada.porta] ?? ABERTURA_POR_PORTA.curiosidade,
    reconhece: `${arquetipo.textoToque.reconhece} ${arquetipo.descricao}`,
    agradece: `${arquetipo.textoToque.agradece} O que ela guardou, no fundo, foi o medo ${arquetipo.medo}. ${fraseSomatica(somatica)}`.trim(),
    veu: `O teu Véu está sobre ${nomeCamada}: ${descricaoCamada}. Não é falha nenhuma: é só a camada onde a luz ainda não tinha batido.`,
    fosso: fosso.detetado
      ? `Há aqui uma coisa que se diz devagar. Dizes ${fosso.oQueDizes}. E as tuas respostas mostram ${fosso.oQueMostras}. As duas coisas são verdade ao mesmo tempo: uma é o que decides, a outra é o que te acontece antes de decidires. É exatamente nessa distância que o Véu se segura.`
      : null,
    ponte: `Daqui até ${arquetipo.nomeIntegrado} há um caminho, e é este: ${arquetipo.caminho}.`,
    liberta: arquetipo.textoToque.liberta,
  };

  return {
    arquetipoSombra: arquetipo,
    arquetipoIntegrado: arquetipo.nomeIntegrado,
    pontuacoes,
    camadaVeu,
    pontuacoesCamada,
    fosso,
    somatica,
    porta: entrada.porta,
    proximoPasso: arquetipo.proximoPasso,
    lentesUsadas: linhaDasLentes(),
    texto,
  };
}

export { CAMADAS };
