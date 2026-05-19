export type Chakra = {
  id: string;
  nome: string;
  cor: string;
  hzMin: number;
  hzMax: number;
  emoji: string;
  funcao: string;
  bloqueio: string;
  pratica: string;
  respiracao: string;
};

export const CHAKRAS: Chakra[] = [
  {
    id: 'raiz',
    nome: 'Raiz',
    cor: '#C2410C',
    hzMin: 0,
    hzMax: 75,
    emoji: '🔴',
    funcao: 'Segurança, pertença, sobrevivência.',
    bloqueio: 'Medo, instabilidade, desconfiança da vida.',
    pratica: 'Caminha 15 min descalço em contacto com terra ou madeira. Sente o peso a descer.',
    respiracao: '4 segundos a inspirar pela narina, 6 a expirar pela boca. Visualiza raízes a descer.',
  },
  {
    id: 'sacro',
    nome: 'Sacro',
    cor: '#EA580C',
    hzMin: 75,
    hzMax: 150,
    emoji: '🟠',
    funcao: 'Prazer, criatividade, fluidez emocional.',
    bloqueio: 'Culpa em relação ao corpo, repressão criativa.',
    pratica: 'Movimentação livre 10 min — quadris, pélvis, sem coreografia. Música que te toca.',
    respiracao: 'Respiração ondulatória — inspira a expandir o abdómen, expira sem forçar.',
  },
  {
    id: 'plexo',
    nome: 'Plexo Solar',
    cor: '#EAB308',
    hzMin: 150,
    hzMax: 200,
    emoji: '🟡',
    funcao: 'Poder pessoal, vontade, identidade.',
    bloqueio: 'Indecisão, baixa autoestima, raiva mal canalizada.',
    pratica: 'Identifica 1 acto de afirmação pessoal e fá-lo hoje. Sem pedir permissão.',
    respiracao: 'Respiração de fogo — 30 expirações curtas pelo nariz, abdómen activo.',
  },
  {
    id: 'cardiaco',
    nome: 'Cardíaco',
    cor: '#16A34A',
    hzMin: 200,
    hzMax: 350,
    emoji: '💚',
    funcao: 'Amor, compaixão, ligação.',
    bloqueio: 'Rancor, fechamento, medo de receber.',
    pratica: 'Mão no peito, 5 min. Repete: "Estou seguro a sentir." Permite o que vier.',
    respiracao: '5 segundos a inspirar, 5 a expirar, foco no peito.',
  },
  {
    id: 'laringeo',
    nome: 'Laríngeo',
    cor: '#0EA5E9',
    hzMin: 350,
    hzMax: 450,
    emoji: '🔵',
    funcao: 'Expressão, verdade, comunicação clara.',
    bloqueio: 'Silenciamento, mentira, voz pequena.',
    pratica: 'Diz hoje em voz alta uma verdade que adiavas. Mesmo que para ti, ao espelho.',
    respiracao: 'Inspira, e ao expirar emite um "ahhh" longo. Repete 7 vezes.',
  },
  {
    id: 'frontal',
    nome: 'Frontal',
    cor: '#6366F1',
    hzMin: 450,
    hzMax: 560,
    emoji: '🟣',
    funcao: 'Intuição, visão, discernimento.',
    bloqueio: 'Confusão, mente saturada, descrença na intuição.',
    pratica: 'Pergunta-te uma decisão pendente e escreve a 1ª resposta que surgir. Não edites.',
    respiracao: 'Inspira pela narina esquerda, expira pela direita. 10 ciclos.',
  },
  {
    id: 'coroa',
    nome: 'Coroa',
    cor: '#A78BFA',
    hzMin: 560,
    hzMax: 1000,
    emoji: '⚪',
    funcao: 'União com o todo, propósito transcendente.',
    bloqueio: 'Ceticismo radical, isolamento espiritual.',
    pratica: 'Senta-te 15 min sem fazer nada. Sem método. Apenas estar.',
    respiracao: 'Respiração natural, atenção ao topo da cabeça. Sente a abertura.',
  },
];

export const getChakraPorHz = (hz: number): Chakra =>
  CHAKRAS.find((c) => hz >= c.hzMin && hz < c.hzMax) ?? CHAKRAS[CHAKRAS.length - 1];

export const getEstadoChakras = (hz: number) =>
  CHAKRAS.map((c) => ({
    chakra: c,
    aberto: hz >= c.hzMin,
    activo: hz >= c.hzMin && hz < c.hzMax,
  }));
