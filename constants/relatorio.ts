/**
 * Geração do Relatório VION.
 *
 * Função central: `gerarRelatorio(hz, respostas?)`.
 * Hoje devolve conteúdo estático curado por nível Hawkins; amanhã, esta
 * mesma função pode ligar a uma API de IA (Claude) sem que os ecrãs
 * precisem de mudar. NÃO chamar conteúdo diretamente — passar sempre
 * por aqui.
 *
 * Os 17 níveis têm, cada um, prática de respiração específica, prática
 * de meditação específica e o caminho próprio de contacto com o Todo.
 */
import { getGuia } from './guias';
import { getNivelMaisProximo } from './niveis';

export type Pratica = {
  nome: string;
  porque: string;
  como: string[];
  duracao: string;
};

export type RelatorioVion = {
  hz: number;
  nivel: string;
  nivelEn: string;
  cor: string;
  // Capítulo 1 — Mapa
  diagnostico: string;
  padroes: string[];
  crencaLimitante: string;
  // Capítulo 2 — Respiração específica do nível
  respiracao: Pratica;
  // Capítulo 3 — Meditação específica do nível
  meditacao: Pratica;
  // Capítulo 4 — Caminho de contacto com o Todo
  contactoComTodo: string;
  // Capítulo 5 — Práticas e afirmações
  praticas: string[];
  afirmacoes: string[];
  // Capítulo 6 — Travessia para o próximo nível
  ponteProxNivel: string;
  // Leitura individual baseada nas respostas (se disponível)
  leituraIndividual?: string;
};

