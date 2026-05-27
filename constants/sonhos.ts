/**
 * Motor de análise de sonhos VION — versão base (offline, sem custo).
 *
 * Deteta símbolos no relato através de palavras-chave e devolve uma
 * leitura simbólica de inspiração junguiana. NÃO é diagnóstico nem
 * substitui acompanhamento profissional — a interface deixa isto claro.
 *
 * Preparado para, no futuro, ser substituído/complementado por uma
 * análise de IA real (ver analisarSonho — basta trocar a implementação).
 */
export type SimboloOnirico = {
  id: string;
  nome: string;
  palavras: string[];
  significado: string;
  pergunta: string;
};

export const SIMBOLOS: SimboloOnirico[] = [
  {
    id: 'agua',
    nome: 'Água',
    palavras: ['água', 'agua', 'mar', 'oceano', 'rio', 'lago', 'chuva', 'onda', 'inundação', 'inundacao', 'maré', 'mare'],
    significado:
      'A água representa o inconsciente e o mundo emocional. Águas calmas falam de paz interior; agitadas ou turvas, de emoções por processar. Mergulhar é descer ao que sentes sob a superfície.',
    pergunta: 'Que emoção tenho deixado por sentir ultimamente?',
  },
  {
    id: 'queda',
    nome: 'Queda',
    palavras: ['cair', 'caindo', 'queda', 'caí', 'cai', 'despenhar', 'precipício', 'precipicio', 'abismo'],
    significado:
      'Cair costuma refletir uma sensação de perda de controlo ou de apoio na vida desperta — medo de falhar ou de soltar algo a que te agarras.',
    pergunta: 'Onde sinto que estou a perder o chão?',
  },
  {
    id: 'voar',
    nome: 'Voar',
    palavras: ['voar', 'voando', 'voei', 'levitar', 'flutuar', 'asas'],
    significado:
      'Voar fala de libertação, desejo de transcender limites ou de ganhar perspetiva. Pode ser sinal de expansão — ou de vontade de fugir do que pesa em terra.',
    pergunta: 'De que me quero elevar ou libertar?',
  },
  {
    id: 'perseguicao',
    nome: 'Perseguição',
    palavras: ['perseguição', 'perseguicao', 'fugir', 'fugindo', 'a correr', 'correndo', 'escapar', 'perseguido', 'perseguia'],
    significado:
      'Ser perseguido representa, muitas vezes, algo que evitas encarar — uma emoção, uma verdade ou uma parte de ti (a Sombra) que pede para ser reconhecida.',
    pergunta: 'O que ando a evitar e que continua a vir atrás de mim?',
  },
  {
    id: 'morte',
    nome: 'Morte',
    palavras: ['morte', 'morrer', 'morri', 'morto', 'morta', 'funeral', 'enterro', 'cemitério', 'cemiterio'],
    significado:
      'A morte em sonho raramente é literal. Simboliza o fim de um ciclo e o início de outro — uma transformação, o deixar morrer uma versão antiga de ti.',
    pergunta: 'Que fase da minha vida está a chegar ao fim?',
  },
  {
    id: 'dentes',
    nome: 'Dentes a cair',
    palavras: ['dente', 'dentes', 'dentadura'],
    significado:
      'Dentes a cair ligam-se a ansiedade, medo de perda (de poder, imagem ou segurança) ou a uma fase de mudança em que te sentes vulnerável.',
    pergunta: 'Onde me sinto frágil ou com medo de perder algo?',
  },
  {
    id: 'casa',
    nome: 'Casa',
    palavras: ['casa', 'lar', 'quarto', 'sala', 'porta', 'divisão', 'divisao', 'corredor', 'sótão', 'sotao', 'cave', 'porão', 'porao'],
    significado:
      'A casa é a imagem do próprio ser. Cada divisão é uma parte de ti: o sótão, a mente e o passado; a cave, o inconsciente; divisões novas, potencial por descobrir.',
    pergunta: 'Que parte de mim ainda não explorei?',
  },
  {
    id: 'crianca',
    nome: 'Criança',
    palavras: ['criança', 'crianca', 'bebé', 'bebe', 'menino', 'menina', 'filho pequeno'],
    significado:
      'A criança representa a tua criança interior, a inocência, ou algo novo a nascer em ti. Cuidar dela é cuidar de uma parte vulnerável e criativa de quem és.',
    pergunta: 'De que parte minha mais jovem preciso de cuidar agora?',
  },
  {
    id: 'sombra-fig',
    nome: 'Figura ameaçadora',
    palavras: ['monstro', 'sombra', 'vulto', 'demónio', 'demonio', 'figura escura', 'intruso', 'desconhecido'],
    significado:
      'Figuras escuras ou ameaçadoras costumam personificar a Sombra — aquilo que rejeitaste em ti. Em vez de fugir, pergunta o que ela quer mostrar-te.',
    pergunta: 'Que traço meu costumo recusar ver?',
  },
  {
    id: 'animal',
    nome: 'Animal',
    palavras: ['animal', 'cão', 'cao', 'cachorro', 'gato', 'cobra', 'serpente', 'leão', 'leao', 'lobo', 'cavalo', 'aranha', 'pássaro', 'passaro'],
    significado:
      'Animais expressam instintos e energias naturais. A cobra fala de transformação e cura; o lobo, do instinto; o cavalo, de força vital. Observa como te relacionas com ele.',
    pergunta: 'Que instinto ou energia natural me pede atenção?',
  },
  {
    id: 'voz-mudo',
    nome: 'Não conseguir falar/mexer',
    palavras: ['não conseguia falar', 'nao conseguia falar', 'sem voz', 'paralisado', 'paralisada', 'não conseguia mexer', 'nao conseguia mexer', 'gritar e não'],
    significado:
      'Sentir-se mudo ou paralisado reflete impotência ou uma voz que não te permites usar na vida desperta — algo importante que não estás a conseguir expressar.',
    pergunta: 'O que preciso de dizer e ainda não disse?',
  },
  {
    id: 'nudez',
    nome: 'Nudez/exposição',
    palavras: ['nu', 'nua', 'pelado', 'pelada', 'sem roupa', 'exposto', 'exposta', 'vergonha em público', 'vergonha em publico'],
    significado:
      'Estar nu em público liga-se a vulnerabilidade, medo de ser julgado ou de mostrar quem realmente és. Também pode ser um convite a maior autenticidade.',
    pergunta: 'Onde tenho medo de ser visto como realmente sou?',
  },
  {
    id: 'estrada',
    nome: 'Caminho/estrada',
    palavras: ['estrada', 'caminho', 'rua', 'viagem', 'comboio', 'carro', 'autocarro', 'avião', 'aviao', 'encruzilhada', 'cruzamento'],
    significado:
      'Caminhos e viagens simbolizam o teu percurso de vida. Encruzilhadas indicam decisões; perder-se, incerteza sobre a direção a tomar.',
    pergunta: 'Que decisão de rumo está em aberto na minha vida?',
  },
  {
    id: 'agua-fogo',
    nome: 'Fogo',
    palavras: ['fogo', 'incêndio', 'incendio', 'chamas', 'queimar', 'arder', 'fogueira'],
    significado:
      'O fogo é transformação, paixão, raiva ou purificação. Destrói para renovar. Repara se queima descontrolado (emoção a transbordar) ou aquece (energia vital).',
    pergunta: 'Que emoção intensa pede espaço em mim?',
  },
  {
    id: 'exame',
    nome: 'Teste/exame',
    palavras: ['exame', 'teste', 'prova', 'reprovar', 'avaliação', 'avaliacao', 'esquecido para o exame'],
    significado:
      'Sonhar com exames revela autoavaliação e medo de não estar à altura. Sentes-te a ser julgado — talvez por ti mesmo mais do que pelos outros.',
    pergunta: 'Onde me cobro estar à altura de algo?',
  },
];

