export type Dia = {
  dia: number;
  tema: string;
  intencao: string;
  pratica: string;
  pergunta: string;
};

export const PROTOCOLO_21: Dia[] = [
  { dia: 1, tema: 'Reconhecer', intencao: 'Vejo o que está sem mudar nada.', pratica: '10 min de respiração consciente ao acordar. Apenas observar.', pergunta: 'O que está realmente presente em mim hoje?' },
  { dia: 2, tema: 'Nomear', intencao: 'Dou nome ao que sinto.', pratica: 'Escreve 5 emoções específicas que atravessaram o dia.', pergunta: 'Onde no corpo cada uma se manifestou?' },
  { dia: 3, tema: 'Apego', intencao: 'Identifico do que dependo emocionalmente.', pratica: 'Lista 3 pessoas/situações cuja perda te assustaria. Não julgues.', pergunta: 'O que essas ligações me dão que ainda não me dou?' },
  { dia: 4, tema: 'Soltar uma camada', intencao: 'Liberto sem combater.', pratica: 'Faz a técnica de libertação no flow Libertação para 1 apego identificado.', pergunta: 'O que mudou na sensação no peito?' },
  { dia: 5, tema: 'Corpo', intencao: 'Volto ao corpo como casa.', pratica: '20 min de movimento livre. Sem música ou com música que te toca.', pergunta: 'Onde habito demais? Onde habito de menos?' },
  { dia: 6, tema: 'Limite', intencao: 'Digo não onde sempre disse sim.', pratica: 'Identifica 1 sim automático. Diz não desta vez.', pergunta: 'O que ganho ao recusar?' },
  { dia: 7, tema: 'Pausa', intencao: 'Honro o que se moveu.', pratica: 'Dia de silêncio relativo. Menos ecrãs, mais natureza.', pergunta: 'O que tem estado a tentar falar comigo?' },

  { dia: 8, tema: 'Sombra', intencao: 'Olho para a parte de mim que rejeito.', pratica: 'Faz o exercício de sombra do teu arquétipo.', pergunta: 'O que é insuportável em mim — e porquê?' },
  { dia: 9, tema: 'Crença', intencao: 'Desmonto 1 crença limitante.', pratica: 'Identifica a crença central do teu Guia. Pergunta: "Tenho certeza absoluta que é verdade?"', pergunta: 'Quem seria sem essa crença?' },
  { dia: 10, tema: 'Energia', intencao: 'Trabalho 1 chakra.', pratica: 'Faz a prática do chakra activo do teu nível.', pergunta: 'Onde o fluxo se renovou hoje?' },
  { dia: 11, tema: 'Perdão', intencao: 'Perdoo onde estive amarrado.', pratica: 'Escreve uma carta a alguém (não envies). Agradece, perdoa, liberta.', pergunta: 'O que estava a manter o nó?' },
  { dia: 12, tema: 'Receber', intencao: 'Treino receber sem retribuir.', pratica: 'Aceita 1 oferta hoje (elogio, ajuda, presença) com um simples "obrigado".', pergunta: 'O que dói em receber?' },
  { dia: 13, tema: 'Verdade', intencao: 'Falo o que evitei.', pratica: 'Diz a 1 pessoa algo verdadeiro que evitavas. Com cuidado, sem ataque.', pergunta: 'O que se libertou no peito?' },
  { dia: 14, tema: 'Marco', intencao: 'Reconheço o caminho feito.', pratica: 'Refaz o teste em /teste. Compara.', pergunta: 'O que se moveu em 14 dias?' },

  { dia: 15, tema: 'Propósito', intencao: 'Sinto onde sou chamado.', pratica: 'Escreve 1 frase: "A minha vida quer servir _____."', pergunta: 'O que continua a chamar mesmo quando tento ignorar?' },
  { dia: 16, tema: 'Acção', intencao: 'Dou 1 passo concreto.', pratica: 'Em 25 min, faz a primeira coisa concreta para essa direcção.', pergunta: 'O que doeu agir?' },
  { dia: 17, tema: 'Permanência', intencao: 'Volto à prática que escolhi.', pratica: 'Repete a prática diária que mais te tocou.', pergunta: 'Onde estou a querer novidade em vez de profundidade?' },
  { dia: 18, tema: 'Amor sem dependência', intencao: 'Amo sem precisar.', pratica: 'Pensa em alguém que amas. Solta a expectativa por 1 minuto.', pergunta: 'O amor sobrevive quando solto?' },
  { dia: 19, tema: 'Alegria gratuita', intencao: 'Sorrio sem motivo.', pratica: '15 min a fazer algo só porque sim. Sem produtividade, sem propósito.', pergunta: 'O que descobri sobre o prazer?' },
  { dia: 20, tema: 'Silêncio', intencao: 'Habito o silêncio.', pratica: '30 min de silêncio total. Sem livro, sem música.', pergunta: 'O que apareceu quando parei de procurar?' },
  { dia: 21, tema: 'Integrar', intencao: 'Faço meu o que foi vivido.', pratica: 'Escreve uma carta a ti próprio do dia 1. O que dirias agora?', pergunta: 'Em que sou outro? Em que sou mais eu?' },
];

export const getProgressoDia = (inicio: string | null): number | null => {
  if (!inicio) return null;
  const dias = Math.floor((Date.now() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(21, Math.max(1, dias + 1));
};
