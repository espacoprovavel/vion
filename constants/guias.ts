export type Guia = {
  diagnostico: string;
  padroes: string[];
  crencaLimitante: string;
  praticas: string[];
  afirmacoes: string[];
  ponteProxNivel: string;
};

const baseAfirmacoes = [
  'Eu mereço estar inteiro(a) e em paz.',
  'O meu valor não depende do que faço.',
  'Estou seguro(a) para sentir o que sinto.',
  'Estou disposto(a) a soltar o que já não me serve.',
  'A vida flui através de mim, não contra mim.',
  'Eu confio no tempo certo do meu desdobrar.',
  'Sou um canal de consciência em expansão.',
];

const baseCrencaPorHz: Record<number, string> = {
  20: 'Há algo errado comigo desde sempre.',
  30: 'Não me posso perdoar pelo que fiz/não fiz.',
  50: 'Já não vale a pena tentar.',
  75: 'Perdi o que me sustentava — não vou recuperar.',
  100: 'O mundo é perigoso e tenho de me proteger.',
  125: 'Só serei feliz quando obtiver X.',
  150: 'Os outros são responsáveis pelo que sinto.',
  175: 'Tenho de ser melhor que os outros para valer.',
  200: 'Tenho de me esforçar muito para merecer.',
  250: 'Não vale a pena envolver-me em demasia.',
  310: 'Crescer é um projecto pessoal solitário.',
  350: 'Já aceitei — agora não preciso de mais.',
  400: 'A mente é o único caminho confiável.',
  500: 'O amor é o caminho — mas há ainda mais.',
  540: 'A alegria é o auge.',
  600: 'A paz é o destino.',
  700: 'Já chegámos. Só permanecemos.',
};

const padroesPorHz: Record<number, string[]> = {
  20: [
    'Ocultas partes de ti porque acreditas que são vergonhosas.',
    'Evitas ser visto(a) — fisica e emocionalmente.',
    'Pedes desculpa por existir antes mesmo de falar.',
  ],
  30: [
    'Punes-te com pensamentos repetitivos sobre o passado.',
    'Sabotas o que está a correr bem para não sentires que não mereces.',
    'Sentes culpa quando recebes algo bom sem ter "ganho".',
  ],
  50: [
    'Desistes antes de tentar para evitar a confirmação de falha.',
    'Adias decisões pequenas porque parecem demasiado.',
    'Isolas-te como forma de gestão da pouca energia.',
  ],
  75: [
    'Procuras na memória o que perdeste em vez de no presente o que existe.',
    'Sentes que ninguém compreende o que vives.',
    'Recusas o conforto que te oferecem por achares que não o mereces.',
  ],
  100: [
    'Antecipas constantemente o pior cenário.',
    'Procuras controlo em lugares onde não existe.',
    'O corpo está em alerta permanente sem razão imediata.',
  ],
  125: [
    'Persegues estados que se evaporam ao serem alcançados.',
    'Comparas o que tens com o que vês nos outros e no online.',
    'Sentes vazio quando paras de procurar.',
  ],
  150: [
    'Reages antes de responder em interacções carregadas.',
    'Justificas a raiva como verdade superior dos outros.',
    'Acumulas tensão no corpo (mandíbula, ombros, peito).',
  ],
  175: [
    'Defendes a tua imagem mesmo quando há informação útil a receber.',
    'Sentes-te ameaçado(a) pelo sucesso dos próximos.',
    'Confundes posição social com valor.',
  ],
  200: [
    'Ainda exiges desempenho constante para sentir paz.',
    'Mede o teu valor pelo que produzes.',
    'Tens medo de baixar a guarda — confundes descanso com perda.',
  ],
  250: [
    'Tens dificuldade em comprometeres-te emocionalmente.',
    'A neutralidade torna-se afastamento.',
    'Confundes não-julgamento com indiferença.',
  ],
  310: [
    'Queres crescer mas hesitas em pedir ajuda.',
    'Sobrecarregas-te com práticas em vez de aprofundares uma.',
    'O "ainda não cheguei" continua a ser a tua identidade.',
  ],
  350: [
    'Aceitas tanto que deixas de mover-te.',
    'Confundes paz com estagnação.',
    'O ego diz que já chegou — quando o caminho continua.',
  ],
  400: [
    'Analisas o que devia ser sentido.',
    'Argumentas para evitar a vulnerabilidade.',
    'O coração espera que a mente se canse.',
  ],
  500: [
    'Cuidas dos outros antes de te incluíres no amor.',
    'Confundes amor com sacrifício.',
    'Há ainda um filtro subtil entre tu e o todo.',
  ],
  540: [
    'A alegria distrai-se de momentos mais profundos.',
    'Resistes às camadas mais silenciosas que vêm depois.',
    'Procuras partilhar antes de assentar.',
  ],
  600: [
    'O silêncio começa a ser o teu lar — e isso pode tornar-se identidade.',
    'A pessoa tornou-se quase impessoal.',
    'Ainda há um observador subtil.',
  ],
  700: [
    'O ser dissolve-se — e mesmo a observação disto é movimento.',
    'A linguagem torna-se um obstáculo à transmissão.',
    'A presença é tudo o que resta.',
  ],
};