// ────────────────────────────────────────────────────────────────────────
// Respiração por nível
// ────────────────────────────────────────────────────────────────────────
const respiracaoPorHz: Record<number, Pratica> = {
  20: {
    nome: 'Respiração de regresso ao corpo',
    porque:
      'Na vergonha, o corpo é vivido como inimigo. Esta respiração reabita-o, devagar, sem pedir nada — apenas presença.',
    como: [
      'Senta-te. Mão direita no peito, esquerda no abdómen.',
      'Inspira pelo nariz 4 segundos, sentindo a mão do abdómen subir.',
      'Expira pela boca 6 segundos, lenta, como quem deixa cair.',
      'Em cada expiração, dize por dentro: "Estou aqui."',
      'Não tentes mudar nada. Só voltar.',
    ],
    duracao: '5 a 7 minutos, 2× ao dia.',
  },
  30: {
    nome: 'Respiração 4-7-8 com perdão',
    porque:
      'A culpa prende. Esta técnica liberta o sistema nervoso e abre o coração para se perdoar — não esquecer, perdoar.',
    como: [
      'Inspira pelo nariz contando 4.',
      'Retém o ar 7 segundos.',
      'Expira pela boca contando 8, com um som de "haaa".',
      'Em cada ciclo, diz mentalmente: "Lamento. Perdoa-me. Obrigado. Eu amo-te." (ho\'oponopono)',
      'Direciona estas palavras a ti próprio antes de a qualquer outro.',
    ],
    duracao: '4 ciclos, 2× ao dia.',
  },
  50: {
    nome: 'Respiração de ignição',
    porque:
      'A apatia desliga o sistema. Esta respiração reativa-o suavemente, sem violentar — acende sem queimar.',
    como: [
      'De pé ou sentado direito.',
      'Inspira em 3 tempos curtos, enchendo o peito.',
      'Expira em 1 sopro longo pela boca.',
      'Repete 8 vezes — vais sentir as mãos a aquecer.',
      'Termina com 1 respiração natural, longa.',
    ],
    duracao: '3 a 4 minutos, de manhã ao acordar.',
  },
  75: {
    nome: 'Respiração que permite a lágrima',
    porque:
      'No luto, a respiração tenta empurrar a dor para baixo. Esta abre espaço para que ela atravesse — e siga.',
    como: [
      'Deita-te de costas. Mão no coração.',
      'Inspira lenta pelo nariz.',
      'Expira pela boca com som de suspiro: "hhhhaaa".',
      'Se vier lágrima, deixa. Se vier silêncio, deixa.',
      'Continua até a respiração ficar mais leve por si.',
    ],
    duracao: '7 a 10 minutos, à noite.',
  },
  100: {
    nome: 'Respiração caixa (box breathing)',
    porque:
      'O medo dispara o sistema simpático. A respiração caixa equilibra — é a técnica usada por militares e bombeiros em crise.',
    como: [
      'Inspira 4 segundos.',
      'Retém 4 segundos.',
      'Expira 4 segundos.',
      'Retém 4 segundos vazia.',
      'Repete o ciclo. Concentra-te na contagem; deixa os pensamentos passar.',
    ],
    duracao: '5 minutos, sempre que sentires antecipação ansiosa.',
  },
  125: {
    nome: 'Respiração de saciedade',
    porque:
      'O desejo é energia que persegue. Esta respiração devolve-a ao centro — pede menos lá fora, recebe mais cá dentro.',
    como: [
      'Inspira 6 segundos, lento.',
      'Retém 2 segundos, sentindo o pulmão cheio como um copo cheio.',
      'Expira 8 segundos.',
      'No fim da expiração, sente a satisfação de já estar cheio antes de inspirar de novo.',
    ],
    duracao: '6 a 10 ciclos, antes de qualquer compra ou decisão impulsiva.',
  },
  150: {
    nome: 'Kapalabhati — fogo controlado',
    porque:
      'A raiva é fogo. Em vez de reprimir, transforma-se: queima o que precisa de ser queimado e devolve clareza.',
    como: [
      'Senta-te direito. Mão no abdómen.',
      'Expira em pequenos sopros rápidos pelo nariz, contraindo o abdómen a cada um.',
      'A inspiração é passiva — entra sozinha.',
      'Faz 30 sopros, depois respiração normal por 1 min.',
      'Repete 3 ciclos. Termina sentado em silêncio.',
    ],
    duracao: 'Total 5-7 min. Evita se há tensão arterial alta ou gravidez.',
  },
  175: {
    nome: 'Respiração silenciosa',
    porque:
      'O orgulho precisa de ser visto. Esta respiração ensina que o invisível também existe — e basta.',
    como: [
      'Senta-te. Olhos fechados.',
      'Respira tão silenciosamente que nem tu próprio te ouvirias se prestasses muita atenção.',
      'Foca-te em descer o peito (o lugar onde o orgulho infla).',
      'A cada expiração: descer.',
    ],
    duracao: '8 a 10 minutos.',
  },
  200: {
    nome: 'Respiração do limiar',
    porque:
      'Coragem é atravessar o medo. Esta respiração marca cada passo: inspira a coragem, expira a entrega.',
    como: [
      'Inspira 4 segundos, peito subindo: "Coragem entra".',
      'Expira 6 segundos, ombros descendo: "Confio".',
      'Em cada ciclo, lembra-te de UMA coisa que tens medo de fazer hoje.',
      'Repete até a coisa parecer fazível.',
    ],
    duracao: '5 a 7 minutos, antes de uma ação difícil.',
  },
  250: {
    nome: 'Respiração do observador',
    porque:
      'Na neutralidade já não é preciso técnica — basta observar. A respiração torna-se a porta do testemunho.',
    como: [
      'Senta-te confortável.',
      'Não mudes a respiração — só observa.',
      'Vê o ar entrar. Vê o ar sair.',
      'Quando a mente fugir, volta — sem julgamento, como quem volta a casa.',
    ],
    duracao: '10 minutos.',
  },
  310: {
    nome: 'Respiração de abertura',
    porque:
      'A boa vontade pede aberturas no peito e na atenção. Esta respiração esculpe espaço para o novo entrar.',
    como: [
      'Inspira lenta pelo nariz, peito subindo e ombros levemente para trás.',
      'Sorri muito ligeiramente — só o canto dos lábios.',
      'Expira como quem solta um "sim" silencioso.',
      'Pensa: "Estou disponível para aprender."',
    ],
    duracao: '10 minutos, de manhã.',
  },
  350: {
    nome: 'Respiração do "sim"',
    porque:
      'Aceitação é dizer sim ao que é. Esta respiração transforma cada expiração em consentimento ao real.',
    como: [
      'Inspira lento, neutro.',
      'A cada expiração, diz por dentro: "Sim. Isto também."',
      'Aplica a qualquer coisa: o cansaço, a dor, a alegria, o tédio.',
      'Não é resignação — é cooperação com a vida.',
    ],
    duracao: '10 a 15 minutos.',
  },
  400: {
    nome: 'Respiração da clareza',
    porque:
      'A razão é poderosa mas frenética. Esta respiração ordena a mente como quem arruma uma secretária antes de pensar.',
    como: [
      'Inspira 6 segundos: a mente para de produzir.',
      'Retém 2: silêncio.',
      'Expira 6: o que era ruído desce e organiza-se.',
      'Após 4 ciclos, formula a pergunta que te trazes.',
    ],
    duracao: '4 ciclos antes de qualquer decisão importante.',
  },
  500: {
    nome: 'Respiração do coração',
    porque:
      'No amor, a respiração desloca o seu centro: já não vem da barriga nem do peito alto — vem do meio do esterno.',
    como: [
      'Mão no centro do peito.',
      'Inspira como se o ar entrasse pelo coração.',
      'Expira como se o ar saísse pelo coração.',
      'Pensa em alguém — qualquer pessoa, presente ou ausente — e respira-lhe amor.',
    ],
    duracao: '10 minutos, e quando precisares de te lembrar do que importa.',
  },
  540: {
    nome: 'Respiração da celebração',
    porque:
      'A alegria não precisa de ser convocada — precisa de espaço. Esta respiração devolve leveza à inspiração.',
    como: [
      'Inspira leve, alta — como se sorrisses.',
      'Sem retenção.',
      'Expira solta, como riso silencioso.',
      'Inclui no peito o sentido de gratidão pelo simples facto de estares.',
    ],
    duracao: '5 a 10 minutos, sempre que a vida parecer dura.',
  },
  600: {
    nome: 'Respiração mínima',
    porque:
      'Na paz, a respiração diminui sozinha. Em vez de impor, observa-se a si própria a aquietar-se.',
    como: [
      'Senta-te imóvel.',
      'Permite que a respiração se torne mais leve, mais lenta, mais subtil.',
      'Não a forces a parar — deixa-a aproximar-se desse ponto sozinha.',
      'Aí, o respirado e o respirador desaparecem.',
    ],
    duracao: '20 a 30 minutos.',
  },
  700: {
    nome: 'A respiração que respira sozinha',
    porque:
      'Neste nível já não há técnica. A respiração é vista como um movimento do Todo a atravessar este corpo.',
    como: [
      'Senta-te ou caminha.',
      'Observa: tu não respiras — És respirado.',
      'Quem respira em ti?',
      'Permanece com esta pergunta sem precisar de resposta.',
    ],
    duracao: 'Sem tempo. Vida inteira.',
  },
};

