/**
 * Âncoras VION — as 7 ideias-base de cada um dos 17 níveis.
 *
 * A Michelle define aqui ~3 linhas por pilar, em linguagem própria.
 * A IA (Claude) recebe estas âncoras + as respostas do utilizador e
 * expande cada pilar para 4-7 páginas, mantendo a tua voz.
 *
 * Estrutura dos 7 pilares (igual para todos os níveis):
 *   I    — Ferida central
 *   II   — Dom escondido
 *   III  — Prática do corpo (respiração, postura, movimento)
 *   IV   — Prática da mente (meditação, contemplação)
 *   V    — Prática nas relações
 *   VI   — Encontro com o Todo
 *   VII  — Travessia para o próximo nível
 *
 * COMO PREENCHER:
 *   Para cada um dos 17 níveis Hawkins, copia o bloco "Coragem 200"
 *   abaixo, troca o `hz`, e escreve 1-3 frases por pilar a partir
 *   da tua leitura própria.
 */

export type AncorasNivel = {
  hz: number;
  feridaCentral: string;
  domEscondido: string;
  corpo: string;
  mente: string;
  relacoes: string;
  todo: string;
  travessia: string;
};

export const ANCORAS: Record<number, AncorasNivel> = {
  // ─────────────────────────────────────────────────────────────────
  // 200 · Coragem — EXEMPLO PREENCHIDO (Michelle: ajusta a tua voz)
  // ─────────────────────────────────────────────────────────────────
  200: {
    hz: 200,
    feridaCentral:
      'A vida exigiu o salto antes do ser estar pronto. Aprendeu cedo que pedir ajuda era fraqueza e que parar era falhar. Em algum momento, alguém de quem precisava não esteve.',
    domEscondido:
      'A capacidade de fazer apesar de. A coragem é a única ponte real entre quem somos e quem podemos ser — e este nível conhece-a por experiência. Quem está aqui pode emprestar coragem a quem ainda não a tem.',
    corpo:
      'Respiração 4-6 (4 segundos a entrar coragem, 6 segundos a sair entrega). Pés sempre conscientes do chão antes de qualquer ato difícil. Postura: peito aberto, queixo paralelo ao solo.',
    mente:
      'Meditação do "atravesso": ensaiar em câmara lenta o ato que se tem medo de fazer, sem fugir do medo. Pergunta a habitar: "O que faria hoje se a coragem já estivesse adquirida?"',
    relacoes:
      'Dizer "não sei" sem culpa. Pedir ajuda como prática semanal. Reconhecer publicamente um erro pequeno por semana. A vulnerabilidade é, neste nível, a próxima forma de coragem.',
    todo:
      'O Todo confia em ti — por isso te pede que faças. Cada ato corajoso é uma confirmação dessa confiança e uma resposta a ela. Atravessar é, neste nível, a forma da oração.',
    travessia:
      'Quando deixares de precisar de provar a coragem, abres-te à Neutralidade. Primeiro passo: 1 dia inteiro sem provar nada a ninguém — observa quem és quando não estás a demonstrar.',
  },

  // TODO Michelle: preencher os restantes 16 níveis seguindo a mesma estrutura.
  // 20 Vergonha, 30 Culpa, 50 Apatia, 75 Luto, 100 Medo, 125 Desejo,
  // 150 Raiva, 175 Orgulho, 250 Neutralidade, 310 Boa Vontade,
  // 350 Aceitação, 400 Razão, 500 Amor, 540 Alegria, 600 Paz, 700 Iluminação.
};

/** Devolve âncoras do nível ou undefined se ainda não foram escritas. */
export function getAncoras(hz: number): AncorasNivel | undefined {
  return ANCORAS[hz];
}

/** Lista dos níveis já cobertos (para mostrar progresso à Michelle). */
export function niveisComAncoras(): number[] {
  return Object.keys(ANCORAS).map((k) => parseInt(k, 10));
}
