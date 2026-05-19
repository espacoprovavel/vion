export type Sombra = {
  arquetipoId: string;
  oQueRejeitas: string;
  oQuePedeIntegracao: string;
  perguntaCentral: string;
  exercicio: string;
};

export const SOMBRAS: Record<string, Sombra> = {
  sombra: {
    arquetipoId: 'sombra',
    oQueRejeitas: 'A tua própria visibilidade e o direito de ocupar espaço.',
    oQuePedeIntegracao: 'A coragem de existir sem pedir desculpa.',
    perguntaCentral: 'O que se passaria se fosses visto exactamente como és?',
    exercicio: 'Hoje, em 1 conversa, ocupa 30% mais espaço do que ocuparias. Fala mais devagar e mantém o olhar.',
  },
  penitente: {
    arquetipoId: 'penitente',
    oQueRejeitas: 'Que mereces ser perdoado pela mesma compaixão que dás aos outros.',
    oQuePedeIntegracao: 'A capacidade de te receberes com o mesmo cuidado.',
    perguntaCentral: 'Que crime imaginário continuas a expiar?',
    exercicio: 'Escreve uma carta de absolvição assinada por ti. Lê-a em voz alta diariamente, durante 7 dias.',
  },
  rendido: {
    arquetipoId: 'rendido',
    oQueRejeitas: 'A tua vitalidade e o desejo de querer.',
    oQuePedeIntegracao: 'O direito de querer algo só porque o queres.',
    perguntaCentral: 'O que te deixarias desejar se ninguém estivesse a ver?',
    exercicio: 'Em 3 minutos escreve 20 desejos sem censurar. Não para os realizar — para os reconheceres.',
  },
  enlutado: {
    arquetipoId: 'enlutado',
    oQueRejeitas: 'A vida que continua mesmo depois da perda.',
    oQuePedeIntegracao: 'A possibilidade de amar de novo sem trair o que se foi.',
    perguntaCentral: 'O que mais respeitaria a memória do que perdeste — viver ou pausar?',
    exercicio: 'Faz uma coisa pequena de que terias gostado de fazer com quem partiu. Sozinho. Sem culpa.',
  },
  vigilante: {
    arquetipoId: 'vigilante',
    oQueRejeitas: 'A possibilidade de baixar a guarda sem morrer.',
    oQuePedeIntegracao: 'Confiar que estás seguro mesmo quando descansas.',
    perguntaCentral: 'O que estás a evitar antecipando o pior?',
    exercicio: 'Por 5 minutos, fecha os olhos e diz: "Aqui, agora, estou seguro." Sente o corpo a confirmar ou recusar.',
  },
  buscador: {
    arquetipoId: 'buscador',
    oQueRejeitas: 'Que o que procuras não está no próximo passo.',
    oQuePedeIntegracao: 'Estar inteiro onde estás agora.',
    perguntaCentral: 'Se nada faltasse, o que farias hoje?',
    exercicio: '24 horas sem comprar, sem scroll, sem novas metas. Apenas habitar o que já existe.',
  },
  guerreiro: {
    arquetipoId: 'guerreiro',
    oQueRejeitas: 'A vulnerabilidade que existe por baixo da raiva.',
    oQuePedeIntegracao: 'A tristeza ou medo que a raiva está a proteger.',
    perguntaCentral: 'O que dói por baixo da tua zanga?',
    exercicio: 'Da próxima vez que sentires raiva, pergunta: "O que está magoado em mim agora?" Escreve a resposta.',
  },
  rei: {
    arquetipoId: 'rei',
    oQueRejeitas: 'Ser visto como em construção, ainda em aprendizagem.',
    oQuePedeIntegracao: 'O poder de não saber.',
    perguntaCentral: 'Em que área estás a defender uma posição já desactualizada?',
    exercicio: 'Diz hoje a alguém em quem confias: "Estava enganado." Sem justificar.',
  },
  corajoso: {
    arquetipoId: 'corajoso',
    oQueRejeitas: 'Que também precisas de descanso e cuidado.',
    oQuePedeIntegracao: 'A coragem da pausa, da fragilidade, do receber.',
    perguntaCentral: 'Onde estás a ser forte porque tens medo de pedir ajuda?',
    exercicio: 'Hoje pede algo que normalmente farias sozinho(a). Recebe sem retribuir de imediato.',
  },
  silente: {
    arquetipoId: 'silente',
    oQueRejeitas: 'Que ainda te importas — e que isso é bom.',
    oQuePedeIntegracao: 'O direito a preferir, a desejar, a entregar-te.',
    perguntaCentral: 'A tua neutralidade está a libertar-te ou a proteger-te?',
    exercicio: 'Escolhe uma causa, um projecto, uma pessoa — e entrega-te um pouco mais nesta semana.',
  },
  aprendiz: {
    arquetipoId: 'aprendiz',
    oQueRejeitas: 'A possibilidade de já saberes o suficiente para agir.',
    oQuePedeIntegracao: 'Confiar que aprenderás melhor no fazer.',
    perguntaCentral: 'Que livro/curso/preparação estás a usar como atraso?',
    exercicio: 'Hoje aplica uma única ideia que já aprendeste mas ainda não vives.',
  },
  acolhedor: {
    arquetipoId: 'acolhedor',
    oQueRejeitas: 'A tua própria necessidade — porque normalmente é a dos outros.',
    oQuePedeIntegracao: 'Pedir, exigir, escolher-te.',
    perguntaCentral: 'Onde tens estado a aceitar o que não te serve?',
    exercicio: 'Esta semana, diz 3 "nãos" claros sem justificar.',
  },
  pensador: {
    arquetipoId: 'pensador',
    oQueRejeitas: 'A inteligência do corpo e do coração.',
    oQuePedeIntegracao: 'Decidir por sentir, não só por analisar.',
    perguntaCentral: 'Que decisão estás a adiar porque a análise nunca conclui?',
    exercicio: 'Decide-a em 3 minutos pelo que o corpo diz. Anota o que aconteceu por dentro.',
  },
  amante: {
    arquetipoId: 'amante',
    oQueRejeitas: 'Que mereces o mesmo amor que dás.',
    oQuePedeIntegracao: 'Receber sem culpa.',
    perguntaCentral: 'Onde estás a cuidar dos outros para evitar o teu próprio cuidado?',
    exercicio: 'Marca 1 hora esta semana só para ti — não produtiva, não útil, só presença contigo.',
  },
  celebrante: {
    arquetipoId: 'celebrante',
    oQueRejeitas: 'A tristeza ou silêncio sob a alegria.',
    oQuePedeIntegracao: 'A presença plena também ao que não é leve.',
    perguntaCentral: 'O que estás a iluminar para não olhar?',
    exercicio: 'Senta-te 20 min com o que dói. Sem mudar. Sem fugir.',
  },
  sereno: {
    arquetipoId: 'sereno',
    oQueRejeitas: 'O envolvimento, a paixão, a entrega imperfeita.',
    oQuePedeIntegracao: 'Voltar a tocar a vida com mãos vivas.',
    perguntaCentral: 'A tua paz está a sustentar ou a separar?',
    exercicio: 'Faz algo profundamente humano hoje — dança, abraça, chora, ri. Sem método.',
  },
  iluminado: {
    arquetipoId: 'iluminado',
    oQueRejeitas: 'Que a tua presença ainda é convidada à forma.',
    oQuePedeIntegracao: 'Servir a partir da plenitude — sem propósito além de ser.',
    perguntaCentral: 'A que silêncio ainda resistes?',
    exercicio: 'Permanece.',
  },
};
