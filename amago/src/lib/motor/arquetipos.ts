import type { Arquetipo, CodigoArquetipo } from './tipos';

/**
 * Seis padrões psicológicos. Cada um é uma SOMBRA com uma FORMA INTEGRADA.
 * Não são tipos fixos de personalidade — são posições que uma pessoa ocupa
 * enquanto o padrão lhe for útil.
 */
export const ARQUETIPOS: Record<CodigoArquetipo, Arquetipo> = {
  controlador: {
    codigo: 'controlador',
    nomeSombra: 'O Controlador',
    nomeIntegrado: 'O Soberano',
    medo: 'do caos — de que, se soltares, tudo se desfaça',
    caminho: 'confiar e soltar em testes pequenos, um de cada vez',
    descricao:
      'Seguras tudo porque aprendeste que, quando não seguravas, alguma coisa caiu. A vigilância tornou-se a tua forma de cuidar.',
    textoToque: {
      reconhece:
        'Esta forma de estar apareceu por uma boa razão. Alguém teve de segurar as pontas — e foste tu.',
      agradece:
        'Protegeu-te do caos, e protegeu quem estava à tua volta. Fez o trabalho dela durante muito tempo.',
      liberta:
        'Talvez já possa descansar um pouco. Não desaparecer — descansar. E do outro lado dela está O Soberano: quem confia o suficiente para delegar, e por isso governa em vez de vigiar.',
    },
    proximoPasso:
      'Se, nos próximos dias, houver um momento em que reparares que estás a segurar tudo — e só se te parecer seguro — talvez possas escolher uma coisa pequena, das menos importantes, e deixá-la nas mãos de outra pessoa. Não para provar nada. Só para veres o que acontece cá dentro quando não seguras.',
  },
  provador: {
    codigo: 'provador',
    nomeSombra: 'O Provador',
    nomeIntegrado: 'O Criador',
    medo: 'de não valer — de que, sem entregar, não sobre nada de ti',
    caminho: 'separar o teu valor do teu desempenho',
    descricao:
      'Entregas muito e depressa. Aprendeste que o afeto e o reconhecimento vinham a seguir a um bom resultado — nunca antes.',
    textoToque: {
      reconhece:
        'Esta forma de estar apareceu por uma boa razão. Num sítio onde o valor se ganhava, aprendeste a ganhá-lo bem.',
      agradece:
        'Protegeu-te da sensação de não valeres nada. Levou-te longe, e isso é verdade.',
      liberta:
        'Talvez já possa descansar um pouco. E do outro lado dela está O Criador: quem faz porque tem alguma coisa para fazer, não porque tem alguma coisa para provar.',
    },
    proximoPasso:
      'Se aparecer, esta semana, um trabalho teu que já esteja suficientemente bom — e só se te apetecer experimentar — talvez possas entregá-lo assim mesmo, sem a última revisão. E reparar, com curiosidade, no que sentes na hora a seguir.',
  },
  invisivel: {
    codigo: 'invisivel',
    nomeSombra: 'O Invisível',
    nomeIntegrado: 'O Herói',
    medo: 'de seres vista e julgada — de que, exposta, sejas demais',
    caminho: 'exposição gradual, em doses que consegues suportar',
    descricao:
      'Fazes bem e ficas atrás. Em algum momento, aparecer custou caro — e ficar pequena passou a ser mais seguro do que ocupar espaço.',
    textoToque: {
      reconhece:
        'Esta forma de estar apareceu por uma boa razão. Alguma vez, aparecer não foi seguro — e aprendeste depressa.',
      agradece:
        'Protegeu-te de olhares que magoavam. Guardou-te quando ainda não tinhas com que te defender.',
      liberta:
        'Talvez já possa descansar um pouco. E do outro lado dela está O Herói: não quem se exibe, mas quem se deixa ver do tamanho que é.',
    },
    proximoPasso:
      'Se houver, nos próximos dias, uma conversa pequena e segura — uma pessoa só, alguém em quem confias — talvez possas mostrar-lhe uma coisa tua que normalmente não mostrarias. Uma coisa pequena chega. E podes reparar que o mundo continua igual depois.',
  },
  guardiao: {
    codigo: 'guardiao',
    nomeSombra: 'O Guardião',
    nomeIntegrado: 'O Explorador',
    medo: 'de errar — de que um passo em falso estrague o que está de pé',
    caminho: 'agir imperfeito de propósito, em terreno de baixo risco',
    descricao:
      'Esperas o momento certo, e o momento certo demora. A tua prudência é real e já te salvou — mas também te mantém parada.',
    textoToque: {
      reconhece:
        'Esta forma de estar apareceu por uma boa razão. Aprendeste a olhar duas vezes antes de dar um passo.',
      agradece:
        'Protegeu-te de erros que teriam custado caro. Poupou-te estragos que nunca chegaste a ver.',
      liberta:
        'Talvez já possa descansar um pouco. E do outro lado dela está O Explorador: quem avança sabendo que vai corrigir pelo caminho.',
    },
    proximoPasso:
      'Se houver, esta semana, uma decisão pequena de que nada de grave depende — e só se te parecer bem — talvez possas tomá-la em dois minutos, de propósito imperfeita. Não para acertares. Para veres que se pode corrigir depois.',
  },
  leal: {
    codigo: 'leal',
    nomeSombra: 'O Leal',
    nomeIntegrado: 'O Sábio',
    medo: 'de trair os teus — de que crescer seja deixá-los para trás',
    caminho: 'autorizares-te a ir mais longe sem que isso seja um abandono',
    descricao:
      'Quando avanças, olhas para trás. Alguma coisa em ti mede o teu crescimento pela distância a que ficam as pessoas de quem gostas.',
    textoToque: {
      reconhece:
        'Esta forma de estar apareceu por uma boa razão. O laço com os teus é real, e não é fraqueza nenhuma.',
      agradece:
        'Protegeu-te de te tornares alguém que se esquece de onde veio. Manteve-te inteira.',
      liberta:
        'Talvez já possa descansar um pouco. E do outro lado dela está O Sábio: quem vai mais longe e leva os seus na forma como vive, não na forma como se trava.',
    },
    proximoPasso:
      'Se houver, nos próximos dias, uma oportunidade que sintas grande de mais para o teu lugar — e só se te fizer sentido — talvez possas escrever numa linha o que terias de deixar para trás para a aceitar. Muitas vezes, quando fica escrito, vê-se que não era ninguém.',
  },
  indigno: {
    codigo: 'indigno',
    nomeSombra: 'O Indigno',
    nomeIntegrado: 'O Merecedor',
    medo: 'de não merecer — de que, olhando bem, se veja que não era para ti',
    caminho: 'reconhecer e receber aquilo que já é teu',
    descricao:
      'Conquistas e desvalorizas. Há uma voz antiga que atribui o que fizeste à sorte, ao acaso, a outra pessoa — a tudo menos a ti.',
    textoToque: {
      reconhece:
        'Esta forma de estar apareceu por uma boa razão. Em algum lado ouviste que não era para ti, e acreditaste porque eras pequena.',
      agradece:
        'Protegeu-te da desilusão. Se não esperasses nada, nada te podia ser tirado.',
      liberta:
        'Talvez já possa descansar um pouco. E do outro lado dela está O Merecedor: quem consegue ficar quieto a receber sem ter de devolver logo.',
    },
    proximoPasso:
      'Se alguém te elogiar nos próximos dias — e só se conseguires — talvez possas responder apenas "obrigada", sem acrescentar nada, sem explicar, sem devolver. E ficar dois segundos com o desconforto, só para o conhecer melhor.',
  },
};

export const CODIGOS_ARQUETIPO: CodigoArquetipo[] = [
  'controlador',
  'provador',
  'invisivel',
  'guardiao',
  'leal',
  'indigno',
];

/** Padrões que RECUAM — usados na deteção do fosso consciente/inconsciente. */
export const ARQUETIPOS_QUE_RECUAM: CodigoArquetipo[] = [
  'leal',
  'guardiao',
  'indigno',
  'invisivel',
];

/** Desempate determinístico quando duas pontuações ficam iguais. */
export const PRIORIDADE_DESEMPATE: CodigoArquetipo[] = [
  'indigno',
  'invisivel',
  'leal',
  'guardiao',
  'provador',
  'controlador',
];
