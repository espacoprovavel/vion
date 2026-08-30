-- ============================================================================
-- ÂMAGO — conteúdo-semente. Executar DEPOIS de schema.sql.
-- Idempotente: pode correr-se outra vez para repor os textos.
-- Gerado a partir de src/lib/motor/*.ts por scripts/gerar-seed.py.
-- ============================================================================

-- ── Arquétipos ──────────────────────────────────────────────────────────────
insert into public.archetypes
  (codigo, nome_sombra, nome_integrado, medo, caminho, descricao,
   toque_reconhece, toque_agradece, toque_liberta, proximo_passo, ordem)
values
  ('controlador', 'O Controlador', 'O Soberano', 'do caos — de que, se soltares, tudo se desfaça', 'confiar e soltar em testes pequenos, um de cada vez',
   'Seguras tudo porque aprendeste que, quando não seguravas, alguma coisa caiu. A vigilância tornou-se a tua forma de cuidar.',
   'Esta forma de estar apareceu por uma boa razão. Alguém teve de segurar as pontas — e foste tu.',
   'Protegeu-te do caos, e protegeu quem estava à tua volta. Fez o trabalho dela durante muito tempo.',
   'Talvez já possa descansar um pouco. Não desaparecer — descansar. E do outro lado dela está O Soberano: quem confia o suficiente para delegar, e por isso governa em vez de vigiar.',
   'Se, nos próximos dias, houver um momento em que reparares que estás a segurar tudo — e só se te parecer seguro — talvez possas escolher uma coisa pequena, das menos importantes, e deixá-la nas mãos de outra pessoa. Não para provar nada. Só para veres o que acontece cá dentro quando não seguras.', 1),
  ('provador', 'O Provador', 'O Criador', 'de não valer — de que, sem entregar, não sobre nada de ti', 'separar o teu valor do teu desempenho',
   'Entregas muito e depressa. Aprendeste que o afeto e o reconhecimento vinham a seguir a um bom resultado — nunca antes.',
   'Esta forma de estar apareceu por uma boa razão. Num sítio onde o valor se ganhava, aprendeste a ganhá-lo bem.',
   'Protegeu-te da sensação de não valeres nada. Levou-te longe, e isso é verdade.',
   'Talvez já possa descansar um pouco. E do outro lado dela está O Criador: quem faz porque tem alguma coisa para fazer, não porque tem alguma coisa para provar.',
   'Se aparecer, esta semana, um trabalho teu que já esteja suficientemente bom — e só se te apetecer experimentar — talvez possas entregá-lo assim mesmo, sem a última revisão. E reparar, com curiosidade, no que sentes na hora a seguir.', 2),
  ('invisivel', 'O Invisível', 'O Herói', 'de seres vista e julgada — de que, exposta, sejas demais', 'exposição gradual, em doses que consegues suportar',
   'Fazes bem e ficas atrás. Em algum momento, aparecer custou caro — e ficar pequena passou a ser mais seguro do que ocupar espaço.',
   'Esta forma de estar apareceu por uma boa razão. Alguma vez, aparecer não foi seguro — e aprendeste depressa.',
   'Protegeu-te de olhares que magoavam. Guardou-te quando ainda não tinhas com que te defender.',
   'Talvez já possa descansar um pouco. E do outro lado dela está O Herói: não quem se exibe, mas quem se deixa ver do tamanho que é.',
   'Se houver, nos próximos dias, uma conversa pequena e segura — uma pessoa só, alguém em quem confias — talvez possas mostrar-lhe uma coisa tua que normalmente não mostrarias. Uma coisa pequena chega. E podes reparar que o mundo continua igual depois.', 3),
  ('guardiao', 'O Guardião', 'O Explorador', 'de errar — de que um passo em falso estrague o que está de pé', 'agir imperfeito de propósito, em terreno de baixo risco',
   'Esperas o momento certo, e o momento certo demora. A tua prudência é real e já te salvou — mas também te mantém parada.',
   'Esta forma de estar apareceu por uma boa razão. Aprendeste a olhar duas vezes antes de dar um passo.',
   'Protegeu-te de erros que teriam custado caro. Poupou-te estragos que nunca chegaste a ver.',
   'Talvez já possa descansar um pouco. E do outro lado dela está O Explorador: quem avança sabendo que vai corrigir pelo caminho.',
   'Se houver, esta semana, uma decisão pequena de que nada de grave depende — e só se te parecer bem — talvez possas tomá-la em dois minutos, de propósito imperfeita. Não para acertares. Para veres que se pode corrigir depois.', 4),
  ('leal', 'O Leal', 'O Sábio', 'de trair os teus — de que crescer seja deixá-los para trás', 'autorizares-te a ir mais longe sem que isso seja um abandono',
   'Quando avanças, olhas para trás. Alguma coisa em ti mede o teu crescimento pela distância a que ficam as pessoas de quem gostas.',
   'Esta forma de estar apareceu por uma boa razão. O laço com os teus é real, e não é fraqueza nenhuma.',
   'Protegeu-te de te tornares alguém que se esquece de onde veio. Manteve-te inteira.',
   'Talvez já possa descansar um pouco. E do outro lado dela está O Sábio: quem vai mais longe e leva os seus na forma como vive, não na forma como se trava.',
   'Se houver, nos próximos dias, uma oportunidade que sintas grande de mais para o teu lugar — e só se te fizer sentido — talvez possas escrever numa linha o que terias de deixar para trás para a aceitar. Muitas vezes, quando fica escrito, vê-se que não era ninguém.', 5),
  ('indigno', 'O Indigno', 'O Merecedor', 'de não merecer — de que, olhando bem, se veja que não era para ti', 'reconhecer e receber aquilo que já é teu',
   'Conquistas e desvalorizas. Há uma voz antiga que atribui o que fizeste à sorte, ao acaso, a outra pessoa — a tudo menos a ti.',
   'Esta forma de estar apareceu por uma boa razão. Em algum lado ouviste que não era para ti, e acreditaste porque eras pequena.',
   'Protegeu-te da desilusão. Se não esperasses nada, nada te podia ser tirado.',
   'Talvez já possa descansar um pouco. E do outro lado dela está O Merecedor: quem consegue ficar quieto a receber sem ter de devolver logo.',
   'Se alguém te elogiar nos próximos dias — e só se conseguires — talvez possas responder apenas "obrigada", sem acrescentar nada, sem explicar, sem devolver. E ficar dois segundos com o desconforto, só para o conhecer melhor.', 6)
on conflict (codigo) do update set
  nome_sombra = excluded.nome_sombra, nome_integrado = excluded.nome_integrado,
  medo = excluded.medo, caminho = excluded.caminho, descricao = excluded.descricao,
  toque_reconhece = excluded.toque_reconhece, toque_agradece = excluded.toque_agradece,
  toque_liberta = excluded.toque_liberta, proximo_passo = excluded.proximo_passo,
  ordem = excluded.ordem, atualizado_em = now();

-- ── Perguntas ───────────────────────────────────────────────────────────────
insert into public.questions (chave, texto, nota, ronda, tipo, peso, peso_camada, ordem)
values
  ('q1', 'Quando um projeto teu cresce e ganha visibilidade, o que sentes primeiro?', 'Não penses muito. A primeira que te ocupa o corpo costuma ser a verdadeira.', 1, 'arquetipo'::tipo_pergunta, 1, 0, 1),
  ('q2', 'O que te trava mesmo tendo tudo para avançar?', null, 1, 'arquetipo'::tipo_pergunta, 1, 0, 2),
  ('q3', 'A crítica que mais te magoa é a que te chama…', 'Aquilo que mais dói costuma ser aquilo em que já acreditas um bocadinho.', 1, 'arquetipo'::tipo_pergunta, 1, 0, 3),
  ('q4', 'O que costumas adiar mais?', null, 1, 'arquetipo'::tipo_pergunta, 1, 0, 4),
  ('q5', 'Quando o padrão dispara, do que é que ele te protege, no fundo?', 'Não há resposta errada aqui. Só a que estiver mais perto.', 2, 'arquetipo'::tipo_pergunta, 2, 0, 5),
  ('q6', 'Onde sentes isto no corpo?', 'Se não souberes, também está bem — nem tudo se localiza à primeira.', 2, 'somatica'::tipo_pergunta, 0, 0, 6),
  ('q7', 'Quando conquistas algo importante, a tua reação honesta é…', null, 2, 'arquetipo'::tipo_pergunta, 2, 0, 7),
  ('q8', 'Este padrão, na tua família, lembra-te de quem?', 'Não é para culpar ninguém. É só para reconhecer o terreno onde isto cresceu.', 3, 'camada'::tipo_pergunta, 0, 0, 8),
  ('q9', 'Qual destas perguntas é a MAIS DIFÍCIL de responder?', 'A que custa mais é, quase sempre, a que está mais perto do Véu.', 3, 'camada'::tipo_pergunta, 0, 2, 9),
  ('q10', 'Quando penso no meu maior bloqueio, o que MENOS consigo ver é…', null, 3, 'camada'::tipo_pergunta, 0, 3, 10),
  ('q11', 'Sinceramente, quando algo corre mal, tu ASSUMES a responsabilidade?', null, 3, 'autodeclaracao'::tipo_pergunta, 0, 0, 11),
  ('q12', 'E quando tens a hipótese de crescer, tu AVANÇAS sem hesitar?', null, 3, 'autodeclaracao'::tipo_pergunta, 0, 0, 12)
on conflict (chave) do update set
  texto = excluded.texto, nota = excluded.nota, ronda = excluded.ronda,
  tipo = excluded.tipo, peso = excluded.peso, peso_camada = excluded.peso_camada,
  ordem = excluded.ordem, atualizado_em = now();

-- ── Opções de resposta ──────────────────────────────────────────────────────
insert into public.answer_options (question_id, chave, texto, arquetipo, camada, peso_camada, ordem)
values
  ((select id from public.questions where chave = 'q1'), 'q1a', 'Garantir que nada foge ao controlo', 'controlador', 'comportamento'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q1'), 'q1b', 'Tenho de mostrar que mereço', 'provador', 'comportamento'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q1'), 'q1c', 'Um aperto, preferia não estar à vista', 'invisivel', 'comportamento'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q1'), 'q1d', 'Melhor abrandar', 'guardiao', 'comportamento'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q1'), 'q1e', 'E quem ficou para trás?', 'leal', 'comportamento'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q1'), 'q1f', 'Isto não é para mim', 'indigno', 'comportamento'::camada_mergulho, null, 6),
  ((select id from public.questions where chave = 'q2'), 'q2a', 'Não confio nos outros', 'controlador', 'comportamento'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q2'), 'q2b', 'Ainda não fiz o suficiente', 'provador', 'comportamento'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q2'), 'q2c', 'Medo de me expor', 'invisivel', 'comportamento'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q2'), 'q2d', 'Espero o momento perfeito', 'guardiao', 'comportamento'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q2'), 'q2e', 'Culpa por ir mais longe que os meus', 'leal', 'comportamento'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q2'), 'q2f', 'Uma voz que diz que não vou conseguir', 'indigno', 'comportamento'::camada_mergulho, null, 6),
  ((select id from public.questions where chave = 'q3'), 'q3a', 'Controladora', 'controlador', 'historia'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q3'), 'q3b', 'Insuficiente', 'provador', 'historia'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q3'), 'q3c', '"Demais"', 'invisivel', 'historia'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q3'), 'q3d', 'Lenta/indecisa', 'guardiao', 'historia'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q3'), 'q3e', 'Egoísta', 'leal', 'historia'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q3'), 'q3f', 'Fraude', 'indigno', 'historia'::camada_mergulho, null, 6),
  ((select id from public.questions where chave = 'q4'), 'q4a', 'Largar tarefas para outros', 'controlador', 'comportamento'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q4'), 'q4b', 'Dizer "já está bom"', 'provador', 'comportamento'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q4'), 'q4c', 'Mostrar o teu trabalho', 'invisivel', 'comportamento'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q4'), 'q4d', 'Tomar a decisão', 'guardiao', 'comportamento'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q4'), 'q4e', 'Escolher-te primeiro', 'leal', 'comportamento'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q4'), 'q4f', 'Aceitar o que já conquistaste', 'indigno', 'comportamento'::camada_mergulho, null, 6),
  ((select id from public.questions where chave = 'q5'), 'q5a', 'De perder o controlo', 'controlador', 'funcao'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q5'), 'q5b', 'De me sentir insuficiente', 'provador', 'funcao'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q5'), 'q5c', 'De ser exposta', 'invisivel', 'funcao'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q5'), 'q5d', 'De errar', 'guardiao', 'funcao'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q5'), 'q5e', 'De magoar os meus', 'leal', 'funcao'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q5'), 'q5f', 'De ocupar o meu lugar', 'indigno', 'funcao'::camada_mergulho, null, 6),
  ((select id from public.questions where chave = 'q6'), 'q6a', 'Peito apertado', null, null, null, 1),
  ((select id from public.questions where chave = 'q6'), 'q6b', 'Estômago', null, null, null, 2),
  ((select id from public.questions where chave = 'q6'), 'q6c', 'Garganta', null, null, null, 3),
  ((select id from public.questions where chave = 'q6'), 'q6d', 'Ombros/nuca', null, null, null, 4),
  ((select id from public.questions where chave = 'q6'), 'q6e', 'Não sei localizar', null, null, null, 5),
  ((select id from public.questions where chave = 'q7'), 'q7a', 'Já penso no próximo risco a controlar', 'controlador', 'funcao'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q7'), 'q7b', 'Provar outra vez', 'provador', 'funcao'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q7'), 'q7c', 'Desconforto com elogios', 'invisivel', 'funcao'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q7'), 'q7d', 'Medo de manter o nível', 'guardiao', 'funcao'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q7'), 'q7e', 'Passo o mérito aos outros', 'leal', 'funcao'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q7'), 'q7f', 'Foi sorte, vão descobrir', 'indigno', 'funcao'::camada_mergulho, null, 6),
  ((select id from public.questions where chave = 'q8'), 'q8a', 'De mim só', null, 'terreno'::camada_mergulho, 1, 1),
  ((select id from public.questions where chave = 'q8'), 'q8b', 'De um dos meus pais', null, 'terreno'::camada_mergulho, 0, 2),
  ((select id from public.questions where chave = 'q8'), 'q8c', 'De alguém que "não podia brilhar"', null, 'terreno'::camada_mergulho, 0, 3),
  ((select id from public.questions where chave = 'q8'), 'q8d', 'De uma regra silenciosa lá de casa', null, 'terreno'::camada_mergulho, 0, 4),
  ((select id from public.questions where chave = 'q8'), 'q8e', 'Não faço ideia', null, 'terreno'::camada_mergulho, 3, 5),
  ((select id from public.questions where chave = 'q9'), 'q9a', 'De onde vem?', null, 'terreno'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q9'), 'q9b', 'O que o dispara?', null, 'gatilho'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q9'), 'q9c', 'Que história conto?', null, 'historia'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q9'), 'q9d', 'Do que me protege?', null, 'funcao'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q9'), 'q9e', 'Quem em mim manda?', null, 'comando'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q10'), 'q10a', 'A raiz', null, 'terreno'::camada_mergulho, null, 1),
  ((select id from public.questions where chave = 'q10'), 'q10b', 'O momento em que dispara', null, 'gatilho'::camada_mergulho, null, 2),
  ((select id from public.questions where chave = 'q10'), 'q10c', 'O que penso', null, 'historia'::camada_mergulho, null, 3),
  ((select id from public.questions where chave = 'q10'), 'q10d', 'O medo escondido', null, 'funcao'::camada_mergulho, null, 4),
  ((select id from public.questions where chave = 'q10'), 'q10e', 'Quem decide em mim', null, 'comando'::camada_mergulho, null, 5),
  ((select id from public.questions where chave = 'q11'), 'q11a', 'Sempre', null, null, null, 1),
  ((select id from public.questions where chave = 'q11'), 'q11b', 'Quase sempre', null, null, null, 2),
  ((select id from public.questions where chave = 'q11'), 'q11c', 'Às vezes', null, null, null, 3),
  ((select id from public.questions where chave = 'q11'), 'q11d', 'Raramente', null, null, null, 4),
  ((select id from public.questions where chave = 'q12'), 'q12a', 'Sempre', null, null, null, 1),
  ((select id from public.questions where chave = 'q12'), 'q12b', 'Quase sempre', null, null, null, 2),
  ((select id from public.questions where chave = 'q12'), 'q12c', 'Às vezes', null, null, null, 3),
  ((select id from public.questions where chave = 'q12'), 'q12d', 'Raramente', null, null, null, 4)
on conflict (question_id, chave) do update set
  texto = excluded.texto, arquetipo = excluded.arquetipo, camada = excluded.camada,
  peso_camada = excluded.peso_camada, ordem = excluded.ordem;


-- ── Corpo de conhecimento — UM só conjunto, etiqueta de tema opcional ───────
insert into public.knowledge_items (titulo, corpo, tema, grau_fonte, estado)
select v.titulo, v.corpo, v.tema, v.grau::grau_fonte, v.estado::estado_item
from (values
  ('Nomear antes de mudar',
   'Dar nome ao que sentimos baixa a intensidade da resposta emocional. Antes de tentares mudar o padrão, descreve-o numa frase curta: o que aconteceu, o que disseste a ti própria, o que fizeste a seguir. Nomear não resolve — mas tira à emoção parte da força com que decide por ti.',
   'regulacao', 'ciencia', 'publicado'),
  ('O hábito não se apaga, substitui-se',
   'Um hábito é um circuito de gatilho, rotina e recompensa. Não se apaga de vontade: mantém-se o gatilho, troca-se a rotina, garante-se que a nova rotina entrega alguma coisa. Por isso o próximo passo é sempre pequeno e concreto — um passo grande de mais não chega a virar circuito.',
   'habito', 'ciencia', 'publicado'),
  ('Exposição gradual',
   'Evitar aquilo que nos assusta alivia no imediato e agrava a médio prazo: cada fuga confirma ao corpo que havia mesmo perigo. A exposição gradual inverte isso — aproximações pequenas, repetidas, em contexto seguro, com espaço para o desconforto descer sozinho.',
   'exposicao', 'ciencia', 'publicado'),
  ('A função do comportamento',
   'Nenhum padrão persiste sem servir para alguma coisa. Antes de perguntares como travá-lo, pergunta do que é que ele te tem poupado. Um padrão que se percebe deixa de ser um defeito de carácter e passa a ser uma solução antiga a precisar de atualização.',
   'funcao', 'ciencia', 'publicado'),
  ('Partes internas, nenhuma delas má',
   'É útil pensar em nós como um conjunto de partes com intenções diferentes: uma quer avançar, outra quer proteger, e discordam. Nesta leitura, nenhuma parte é má — a que trava está a fazer o trabalho dela. Falar com ela funciona melhor do que combatê-la.',
   'partes', 'modelo', 'publicado'),
  ('Marcadores somáticos',
   'O corpo costuma responder antes do pensamento: o peito aperta, o estômago fecha, os ombros sobem. Saber onde é que o teu padrão mora dá-te um sinal de aviso precoce — reparas nele antes de já estares dentro da reação.',
   'corpo', 'modelo', 'publicado'),
  ('O terreno onde isto cresceu',
   'Padrões aprendem-se cedo, muitas vezes em regras que ninguém chegou a dizer em voz alta. Reconhecer o terreno não é culpar quem lá estava: é perceber que a regra fazia sentido naquele contexto, e verificar se ainda faz sentido no teu.',
   'terreno', 'ciencia', 'publicado'),
  ('Linguagem permissiva',
   'As propostas do Âmago são condicionais de propósito — "se quiseres", "talvez possas", "só se te parecer seguro". Uma ordem convida a resistência; um convite deixa espaço para a pessoa escolher. É uma escolha de linguagem, não uma técnica de sugestão.',
   'linguagem', 'modelo', 'publicado')
) as v(titulo, corpo, tema, grau, estado)
where not exists (select 1 from public.knowledge_items k where k.titulo = v.titulo);