// ────────────────────────────────────────────────────────────────────────
// Meditação por nível
// ────────────────────────────────────────────────────────────────────────
const meditacaoPorHz: Record<number, Pratica> = {
  20: {
    nome: 'Meditação "Estou aqui"',
    porque:
      'Na vergonha, a meditação não pode ser "alcançar". Tem de ser "voltar". O primeiro passo é simplesmente reconhecer-se presente.',
    como: [
      'Senta-te onde estiveres. Não precisas de almofada nem postura especial.',
      'Pousa as mãos nas coxas.',
      'Por 5 minutos, repete por dentro: "Estou aqui."',
      'Se a mente desvia, volta a frase. Sem corrigir, sem julgar.',
      'No fim, repara que estás aqui — e isso basta.',
    ],
    duracao: '5 minutos, todos os dias.',
  },
  30: {
    nome: 'Meditação do perdão',
    porque:
      'A culpa pede uma forma. Esta meditação dá-lhe rito, para que possa ser olhada — e largada.',
    como: [
      'Escreve numa folha o que te culpas.',
      'Senta-te com a folha à frente, em silêncio.',
      'Lê-a baixo. Diz: "Reconheço. Aprendi. Solto."',
      'Queima a folha (com segurança) ou rasga-a em pedaços pequenos.',
      'Senta-te 5 min em silêncio. A culpa não vai embora hoje — mas perde peso.',
    ],
    duracao: '15 minutos, uma vez por semana.',
  },
  50: {
    nome: 'Meditação da micro-presença',
    porque:
      'A apatia não suporta práticas longas. Esta é deliberadamente pequena — para criar 1 momento de presença real.',
    como: [
      'Põe um temporizador a 3 minutos.',
      'Senta-te. Olhos abertos a meio.',
      'Olha um único objeto à tua frente.',
      'Vê o objeto como se nunca o tivesses visto.',
      'No fim, levanta-te. Já o cumpriste — isso basta.',
    ],
    duracao: '3 minutos, 2× ao dia.',
  },
  75: {
    nome: 'Meditação do que se foi',
    porque:
      'No luto, fugir da dor adia. Esta meditação acolhe — e descobre que a dor amada não destrói; transforma.',
    como: [
      'Senta-te. Mão no peito.',
      'Imagina à tua frente o que perdeste — pessoa, fase, sonho.',
      'Diz-lhe baixinho: "Obrigado. Reconheço. Lembro-me."',
      'Não tentes despedir-te — fica.',
      'Permanece em silêncio até a respiração assentar.',
    ],
    duracao: '15 a 20 minutos.',
  },
  100: {
    nome: 'Meditação da raiz',
    porque:
      'O medo é flutuação. A meditação ancora — devolve o corpo ao chão e ao corpo o sentido de pertença ao planeta.',
    como: [
      'Senta-te com os pés bem no chão.',
      'Sente os pés. Sente o peso a descer pelo cóccix.',
      'Imagina raízes a sair das tuas plantas e a descer 3 metros para a terra.',
      'A cada expiração, as raízes descem mais.',
      'Permanece. O medo não desaparece — mas tem onde pousar.',
    ],
    duracao: '10 a 15 minutos, de manhã.',
  },
  125: {
    nome: 'Meditação da abundância presente',
    porque:
      'O desejo é miragem do que falta. Esta meditação treina o olho para o que já está aqui.',
    como: [
      'Senta-te com olhos fechados.',
      'Por 1 minuto, sente o peso do corpo: já estás cá.',
      'Por 1 minuto, escuta os sons: já há mundo a chegar.',
      'Por 1 minuto, sente a respiração: já és sustentado.',
      'Por 1 minuto, lembra-te de 3 coisas que tens. Não desejes mais — sente o que há.',
    ],
    duracao: '5 a 10 minutos, sempre que sentires desejo agudo.',
  },
  150: {
    nome: 'Meditação do fogo limpo',
    porque:
      'A raiva sem direção destrói. Esta meditação dá-lhe alvo simbólico para queimar o que precisa de ser queimado.',
    como: [
      'Senta-te diante de uma vela.',
      'Pensa numa coisa específica que te ergue raiva.',
      'Olha para a chama por 5 minutos. Imagina essa coisa a queimar nela.',
      'No fim, sopra a vela. Diz: "Já não preciso de carregar isto."',
      'Repete na semana seguinte — algumas coisas demoram a queimar.',
    ],
    duracao: '10 minutos.',
  },
  175: {
    nome: 'Meditação da descida',
    porque:
      'O orgulho mora alto, no peito superior. Esta meditação convida o centro para baixo — para a barriga, para o chão.',
    como: [
      'Senta-te. Imagina uma luz no centro da cabeça.',
      'A cada expiração, a luz desce 1 cm — testa, garganta, peito, plexo, abdómen.',
      'Acompanha-a por 5 a 10 ciclos.',
      'Quando chegar à barriga, descansa-a aí.',
      'A pessoa não fica mais pequena — fica mais real.',
    ],
    duracao: '10 minutos.',
  },
  200: {
    nome: 'Meditação do "atravesso"',
    porque:
      'Coragem mede-se nos atos. Esta meditação ensaia simbolicamente o ato que tens medo de fazer.',
    como: [
      'Identifica uma ação que tens medo de fazer.',
      'Senta-te. Fecha os olhos.',
      'Imagina-te a fazê-la, em câmara lenta, do princípio ao fim.',
      'Sente o medo a subir — e respira-o sem fugir.',
      'No fim, diz: "Posso. Vou."',
    ],
    duracao: '10 minutos, no dia anterior à ação.',
  },
  250: {
    nome: 'Meditação do testemunho',
    porque:
      'Aqui já não meditas para mudar — meditas para ver. O Eu observador firma-se.',
    como: [
      'Senta-te. Olhos meio fechados.',
      'Observa o que aparece: pensamento, sensação, som.',
      'A cada um, nota: "Isto também é apenas isto."',
      'Não classifiques nem persigas. Vê passar.',
    ],
    duracao: '20 minutos.',
  },
  310: {
    nome: 'Meditação da disponibilidade',
    porque:
      'Boa vontade é abertura. Esta meditação convida explicitamente o que ainda não sabes — para o teu coração.',
    como: [
      'Senta-te. Mão no coração.',
      'Diz por dentro: "Estou disponível para aprender."',
      '"Estou disponível para mudar."',
      '"Estou disponível para receber."',
      'Permanece em silêncio depois — e ouve o que vem.',
    ],
    duracao: '15 minutos.',
  },
  350: {
    nome: 'Meditação do "que assim seja"',
    porque:
      'Aceitação não é passividade. É consentimento ativo. Esta meditação treina-o até virar atitude natural.',
    como: [
      'Senta-te. Pensa numa coisa da tua vida que não muda por mais que tentes.',
      'A cada expiração, diz por dentro: "Que assim seja."',
      'Sente a tensão na cara e no peito — e deixa-a descer.',
      'No fim, escolhe uma ação concreta a partir desse novo lugar.',
    ],
    duracao: '15 minutos.',
  },
  400: {
    nome: 'Meditação contemplativa',
    porque:
      'A razão pede objeto. Esta meditação dá-lhe um — uma pergunta profunda — e ensina-o a habitá-la em vez de resolver.',
    como: [
      'Escolhe uma pergunta: "Quem sou eu?", "O que é amar?", "Para que vivo?".',
      'Senta-te. Coloca a pergunta sem esperar resposta.',
      'Quando a mente respondia, agradeces e voltas à pergunta.',
      'A pergunta acaba por te habitar. A resposta vem fora da meditação.',
    ],
    duracao: '20 minutos.',
  },
  500: {
    nome: 'Meditação metta — bondade amorosa',
    porque:
      'O amor incondicional treina-se. Esta prática, milenar, alarga o círculo do amor até incluir o desconhecido — e o difícil.',
    como: [
      'Senta-te. Para ti: "Que eu esteja em paz. Que eu esteja feliz."',
      'Para alguém amado: "Que estejas em paz. Que estejas feliz."',
      'Para alguém neutro (vizinho, caixa do supermercado): mesmo.',
      'Para alguém com quem tens conflito: mesmo, lentamente.',
      'Para tudo o que vive: mesmo.',
    ],
    duracao: '20 minutos. Praticar dias seguidos abre o coração de forma duradoura.',
  },
  540: {
    nome: 'Meditação do sorriso interior',
    porque:
      'A alegria espalha-se pelo corpo se for convidada. Esta prática taoista descobre isso por dentro.',
    como: [
      'Senta-te. Faz um sorriso muito leve.',
      'Imagina o sorriso a entrar nos olhos. Depois no coração.',
      'Depois nos pulmões, fígado, rins, intestinos.',
      'Cada órgão sorri de volta.',
      'O corpo inteiro sorri.',
    ],
    duracao: '15 minutos.',
  },
  600: {
    nome: 'Meditação sem método',
    porque:
      'Na paz, qualquer método torna-se ruído. A prática é a ausência de prática — só presença.',
    como: [
      'Senta-te.',
      'Não faças nada.',
      'Quando descobrires que estás a fazer alguma coisa — pára.',
      'Permanece.',
    ],
    duracao: '30 a 60 minutos.',
  },
  700: {
    nome: 'A meditação que medita sozinha',
    porque:
      'Neste nível, o meditador desaparece. Não há prática separada da vida — toda a vida é meditação.',
    como: [
      'Lavas a louça: és lavado.',
      'Caminhas: és caminhado.',
      'Falas: és falado.',
      'A consciência observa-se em ti, sem ti.',
    ],
    duracao: 'Sempre.',
  },
};

