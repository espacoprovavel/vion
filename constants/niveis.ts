export type Nivel = {
  hz: number;
  nome: string;
  en: string;
  emoji: string;
  cor: string;
  desc: string;
  insight: (nome: string) => string;
};

export const NIVEIS: Nivel[] = [
  {
    hz: 20,
    nome: 'Vergonha',
    en: 'Shame',
    emoji: '🌑',
    cor: '#4a0000',
    desc: 'O nível mais denso da experiência humana. A vergonha aprisiona a identidade e distorce a visão de si mesmo.',
    insight: (nome) =>
      `${nome}, estás num ponto de renovação profunda. O facto de estares aqui já é movimento.`,
  },
  {
    hz: 30,
    nome: 'Culpa',
    en: 'Guilt',
    emoji: '🌒',
    cor: '#5a1000',
    desc: 'A culpa mantém o ser preso ao passado, impedindo o movimento natural da vida.',
    insight: (nome) =>
      `${nome}, o passado não te define. Reconhecer é o primeiro passo para libertar.`,
  },
  {
    hz: 50,
    nome: 'Apatia',
    en: 'Apathy',
    emoji: '🌒',
    cor: '#1a1a3a',
    desc: 'O estado de desistência. A energia está tão baixa que o futuro parece impossível.',
    insight: (nome) =>
      `${nome}, mesmo a apatia é um sinal — o teu sistema está a pedir repouso e renovação.`,
  },
  {
    hz: 75,
    nome: 'Luto',
    en: 'Grief',
    emoji: '🌓',
    cor: '#1a2a4a',
    desc: 'A dor da perda. Ainda há sentimento — e sentimento é o início do movimento.',
    insight: (nome) =>
      `${nome}, a dor que sentes é prova de que ainda te importas. Isso é força.`,
  },
  {
    hz: 100,
    nome: 'Medo',
    en: 'Fear',
    emoji: '🌓',
    cor: '#004a3a',
    desc: 'O medo contrai. Mas o medo também é energia — pode mover-te se o atravessares.',
    insight: (nome) =>
      `${nome}, o medo é honesto. Reconhecê-lo já é um acto de coragem.`,
  },
  {
    hz: 125,
    nome: 'Desejo',
    en: 'Desire',
    emoji: '🌔',
    cor: '#3a3a00',
    desc: 'O desejo é combustível. Pode elevar ou aprisionar — depende de onde aponta.',
    insight: (nome) =>
      `${nome}, os teus desejos são informação valiosa sobre quem és e o que valorizas.`,
  },
  {
    hz: 150,
    nome: 'Raiva',
    en: 'Anger',
    emoji: '🌔',
    cor: '#5a2000',
    desc: 'A raiva queima o que estava estagnado. É superior à apatia — indica que ainda te importas.',
    insight: (nome) =>
      `${nome}, há fogo em ti. A raiva pode destruir ou transformar. Escolhe conscientemente.`,
  },
  {
    hz: 175,
    nome: 'Orgulho',
    en: 'Pride',
    emoji: '🌔',
    cor: '#4a3800',
    desc: 'O orgulho defende o ego. É mais alto que a raiva, mas ainda fecha o ser ao crescimento.',
    insight: (nome) =>
      `${nome}, o teu sentido de identidade é forte. O próximo passo é deixar entrar o novo.`,
  },
  {
    hz: 200,
    nome: 'Coragem',
    en: 'Courage',
    emoji: '🌕',
    cor: '#005a20',
    desc: 'O limiar crítico. Acima de 200, o ser começa a irradiar. Abaixo, consome. A coragem é a porta.',
    insight: (nome) =>
      `${nome}, estás no limiar da expansão. A coragem que mostras já eleva quem te rodeia.`,
  },
  {
    hz: 250,
    nome: 'Neutralidade',
    en: 'Neutrality',
    emoji: '🌕',
    cor: '#005a4a',
    desc: 'A paz sem esforço. Não és afectado pelos resultados. É o início da verdadeira liberdade.',
    insight: (nome) =>
      `${nome}, encontraste a neutralidade — um estado de paz funcional que poucos atingem.`,
  },
  {
    hz: 310,
    nome: 'Boa Vontade',
    en: 'Willingness',
    emoji: '🌕',
    cor: '#006a5a',
    desc: 'A abertura genuína para crescer. O ser que está aqui aprende com tudo e resiste a nada.',
    insight: (nome) =>
      `${nome}, a tua abertura para crescer é o teu maior recurso. Estás em movimento ascendente.`,
  },
  {
    hz: 350,
    nome: 'Aceitação',
    en: 'Acceptance',
    emoji: '🌕',
    cor: '#007a6a',
    desc: 'A vida como ela é — não como desejas que fosse. Aqui nasce a força real.',
    insight: (nome) =>
      `${nome}, aceitares a realidade como ela é não é resignação — é sabedoria.`,
  },
  {
    hz: 400,
    nome: 'Razão',
    en: 'Reason',
    emoji: '🌖',
    cor: '#0060a0',
    desc: 'O nível da ciência e da medicina. A mente funciona com clareza e sem distorção emocional.',
    insight: (nome) =>
      `${nome}, a tua mente é um instrumento refinado. O desafio é deixar o coração liderar.`,
  },
  {
    hz: 500,
    nome: 'Amor',
    en: 'Love',
    emoji: '🌟',
    cor: '#00a0c0',
    desc: 'Não o amor romântico — o amor incondicional. Apenas 1 em 250 pessoas atinge este nível.',
    insight: (nome) =>
      `${nome}, o amor que emanas não é sentimental — é uma força que eleva quem está próximo.`,
  },
  {
    hz: 540,
    nome: 'Alegria',
    en: 'Joy',
    emoji: '✨',
    cor: '#00c080',
    desc: 'A alegria inabalável. Não depende de circunstâncias externas. É um estado de ser, não de ter.',
    insight: (nome) =>
      `${nome}, a alegria que carregas é um dom raro. Partilhá-la é o teu maior serviço.`,
  },
  {
    hz: 600,
    nome: 'Paz',
    en: 'Peace',
    emoji: '💫',
    cor: '#00e0a0',
    desc: 'Apenas 1 em 10 milhões atinge a paz plena. A transcendência começa aqui.',
    insight: (nome) =>
      `${nome}, operas num campo de consciência extraordinariamente raro.`,
  },
  {
    hz: 700,
    nome: 'Iluminação',
    en: 'Enlightenment',
    emoji: '⭐',
    cor: '#a0ffc0',
    desc: 'A união do ser com o todo. O fim do ego. Buda, Jesus, Krishna operavam neste campo.',
    insight: (nome) =>
      `${nome}, a paz que carregas irradia para todos ao teu redor sem esforço.`,
  },
];

export const NIVEIS_HZ = NIVEIS.map((n) => n.hz);

export const getNivelMaisProximo = (hz: number): Nivel => {
  const hzMaisProximo = NIVEIS_HZ.reduce((prev, curr) =>
    Math.abs(curr - hz) < Math.abs(prev - hz) ? curr : prev,
  );
  return NIVEIS.find((n) => n.hz === hzMaisProximo)!;
};

export const getNivelAcima = (hz: number): Nivel | null => {
  const acima = NIVEIS.filter((n) => n.hz > hz);
  return acima.length > 0 ? acima[0] : null;
};

export const getIndiceNivel = (hz: number): number =>
  NIVEIS.findIndex((n) => n.hz === hz);
