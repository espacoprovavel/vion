// Tipos do domínio do Mergulho Âmago.
// Vocabulário: sem termos clínicos, sem "ponto cego" — usamos "o Véu".

export type CodigoArquetipo =
  | 'controlador'
  | 'provador'
  | 'invisivel'
  | 'guardiao'
  | 'leal'
  | 'indigno';

/** As 5 camadas do Mergulho, mais o gatilho (momento em que o padrão dispara). */
export type Camada =
  | 'comportamento'
  | 'historia'
  | 'funcao'
  | 'terreno'
  | 'comando'
  | 'gatilho';

export type TipoPergunta = 'arquetipo' | 'camada' | 'somatica' | 'autodeclaracao';

export type Ronda = 1 | 2 | 3;

export type PortaDeEntrada = 'duvida' | 'curiosidade' | 'dificuldade';

export interface OpcaoResposta {
  id: string;
  texto: string;
  /** Sinal de arquétipo que esta resposta aciona (peso definido na pergunta). */
  arquetipo: CodigoArquetipo | null;
  /** Sinal de camada que esta resposta aciona. */
  camada: Camada | null;
  /**
   * Peso com que esta resposta contribui para a camada do Véu.
   * Se omitido, usa-se o `pesoCamada` da pergunta. 0 = a camada é só metadados
   * (serve o painel Master) e não conta para o Véu.
   */
  pesoCamada?: number;
  ordem: number;
}

export interface Pergunta {
  id: string;
  texto: string;
  ronda: Ronda;
  tipo: TipoPergunta;
  ativo: boolean;
  ordem: number;
  /** Peso do sinal de arquétipo desta pergunta na pontuação. */
  peso: number;
  /** Peso, por omissão, com que as respostas desta pergunta contam para o Véu. */
  pesoCamada: number;
  /** Nota curta e permissiva mostrada por baixo da pergunta. */
  nota?: string;
  opcoes: OpcaoResposta[];
}

export interface Arquetipo {
  codigo: CodigoArquetipo;
  nomeSombra: string;
  nomeIntegrado: string;
  medo: string;
  caminho: string;
  /** Texto do Toque em 3 tempos: reconhecer, agradecer, libertar. */
  textoToque: { reconhece: string; agradece: string; liberta: string };
  descricao: string;
  /** Proposta com condição — nunca uma ordem. */
  proximoPasso: string;
}

/** Respostas recolhidas: id da pergunta -> id da opção. */
export type MapaRespostas = Record<string, string>;

export interface EntradaMergulho {
  porta: PortaDeEntrada;
  /** Texto livre opcional que a pessoa escreve à entrada. */
  descricao?: string;
}

export interface Fosso {
  detetado: boolean;
  /** O que a pessoa afirma sobre si. */
  oQueDizes: string;
  /** O que o padrão das respostas mostra. */
  oQueMostras: string;
  camadaApontada: Camada | null;
}

export interface Leitura {
  arquetipoSombra: Arquetipo;
  arquetipoIntegrado: string;
  /** Pontuação por arquétipo, para transparência e para o painel Master. */
  pontuacoes: Record<CodigoArquetipo, number>;
  camadaVeu: Camada;
  pontuacoesCamada: Record<Camada, number>;
  fosso: Fosso;
  somatica: string | null;
  porta: PortaDeEntrada;
  proximoPasso: string;
  lentesUsadas: string;
  /** Blocos de texto já compostos no tom do Toque. */
  texto: {
    abertura: string;
    reconhece: string;
    agradece: string;
    veu: string;
    fosso: string | null;
    ponte: string;
    liberta: string;
  };
}