const praticasPorHz: Record<number, string[]> = {
  20: [
    '5 min de respiração consciente sem julgar pensamentos.',
    'Olha-te ao espelho 30 seg e diz: "Estou aqui."',
    'Escreve 1 verdade incómoda por dia — só para ti.',
    'Caminha 10 min com a cabeça erguida, sem telemóvel.',
    'Repete antes de dormir: "Sou suficiente como sou agora."',
  ],
  30: [
    'Escreve uma carta a ti próprio(a) do passado — perdoa um acto.',
    'Lista 3 lições do que te traz culpa, e queima a lista.',
    'Caminha 15 min em silêncio na natureza.',
    'Pratica respiração 4-7-8 antes de dormir.',
    'Faz uma reparação simples por semana com quem feriste.',
  ],
  50: [
    'Acorda à mesma hora 7 dias — só isso.',
    '10 min de luz solar matinal diária.',
    'Movimenta o corpo 5 min — sem objectivo de desempenho.',
    'Bebe 2L de água + come 1 refeição quente.',
    'Liga a uma pessoa segura 1 vez por semana.',
  ],
  75: [
    'Cria um pequeno ritual diário em memória do que perdeste.',
    'Escreve uma carta àquilo (ou quem) partiu.',
    'Aceita um abraço (humano ou animal) diariamente.',
    'Permite-te chorar quando vier, sem narrativa.',
    'Faz uma coisa nova, pequena, por semana.',
  ],
  100: [
    'Lista 3 medos por dia + 1 acto contrário a cada um por semana.',
    'Inspira 4s / segura 4s / expira 6s — 10 ciclos.',
    'Reduz café e notícias em 50%.',
    'Faz 1 conversa difícil que tens adiado.',
    'Anota o que correu BEM no dia (não o que falhou).',
  ],
  125: [
    'Pratica 24h sem redes sociais por semana.',
    'Escreve o que terias se nada faltasse.',
    'Identifica o desejo por detrás do desejo.',
    'Pratica gratidão imediata após um impulso.',
    'Permite-te sentar com o vazio 10 min por dia.',
  ],
  150: [
    'Quando sentires raiva — 90 segundos de respiração ANTES de agir.',
    'Treino físico intenso 3x por semana.',
    'Lista o que a raiva está realmente a proteger.',
    'Pratica dizer "não" sem justificar.',
    'Escreve cartas de raiva — depois rasga-as.',
  ],
  175: [
    'Pede ajuda a alguém por dia — algo pequeno.',
    'Reconhece em voz alta uma coisa em que te enganaste.',
    'Celebra publicamente um sucesso alheio.',
    'Faz uma pausa antes de defender uma opinião.',
    'Pratica a frase: "Não sei — diz-me mais."',
  ],
  200: [
    'Decide 1 acto difícil por semana e cumpre-o.',
    'Diz "sim" a algo que te assusta mas é seu.',
    'Treina respiração consciente 10 min por dia.',
    'Limita reactividade às redes durante 7 dias.',
    'Reserva 1 hora de descanso real diariamente.',
  ],
  250: [
    'Observa 1 reacção por dia sem agir nela.',
    'Pratica meditação de 20 min diários.',
    'Sai do papel de mediador onde não te pertence.',
    'Permite preferências sem necessidade.',
    'Volta a comprometer-te com algo que evitavas.',
  ],
  310: [
    'Aprofunda uma única prática por 30 dias.',
    'Pede orientação a alguém com mais caminho.',
    'Comprometida com 1 acto de serviço semanal.',
    'Estuda 1 capítulo por semana.',
    'Documenta as tuas descobertas.',
  ],
  350: [
    'Acolhe sem narrativa o que vier no dia.',
    'Pratica 30 min de meditação diária.',
    'Liberta uma expectativa por semana.',
    'Recebe sem corresponder de imediato.',
    'Faz 1 acto sem propósito utilitário.',
  ],
  400: [
    'Equilibra leitura com prática corporal.',
    'Faz 1 escolha pelo coração por dia.',
    'Reduz o tempo de análise antes de agir.',
    'Conversa com alguém de outra área de saber.',
    'Permite emoções 10 min/dia sem as explicar.',
  ],
  500: [
    'Inclui-te explicitamente em cada acto de amor.',
    'Pratica meditação do coração 20 min/dia.',
    'Cria silêncios mais longos nas tuas conversas.',
    'Faz 1 acto anónimo por semana.',
    'Sustenta o olhar de outro 30 seg sem palavras.',
  ],
  540: [
    'Pratica silêncio voluntário 1 dia por mês.',
    'Aprofunda a meditação sem objectivo.',
    'Reduz a partilha — alguma coisa fica só tua.',
    'Permite a tristeza dentro da alegria.',
    'Senta-te com o que vier — sem mudar nada.',
  ],
  600: [
    'Retiros regulares de silêncio.',
    'Não-acção como prática consciente.',
    'Estuda mestres da tradição contemplativa.',
    'Caminha sem destino diariamente.',
    'Sirva sem assinar.',
  ],
  700: [
    'Permanece.',
    'Permite o desdobrar.',
    'Sem método. Sem caminho.',
    'Presença pura.',
    'Tudo é prática.',
  ],
};