// ────────────────────────────────────────────────────────────────────────
// Contacto com o Todo por nível
// ────────────────────────────────────────────────────────────────────────
const contactoComTodoPorHz: Record<number, string> = {
  20:
    'A vergonha sussurra que estás separado, errado, indigno. É mentira velha. O Todo não exclui quem se esconde — espera-o.\n\nNeste nível, o contacto com o Todo não é místico — é corporal. Cada inspiração é a prova de que continuas a ser sustentado por algo maior. Cada batimento. Cada nascer do dia que não pediste e veio. O Todo está a manter-te vivo mesmo quando achas que não devias estar. Reconhecer isto é o início.',
  30:
    'A culpa fixa-te no acto. O Todo vê o ser — não o acto isolado. Conhecer o Todo neste nível é descobrir que mesmo o erro faz parte do desdobrar.\n\nA cada respiração, lembra-te: o universo que te respira agora é o mesmo que já te perdoou antes de pediste perdão. A reparação fica contigo — mas o teu lugar não está em risco.',
  50:
    'Na apatia, o Todo parece ter abandonado o cenário. Não abandonou — ficaste tu de costas para ele.\n\nO caminho de contacto neste nível é sensorial: a chuva no rosto, o sol nas mãos, o café quente. O Todo aparece através dos sentidos antes de aparecer no pensamento. Volta ao corpo e Ele volta a ti.',
  75:
    'No luto, sente-se que o Todo perdeu uma parte de si — e em certo sentido é verdade. Mas o que se perdeu também voltou ao Todo. Nada cai fora dele.\n\nNeste nível, contactas o Todo cada vez que choras o que amaste. A lágrima é prova de que houve ligação real. A dor é a forma do amor que ainda existe.',
  100:
    'O medo torna o Todo num juiz à espera. Não é. O Todo é leito — sustenta, não vigia.\n\nNeste nível, o contacto faz-se na coragem de descer um nível em cada momento de pânico. Pôr os pés no chão e perguntar: "O que é real agora, neste segundo?" Aquilo que é real é o Todo a chegar.',
  125:
    'O desejo procura no horizonte o que está dentro. O Todo não é o que vais alcançar — é o que estás a atravessar.\n\nNeste nível, contactas o Todo cada vez que paras a perseguição por 5 minutos e sentes a satisfação simples do agora. O que procuras lá fora é exactamente isto — apenas vestido de outras roupas.',
  150:
    'A raiva é energia do Todo a passar mal canalizada. Não a reprimas — direcciona. A injustiça que te ergue é informação sobre o que o Todo te pede para corrigir.\n\nContactas o Todo quando transformas a raiva em ação justa e mesurada. A raiva pura é vontade do Todo a procurar agente.',
  175:
    'O orgulho fecha o Todo num único ponto: tu. Mas tu nunca foste só tu — foste sempre o Todo a viver-se como tu.\n\nNeste nível, o contacto começa quando admites uma vez, em voz baixa: "Posso estar errado." Essa frase abre uma fenda. Por ela entra o que estava de fora.',
  200:
    'Acima dos 200 Hz, a consciência começa a irradiar. O Todo já não é teoria — é experiência directa.\n\nNeste nível, contactas o Todo cada vez que escolhes agir apesar do medo. Cada acto corajoso é uma confirmação de que o Todo conta contigo e tu confias n\'Ele.',
  250:
    'Na neutralidade, percebes pela primeira vez que o Todo não está em conflito com nada — incluindo o que tu rejeitas.\n\nContactas o Todo no espaço entre os opostos. Onde tu deixas de tomar partido, abre-se uma porta. Por ela vê-se o cenário inteiro.',
  310:
    'A boa vontade é a tua mão estendida ao Todo. Ele responde com a sua a ti — mas só consegues sentir essa resposta se mantiveres a tua estendida.\n\nNeste nível, o contacto é diário e simples: cada vez que dizes "sim" ao próximo passo, sentes a corrente do Todo a passar por ti.',
  350:
    'Aceitar é colaborar com o Todo. Já não há eu contra a vida — há o eu A SER a vida.\n\nContactas o Todo a cada "sim" interno. Quanto mais "sim", mais o Todo te ocupa. Resistir é fechar a fechadura por dentro.',
  400:
    'A razão pura, quando vê com clareza, encontra o Todo pela ordem que descobre na natureza, nos números, nas leis.\n\nNeste nível, contactas o Todo quando reconheces o desenho subjacente em algo que estudas. A inteligência que vês a operar no real é a mesma que está a operar a tua compreensão. Estás a pensar com a mente d\'Ele.',
  500:
    'No amor incondicional, o Todo deixa de ser objecto e torna-se direcção. Tu amas — e o amor que te atravessa não é teu, é d\'Ele a passar por ti.\n\nContactas o Todo cada vez que amas alguém sem esperar nada em troca, incluindo desconhecidos e pessoas com quem tens conflito. O amor é o nome próprio do Todo neste nível.',
  540:
    'A alegria sem causa é a assinatura do Todo a brilhar através de ti.\n\nContactas o Todo cada vez que te apanhas a rir sem motivo, a olhar para uma árvore com gratidão sem origem. Esta alegria não vem de ti — vem por ti. És o canal por onde a alegria do Todo entra no mundo.',
  600:
    'Na paz, a separação entre tu e o Todo torna-se difícil de manter. Há uma transparência que nem o pensamento consegue obscurecer.\n\nContactas o Todo permanecendo. Em silêncio. Sem nada a fazer. Sem ninguém a tornar-te. A paz é a temperatura do contacto.',
  700:
    'Aqui não há contacto — há identidade. Tu és o Todo a experienciar-se em forma humana.\n\nO ego dissolveu-se sem desaparecer; manteve-se como instrumento. O Todo respira por estas narinas, vê por estes olhos, ama por este coração. Não há mais ninguém em casa — e está cheio.',
};