export type AnaliseSonho = {
  simbolos: SimboloOnirico[];
  sintese: string;
  perguntas: string[];
};

const HUMOR_LEITURA: Record<string, string> = {
  paz: 'Acordaste em paz, o que sugere que o sonho trouxe integração — algo dentro de ti assentou.',
  alegria: 'A alegria ao acordar indica que o sonho tocou um desejo ou potencial vivo em ti.',
  medo: 'O medo ao acordar aponta para material emocional que pede para ser olhado com cuidado e sem pressa.',
  tristeza: 'A tristeza sugere uma perda ou luto a ser processado — o sonho deu-lhe forma para poderes senti-lo.',
  confusao: 'A confusão é comum quando o inconsciente traz algo novo que a mente ainda não organizou.',
  ansiedade: 'A ansiedade indica tensão por resolver na vida desperta, que o sonho amplifica para a tornar visível.',
};

/**
 * Análise base (offline). Para ligar IA real no futuro, mantém esta
 * assinatura e troca o corpo por uma chamada à API (com a chave do utilizador).
 */
export function analisarSonho(texto: string, humor: string): AnaliseSonho {
  const t = texto.toLowerCase();
  const encontrados = SIMBOLOS.filter((s) => s.palavras.some((p) => t.includes(p)));
  // remove duplicados de nome (fogo/água-fogo etc. já têm ids distintos)
  const simbolos = encontrados.slice(0, 6);

  const partes: string[] = [];
  const humorTxt = HUMOR_LEITURA[humor];
  if (humorTxt) partes.push(humorTxt);

  if (simbolos.length === 0) {
    partes.push(
      'Não identifiquei símbolos do nosso dicionário neste relato — o que não o torna menos significativo. Cada sonho fala uma linguagem própria. Relê o teu relato e nota qual a imagem ou sensação mais forte: costuma ser por aí que o inconsciente aponta.',
    );
  } else {
    partes.push(
      `Identifiquei ${simbolos.length} ${simbolos.length === 1 ? 'símbolo central' : 'símbolos centrais'}. Em conjunto, sugerem o seguinte:`,
    );
    simbolos.forEach((s) => partes.push(`• ${s.nome} — ${s.significado}`));
    partes.push(
      'Lembra-te: os símbolos são pistas, não respostas fechadas. O significado mais verdadeiro é o que ressoa em ti quando o lês.',
    );
  }

  const perguntas = simbolos.map((s) => s.pergunta);
  if (perguntas.length === 0) {
    perguntas.push('Qual foi a imagem mais forte do sonho?', 'Que emoção ela me deixou?');
  }

  return { simbolos, sintese: partes.join('\n\n'), perguntas: perguntas.slice(0, 5) };
}

export const HUMORES = [
  { id: 'paz', label: 'Em paz', emoji: '🕊️' },
  { id: 'alegria', label: 'Alegre', emoji: '☀️' },
  { id: 'medo', label: 'Com medo', emoji: '🌑' },
  { id: 'tristeza', label: 'Triste', emoji: '🌧️' },
  { id: 'ansiedade', label: 'Ansioso', emoji: '⚡' },
  { id: 'confusao', label: 'Confuso', emoji: '🌫️' },
] as const;
