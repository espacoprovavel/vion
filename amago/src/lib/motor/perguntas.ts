import type { Pergunta } from './tipos';

/**
 * Conteúdo-semente do Mergulho Âmago — 12 perguntas em 3 rondas que aprofundam:
 * superfície (comportamento) -> função e corpo -> raiz, comando e véu.
 *
 * Isto é o fallback em código. Quando o Supabase está ligado, as perguntas vêm
 * da base de dados e podem ser geridas na área Master.
 */
export const PERGUNTAS_SEMENTE: Pergunta[] = [
  // ── RONDA 1 — COMPORTAMENTO (à superfície) ──────────────────────────────
  {
    id: 'q1',
    ronda: 1,
    tipo: 'arquetipo',
    ativo: true,
    ordem: 1,
    peso: 1,
    pesoCamada: 0,
    texto: 'Quando um projeto teu cresce e ganha visibilidade, o que sentes primeiro?',
    nota: 'Não penses muito. A primeira que te ocupa o corpo costuma ser a verdadeira.',
    opcoes: [
      { id: 'q1a', ordem: 1, texto: 'Garantir que nada foge ao controlo', arquetipo: 'controlador', camada: 'comportamento' },
      { id: 'q1b', ordem: 2, texto: 'Tenho de mostrar que mereço', arquetipo: 'provador', camada: 'comportamento' },
      { id: 'q1c', ordem: 3, texto: 'Um aperto, preferia não estar à vista', arquetipo: 'invisivel', camada: 'comportamento' },
      { id: 'q1d', ordem: 4, texto: 'Melhor abrandar', arquetipo: 'guardiao', camada: 'comportamento' },
      { id: 'q1e', ordem: 5, texto: 'E quem ficou para trás?', arquetipo: 'leal', camada: 'comportamento' },
      { id: 'q1f', ordem: 6, texto: 'Isto não é para mim', arquetipo: 'indigno', camada: 'comportamento' },
    ],
  },
  {
    id: 'q2',
    ronda: 1,
    tipo: 'arquetipo',
    ativo: true,
    ordem: 2,
    peso: 1,
    pesoCamada: 0,
    texto: 'O que te trava mesmo tendo tudo para avançar?',
    opcoes: [
      { id: 'q2a', ordem: 1, texto: 'Não confio nos outros', arquetipo: 'controlador', camada: 'comportamento' },
      { id: 'q2b', ordem: 2, texto: 'Ainda não fiz o suficiente', arquetipo: 'provador', camada: 'comportamento' },
      { id: 'q2c', ordem: 3, texto: 'Medo de me expor', arquetipo: 'invisivel', camada: 'comportamento' },
      { id: 'q2d', ordem: 4, texto: 'Espero o momento perfeito', arquetipo: 'guardiao', camada: 'comportamento' },
      { id: 'q2e', ordem: 5, texto: 'Culpa por ir mais longe que os meus', arquetipo: 'leal', camada: 'comportamento' },
      { id: 'q2f', ordem: 6, texto: 'Uma voz que diz que não vou conseguir', arquetipo: 'indigno', camada: 'comportamento' },
    ],
  },
  {
    id: 'q3',
    ronda: 1,
    tipo: 'arquetipo',
    ativo: true,
    ordem: 3,
    peso: 1,
    pesoCamada: 0,
    texto: 'A crítica que mais te magoa é a que te chama…',
    nota: 'Aquilo que mais dói costuma ser aquilo em que já acreditas um bocadinho.',
    opcoes: [
      { id: 'q3a', ordem: 1, texto: 'Controladora', arquetipo: 'controlador', camada: 'historia' },
      { id: 'q3b', ordem: 2, texto: 'Insuficiente', arquetipo: 'provador', camada: 'historia' },
      { id: 'q3c', ordem: 3, texto: '"Demais"', arquetipo: 'invisivel', camada: 'historia' },
      { id: 'q3d', ordem: 4, texto: 'Lenta/indecisa', arquetipo: 'guardiao', camada: 'historia' },
      { id: 'q3e', ordem: 5, texto: 'Egoísta', arquetipo: 'leal', camada: 'historia' },
      { id: 'q3f', ordem: 6, texto: 'Fraude', arquetipo: 'indigno', camada: 'historia' },
    ],
  },
  {
    id: 'q4',
    ronda: 1,
    tipo: 'arquetipo',
    ativo: true,
    ordem: 4,
    peso: 1,
    pesoCamada: 0,
    texto: 'O que costumas adiar mais?',
    opcoes: [
      { id: 'q4a', ordem: 1, texto: 'Largar tarefas para outros', arquetipo: 'controlador', camada: 'comportamento' },
      { id: 'q4b', ordem: 2, texto: 'Dizer "já está bom"', arquetipo: 'provador', camada: 'comportamento' },
      { id: 'q4c', ordem: 3, texto: 'Mostrar o teu trabalho', arquetipo: 'invisivel', camada: 'comportamento' },
      { id: 'q4d', ordem: 4, texto: 'Tomar a decisão', arquetipo: 'guardiao', camada: 'comportamento' },
      { id: 'q4e', ordem: 5, texto: 'Escolher-te primeiro', arquetipo: 'leal', camada: 'comportamento' },
      { id: 'q4f', ordem: 6, texto: 'Aceitar o que já conquistaste', arquetipo: 'indigno', camada: 'comportamento' },
    ],
  },

  // ── RONDA 2 — FUNÇÃO E CORPO (mais fundo) ───────────────────────────────
  {
    id: 'q5',
    ronda: 2,
    tipo: 'arquetipo',
    ativo: true,
    ordem: 5,
    peso: 2,
    pesoCamada: 0,
    texto: 'Quando o padrão dispara, do que é que ele te protege, no fundo?',
    nota: 'Não há resposta errada aqui. Só a que estiver mais perto.',
    opcoes: [
      { id: 'q5a', ordem: 1, texto: 'De perder o controlo', arquetipo: 'controlador', camada: 'funcao' },
      { id: 'q5b', ordem: 2, texto: 'De me sentir insuficiente', arquetipo: 'provador', camada: 'funcao' },
      { id: 'q5c', ordem: 3, texto: 'De ser exposta', arquetipo: 'invisivel', camada: 'funcao' },
      { id: 'q5d', ordem: 4, texto: 'De errar', arquetipo: 'guardiao', camada: 'funcao' },
      { id: 'q5e', ordem: 5, texto: 'De magoar os meus', arquetipo: 'leal', camada: 'funcao' },
      { id: 'q5f', ordem: 6, texto: 'De ocupar o meu lugar', arquetipo: 'indigno', camada: 'funcao' },
    ],
  },
  {
    id: 'q6',
    ronda: 2,
    tipo: 'somatica',
    ativo: true,
    ordem: 6,
    peso: 0,
    pesoCamada: 0,
    texto: 'Onde sentes isto no corpo?',
    nota: 'Se não souberes, também está bem — nem tudo se localiza à primeira.',
    opcoes: [
      { id: 'q6a', ordem: 1, texto: 'Peito apertado', arquetipo: null, camada: null },
      { id: 'q6b', ordem: 2, texto: 'Estômago', arquetipo: null, camada: null },
      { id: 'q6c', ordem: 3, texto: 'Garganta', arquetipo: null, camada: null },
      { id: 'q6d', ordem: 4, texto: 'Ombros/nuca', arquetipo: null, camada: null },
      { id: 'q6e', ordem: 5, texto: 'Não sei localizar', arquetipo: null, camada: null },
    ],
  },
  {
    id: 'q7',
    ronda: 2,
    tipo: 'arquetipo',
    ativo: true,
    ordem: 7,
    peso: 2,
    pesoCamada: 0,
    texto: 'Quando conquistas algo importante, a tua reação honesta é…',
    opcoes: [
      { id: 'q7a', ordem: 1, texto: 'Já penso no próximo risco a controlar', arquetipo: 'controlador', camada: 'funcao' },
      { id: 'q7b', ordem: 2, texto: 'Provar outra vez', arquetipo: 'provador', camada: 'funcao' },
      { id: 'q7c', ordem: 3, texto: 'Desconforto com elogios', arquetipo: 'invisivel', camada: 'funcao' },
      { id: 'q7d', ordem: 4, texto: 'Medo de manter o nível', arquetipo: 'guardiao', camada: 'funcao' },
      { id: 'q7e', ordem: 5, texto: 'Passo o mérito aos outros', arquetipo: 'leal', camada: 'funcao' },
      { id: 'q7f', ordem: 6, texto: 'Foi sorte, vão descobrir', arquetipo: 'indigno', camada: 'funcao' },
    ],
  },

  // ── RONDA 3 — TERRENO, COMANDO E VÉU (a raiz) ───────────────────────────
  {
    id: 'q8',
    ronda: 3,
    tipo: 'camada',
    ativo: true,
    ordem: 8,
    peso: 0,
    pesoCamada: 0,
    texto: 'Este padrão, na tua família, lembra-te de quem?',
    nota: 'Não é para culpar ninguém. É só para reconhecer o terreno onde isto cresceu.',
    opcoes: [
      // Quem reconhece a origem já vê o Terreno — não conta para o Véu (pesoCamada 0).
      { id: 'q8a', ordem: 1, texto: 'De mim só', arquetipo: null, camada: 'terreno', pesoCamada: 1 },
      { id: 'q8b', ordem: 2, texto: 'De um dos meus pais', arquetipo: null, camada: 'terreno', pesoCamada: 0 },
      { id: 'q8c', ordem: 3, texto: 'De alguém que "não podia brilhar"', arquetipo: null, camada: 'terreno', pesoCamada: 0 },
      { id: 'q8d', ordem: 4, texto: 'De uma regra silenciosa lá de casa', arquetipo: null, camada: 'terreno', pesoCamada: 0 },
      // "Não faço ideia" marca explicitamente o Véu na camada do Terreno.
      { id: 'q8e', ordem: 5, texto: 'Não faço ideia', arquetipo: null, camada: 'terreno', pesoCamada: 3 },
    ],
  },
  {
    id: 'q9',
    ronda: 3,
    tipo: 'camada',
    ativo: true,
    ordem: 9,
    peso: 0,
    pesoCamada: 2,
    texto: 'Qual destas perguntas é a MAIS DIFÍCIL de responder?',
    nota: 'A que custa mais é, quase sempre, a que está mais perto do Véu.',
    opcoes: [
      { id: 'q9a', ordem: 1, texto: 'De onde vem?', arquetipo: null, camada: 'terreno' },
      { id: 'q9b', ordem: 2, texto: 'O que o dispara?', arquetipo: null, camada: 'gatilho' },
      { id: 'q9c', ordem: 3, texto: 'Que história conto?', arquetipo: null, camada: 'historia' },
      { id: 'q9d', ordem: 4, texto: 'Do que me protege?', arquetipo: null, camada: 'funcao' },
      { id: 'q9e', ordem: 5, texto: 'Quem em mim manda?', arquetipo: null, camada: 'comando' },
    ],
  },
  {
    id: 'q10',
    ronda: 3,
    tipo: 'camada',
    ativo: true,
    ordem: 10,
    peso: 0,
    pesoCamada: 3,
    texto: 'Quando penso no meu maior bloqueio, o que MENOS consigo ver é…',
    opcoes: [
      { id: 'q10a', ordem: 1, texto: 'A raiz', arquetipo: null, camada: 'terreno' },
      { id: 'q10b', ordem: 2, texto: 'O momento em que dispara', arquetipo: null, camada: 'gatilho' },
      { id: 'q10c', ordem: 3, texto: 'O que penso', arquetipo: null, camada: 'historia' },
      { id: 'q10d', ordem: 4, texto: 'O medo escondido', arquetipo: null, camada: 'funcao' },
      { id: 'q10e', ordem: 5, texto: 'Quem decide em mim', arquetipo: null, camada: 'comando' },
    ],
  },
  {
    id: 'q11',
    ronda: 3,
    tipo: 'autodeclaracao',
    ativo: true,
    ordem: 11,
    peso: 0,
    pesoCamada: 0,
    texto: 'Sinceramente, quando algo corre mal, tu ASSUMES a responsabilidade?',
    opcoes: [
      { id: 'q11a', ordem: 1, texto: 'Sempre', arquetipo: null, camada: null },
      { id: 'q11b', ordem: 2, texto: 'Quase sempre', arquetipo: null, camada: null },
      { id: 'q11c', ordem: 3, texto: 'Às vezes', arquetipo: null, camada: null },
      { id: 'q11d', ordem: 4, texto: 'Raramente', arquetipo: null, camada: null },
    ],
  },
  {
    id: 'q12',
    ronda: 3,
    tipo: 'autodeclaracao',
    ativo: true,
    ordem: 12,
    peso: 0,
    pesoCamada: 0,
    texto: 'E quando tens a hipótese de crescer, tu AVANÇAS sem hesitar?',
    opcoes: [
      { id: 'q12a', ordem: 1, texto: 'Sempre', arquetipo: null, camada: null },
      { id: 'q12b', ordem: 2, texto: 'Quase sempre', arquetipo: null, camada: null },
      { id: 'q12c', ordem: 3, texto: 'Às vezes', arquetipo: null, camada: null },
      { id: 'q12d', ordem: 4, texto: 'Raramente', arquetipo: null, camada: null },
    ],
  },
];