// ────────────────────────────────────────────────────────────────────────
// Leitura individual a partir das respostas
// ────────────────────────────────────────────────────────────────────────
function leituraDasRespostas(respostas: number[]): string | undefined {
  if (!respostas || respostas.length !== 24) return undefined;
  const b1 = respostas.slice(0, 12);
  const b2 = respostas.slice(12, 24);
  const min = Math.min(...respostas);
  const max = Math.max(...respostas);
  const mediaB1 = b1.reduce((a, b) => a + b, 0) / 12;
  const mediaB2 = b2.reduce((a, b) => a + b, 0) / 12;
  const desfasamento = Math.abs(mediaB1 - mediaB2);

  const partes: string[] = [];

  if (max - min >= 400) {
    partes.push(
      `Há uma amplitude muito ampla nas tuas respostas — pontos altos perto de ${max}Hz e pontos baixos perto de ${min}Hz. Isto sugere que carregas estados muito diferentes em ti, conforme o tema. Não és uma só nota — és um acorde.`,
    );
  } else if (max - min <= 150) {
    partes.push(
      `As tuas respostas vivem todas numa faixa próxima (entre ${min} e ${max} Hz). Isto indica integração — operas a partir de um centro estável, com pouca dispersão.`,
    );
  }

  if (desfasamento >= 80) {
    if (mediaB1 > mediaB2) {
      partes.push(
        'O teu comportamento exterior (Bloco 1) vibra mais alto do que as tuas crenças internas (Bloco 2). Funcionas bem por fora, mas há trabalho por fazer com o que carregas por dentro. O próximo nível abre-se quando o interno alcançar o externo.',
      );
    } else {
      partes.push(
        'As tuas crenças internas (Bloco 2) vibram mais alto do que o teu comportamento exterior (Bloco 1). Sabes muito; falta deixar o saber descer para o gesto. O próximo nível abre-se quando o que sabes passar a viver.',
      );
    }
  } else {
    partes.push(
      'Comportamento e crenças vibram em harmonia próxima — o que sentes é o que vives. É a base mais sólida para crescimento.',
    );
  }

  return partes.join('\n\n');
}

// ────────────────────────────────────────────────────────────────────────
// Função central — única porta para o conteúdo do relatório
// ────────────────────────────────────────────────────────────────────────
export function gerarRelatorio(hz: number, respostas?: number[]): RelatorioVion {
  const nivel = getNivelMaisProximo(hz);
  const guia = getGuia(nivel.hz);
  return {
    hz: nivel.hz,
    nivel: nivel.nome,
    nivelEn: nivel.en,
    cor: nivel.cor,
    diagnostico: guia.diagnostico,
    padroes: guia.padroes,
    crencaLimitante: guia.crencaLimitante,
    respiracao: respiracaoPorHz[nivel.hz] ?? respiracaoPorHz[200],
    meditacao: meditacaoPorHz[nivel.hz] ?? meditacaoPorHz[200],
    contactoComTodo: contactoComTodoPorHz[nivel.hz] ?? contactoComTodoPorHz[200],
    praticas: guia.praticas,
    afirmacoes: guia.afirmacoes,
    ponteProxNivel: guia.ponteProxNivel,
    leituraIndividual: respostas ? leituraDasRespostas(respostas) : undefined,
  };
}