const proxNivelPonte: Record<number, string> = {
  20: 'Da vergonha à culpa: começa a olhar para o que fizeste em vez de para quem és. Exercício: escreve 1 acto específico que carregas — não a tua identidade inteira.',
  30: 'Da culpa à apatia: ganhar repouso reorganiza a culpa. Exercício: 1 reparação simbólica por mês.',
  50: 'Da apatia ao luto: reconectar com o que perdeste é o primeiro sentir. Exercício: escreve o que já não está.',
  75: 'Do luto ao medo: o medo é movimento. Exercício: nomeia o medo escondido sob a tua tristeza.',
  100: 'Do medo ao desejo: o desejo dá direcção ao medo. Exercício: lista o que quererias se não tivesses medo.',
  125: 'Do desejo à raiva: a raiva sinaliza o limite. Exercício: identifica o "não" que tens guardado.',
  150: 'Da raiva ao orgulho: a raiva canalizada constrói. Exercício: aplica a energia da raiva num projecto.',
  175: 'Do orgulho à coragem: a coragem é orgulho que se permite errar. Exercício: faz algo onde podes falhar publicamente.',
  200: 'Da coragem à neutralidade: a coragem aprende a não exigir constante prova. Exercício: 1 dia sem provares nada a ninguém.',
  250: 'Da neutralidade à boa vontade: abre uma porta. Exercício: faz 1 acto de serviço genuíno por semana.',
  310: 'Da boa vontade à aceitação: aceita o que ainda não muda. Exercício: descreve a tua vida actual sem queixa nem desejo.',
  350: 'Da aceitação à razão: clareia o pensamento. Exercício: estuda algo difícil por 30 dias.',
  400: 'Da razão ao amor: deixa o coração liderar 1h por dia. Exercício: decide algo por sentimento, não por análise.',
  500: 'Do amor à alegria: inclui-te no amor. Exercício: faz algo que te dá alegria sem útil para ninguém.',
  540: 'Da alegria à paz: aprofunda o silêncio. Exercício: 30 min de silêncio total por dia.',
  600: 'Da paz à iluminação: solta o observador. Exercício: medita sem método.',
  700: 'Permanece.',
};

export const getGuia = (hz: number): Guia => ({
  diagnostico: `O teu padrão actual gira em torno de ${hz}Hz. Este nível organiza como te relacionas contigo, com os outros e com o futuro. Não é um julgamento — é um mapa. Cada padrão tem a sua função; o trabalho é torná-lo consciente.`,
  padroes: padroesPorHz[hz] ?? padroesPorHz[200],
  crencaLimitante: baseCrencaPorHz[hz] ?? baseCrencaPorHz[200],
  praticas: praticasPorHz[hz] ?? praticasPorHz[200],
  afirmacoes: baseAfirmacoes,
  ponteProxNivel: proxNivelPonte[hz] ?? proxNivelPonte[200],
});