/** Ids com significado especial para o motor (o Master pode reordenar o resto). */
export const IDS_ESPECIAIS = {
  somatica: 'q6',
  terrenoFamilia: 'q8',
  terrenoSemIdeia: 'q8e',
  camadaDificil: 'q9',
  camadaMenosVisivel: 'q10',
  autodeclaracaoResponsabilidade: 'q11',
  autodeclaracaoAvanco: 'q12',
} as const;

/** Respostas de auto-declaração que contam como afirmação forte. */
export const AFIRMACOES_FORTES = ['Sempre', 'Quase sempre'];

export const TITULOS_RONDA: Record<number, { titulo: string; subtitulo: string }> = {
  1: {
    titulo: 'Primeira ronda — a superfície',
    subtitulo: 'Começamos pelo que se vê: o que fazes quando aquilo aperta.',
  },
  2: {
    titulo: 'Segunda ronda — a função e o corpo',
    subtitulo: 'Agora um pouco mais fundo: para que serve isto, e onde é que mora.',
  },
  3: {
    titulo: 'Terceira ronda — a raiz',
    subtitulo: 'A última descida. Aqui, o que não sabes responder também é resposta.',
  },
};

export const NOMES_CAMADA: Record<string, string> = {
  comportamento: 'o Comportamento',
  historia: 'a História',
  funcao: 'a Função',
  terreno: 'o Terreno',
  comando: 'o Comando',
  gatilho: 'o Gatilho',
};

export const DESCRICOES_CAMADA: Record<string, string> = {
  comportamento:
    'o que fazes é a parte mais visível de todas — e mesmo assim é aí que a tua atenção ainda não pousou',
  historia:
    'a frase que dizes a ti própria quando aquilo dispara passa tão depressa que ainda não a leste devagar',
  funcao:
    'descreves o padrão com clareza, mas aquilo de que ele te protege ainda não tinha nome — era a peça que faltava',
  terreno:
    'este padrão não começou em ti — e a casa onde ele aprendeu a existir ainda está por olhar',
  comando:
    'sabes o que fazes e porquê, mas ainda não olhaste para quem, dentro de ti, é que dá a ordem',
  gatilho:
    'sabes que acontece, mas o instante exato em que aquilo vira ainda te escapa',
};
