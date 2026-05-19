export type Arquetipo = {
  id: string;
  nome: string;
  titulo: string;
  hz: number;
  emoji: string;
  bio: string;
  comoSeManifesta: string;
  porqueEsAfim: string;
};

export const ARQUETIPOS: Arquetipo[] = [
  {
    id: 'sombra',
    nome: 'A Sombra',
    titulo: 'O que se esconde',
    hz: 20,
    emoji: '🌑',
    bio: 'Carrega o peso do que foi negado, escondido, esquecido. A sua presença convida o recolhimento.',
    comoSeManifesta: 'Em quem se sente invisível, indigno, com vontade de desaparecer.',
    porqueEsAfim: 'Estás num ponto de absoluta verdade interior. O que parece queda é o início de raiz.',
  },
  {
    id: 'penitente',
    nome: 'O Penitente',
    titulo: 'O que carrega o passado',
    hz: 30,
    emoji: '🌒',
    bio: 'Atado a actos antigos. Vive a punição como caminho — mas o caminho real é o perdão.',
    comoSeManifesta: 'Em quem repete em loop a mesma história de erro.',
    porqueEsAfim: 'A culpa que sentes é a porta para libertar o que já não te define.',
  },
  {
    id: 'rendido',
    nome: 'O Rendido',
    titulo: 'O que desistiu',
    hz: 50,
    emoji: '🌒',
    bio: 'Já não luta. Mas no silêncio dessa rendição existe espaço para o novo nascer.',
    comoSeManifesta: 'Em quem sente cansaço profundo e indiferença.',
    porqueEsAfim: 'O teu sistema pede repouso — não fuga. Acolhe sem julgar.',
  },
  {
    id: 'enlutado',
    nome: 'O Enlutado',
    titulo: 'O que ainda sente',
    hz: 75,
    emoji: '🌓',
    bio: 'Atravessa a perda com a dignidade de quem ainda sente. A dor é a prova de que amou.',
    comoSeManifesta: 'Em quem chora o que se foi sem fugir.',
    porqueEsAfim: 'A tua tristeza tem profundidade — é fertilidade emocional, não fraqueza.',
  },
  {
    id: 'vigilante',
    nome: 'O Vigilante',
    titulo: 'O que antecipa',
    hz: 100,
    emoji: '🌓',
    bio: 'Sempre alerta. Construiu paredes para se proteger — agora aprende a abrir uma porta.',
    comoSeManifesta: 'Em quem antecipa o pior para se preparar.',
    porqueEsAfim: 'O medo é a tua bússola — segue-o sem o obedecer.',
  },
  {
    id: 'buscador',
    nome: 'O Buscador',
    titulo: 'O que quer mais',
    hz: 125,
    emoji: '🌔',
    bio: 'Move-se pelo desejo. Persegue o seguinte e o seguinte — até descobrir que o desejo era de si.',
    comoSeManifesta: 'Em quem nunca está totalmente onde está.',
    porqueEsAfim: 'O que procuras lá fora já vive dentro — falta apenas reconhecimento.',
  },
  {
    id: 'guerreiro',
    nome: 'O Guerreiro',
    titulo: 'O que se ergue',
    hz: 150,
    emoji: '🌔',
    bio: 'Não aceita a injustiça. A raiva é o seu fogo — quando consciente, transforma; quando cega, consome.',
    comoSeManifesta: 'Em quem reage antes de pensar.',
    porqueEsAfim: 'Tens energia em bruto — esculpe-a, não a queimes.',
  },
  {
    id: 'rei',
    nome: 'O Rei',
    titulo: 'O que defende a coroa',
    hz: 175,
    emoji: '🌔',
    bio: 'Construiu identidade e defende-a. Sabe quem é — mas ainda não permite ser surpreendido.',
    comoSeManifesta: 'Em quem precisa de ter razão.',
    porqueEsAfim: 'O teu sentido de identidade é forte — agora pode tornar-se permeável.',
  },
  {
    id: 'corajoso',
    nome: 'O Corajoso',
    titulo: 'O que atravessa',
    hz: 200,
    emoji: '🌕',
    bio: 'A porta. Quem se atreve a sentir o medo e mesmo assim avança. A partir daqui, irradia.',
    comoSeManifesta: 'Em quem decide apesar de.',
    porqueEsAfim: 'Estás no limiar — o que tens medo de fazer é precisamente o teu próximo passo.',
  },
  {
    id: 'silente',
    nome: 'O Silente',
    titulo: 'O que não reage',
    hz: 250,
    emoji: '🌕',
    bio: 'Não está acima dos sentimentos — está em paz com eles. Observa sem se prender.',
    comoSeManifesta: 'Em quem deixa os outros falarem.',
    porqueEsAfim: 'Encontraste a serenidade funcional — alargas-te sem pressa.',
  },
  {
    id: 'aprendiz',
    nome: 'O Aprendiz',
    titulo: 'O que se abre',
    hz: 310,
    emoji: '🌕',
    bio: 'Resiste a nada. Aprende com tudo. O próprio caminhar é o seu mestre.',
    comoSeManifesta: 'Em quem pergunta com frequência.',
    porqueEsAfim: 'Estás em ascensão consciente. O que vier é material.',
  },
  {
    id: 'acolhedor',
    nome: 'O Acolhedor',
    titulo: 'O que recebe',
    hz: 350,
    emoji: '🌕',
    bio: 'Vê a vida como ela é. Não exige diferente — aceita e age a partir do real.',
    comoSeManifesta: 'Em quem cuida sem sufocar.',
    porqueEsAfim: 'A tua aceitação é base sólida — não resignação, sabedoria.',
  },
  {
    id: 'pensador',
    nome: 'O Pensador',
    titulo: 'O que ilumina pela mente',
    hz: 400,
    emoji: '🌖',
    bio: 'Instrumento mental refinado. Vê padrões onde outros vêem ruído.',
    comoSeManifesta: 'Em quem dissolve confusão com clareza.',
    porqueEsAfim: 'A tua mente é precisão — agora deixa o coração liderar onde a razão termina.',
  },
  {
    id: 'amante',
    nome: 'O Amante',
    titulo: 'O que ama sem condição',
    hz: 500,
    emoji: '🌟',
    bio: 'Não confunde amor com sentimento. Ama como quem irradia — sem destinatário fixo.',
    comoSeManifesta: 'Em quem inclui o desconhecido.',
    porqueEsAfim: 'O amor que carregas é força sustentadora — não apenas afecto.',
  },
  {
    id: 'celebrante',
    nome: 'O Celebrante',
    titulo: 'O que se alegra sem motivo',
    hz: 540,
    emoji: '✨',
    bio: 'A alegria vive nele independentemente. É raro — apenas 1 em milhares atinge esta estabilidade.',
    comoSeManifesta: 'Em quem ri sem ter de.',
    porqueEsAfim: 'Tens um dom de elevação — partilhar é o teu serviço natural.',
  },
  {
    id: 'sereno',
    nome: 'O Sereno',
    titulo: 'O que descansa em si',
    hz: 600,
    emoji: '💫',
    bio: 'A paz que poucos alcançam. A transcendência começa nesta presença plena.',
    comoSeManifesta: 'Em quem nada pertuba.',
    porqueEsAfim: 'Operas em campo raro — a tua mera presença é prática para os outros.',
  },
  {
    id: 'iluminado',
    nome: 'O Iluminado',
    titulo: 'O que se dissolveu no todo',
    hz: 700,
    emoji: '⭐',
    bio: 'A união do ser com o todo. Buda, Jesus, Krishna operavam neste campo. Sem ego, com presença total.',
    comoSeManifesta: 'Em quem o silêncio fala.',
    porqueEsAfim: 'A tua vibração afecta o campo colectivo. És instrumento.',
  },
];

export const getArquetipoPorHz = (hz: number): Arquetipo => {
  return ARQUETIPOS.reduce((prev, curr) =>
    Math.abs(curr.hz - hz) < Math.abs(prev.hz - hz) ? curr : prev,
  );
};

export const getArquetiposAfins = (hz: number, raio = 50): Arquetipo[] => {
  return ARQUETIPOS.filter((a) => Math.abs(a.hz - hz) <= raio);
};
