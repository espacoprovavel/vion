import re, sys

def esc(s):
    return "'" + s.replace("'", "''") + "'"

# ---- archetypes ----
arq_src = open('src/lib/motor/arquetipos.ts').read()
starts = [(m.group(1), m.start()) for m in re.finditer(r'^  (\w+): \{$', arq_src, re.M)]
ends = [m.start() for m in re.finditer(r'^  \},$', arq_src, re.M)]
arqs = []
for (codigo, st), en in zip(starts, ends):
    body = arq_src[st:en]
    def field(name, b=None):
        b = arq_src[st:en] if b is None else b
        m = re.search(name + r":\s*\n?\s*'((?:[^'\\]|\\.)*)'", b)
        if not m: sys.exit("miss " + name + " in " + codigo)
        return m.group(1).replace("\\'", "'")
    toque = re.search(r"textoToque: \{(.*?)\n    \},", body, re.S).group(1)
    arqs.append(dict(
        codigo=codigo,
        nome_sombra=field('nomeSombra'), nome_integrado=field('nomeIntegrado'),
        medo=field('medo'), caminho=field('caminho'), descricao=field('descricao'),
        toque_reconhece=field('reconhece', toque), toque_agradece=field('agradece', toque),
        toque_liberta=field('liberta', toque), proximo_passo=field('proximoPasso'),
    ))
assert len(arqs) == 6, len(arqs)

# ---- questions ----
q_src = open('src/lib/motor/perguntas.ts').read()
qstarts = [(m.group(1), m.start()) for m in re.finditer(r"^  \{\n    id: '(q\d+)',$", q_src, re.M)]
qends = [m.start() for m in re.finditer(r'^  \},$', q_src, re.M)]
questions = []
for (qid, st), en in zip(qstarts, qends):
    body = q_src[st:en]
    def f(name, cast=str):
        m = re.search(name + r": (?:'((?:[^'\\]|\\.)*)'|([\d.]+)|(true|false))", body)
        if not m: return None
        return (m.group(1) or m.group(2) or m.group(3)).replace("\\'", "'")
    opts = re.findall(
        r"\{ id: '(\w+)', ordem: (\d+), texto: '((?:[^'\\]|\\.)*)', "
        r"arquetipo: (null|'\w+'), camada: (null|'\w+')(?:, pesoCamada: (\d+))? \}", body)
    questions.append(dict(
        chave=qid, texto=f('texto'), nota=f('nota'), ronda=int(f('ronda')),
        tipo=f('tipo'), peso=f('peso'), peso_camada=f('pesoCamada'), ordem=int(f('ordem')),
        opcoes=[dict(chave=o[0], ordem=int(o[1]), texto=o[2].replace("\\'", "'"),
                     arquetipo=None if o[3] == 'null' else o[3].strip("'"),
                     camada=None if o[4] == 'null' else o[4].strip("'"),
                     peso_camada=None if o[5] == '' else o[5]) for o in opts],
    ))
assert len(questions) == 12, len(questions)
bad = [(q['chave'], len(q['opcoes'])) for q in questions if len(q['opcoes']) < 4]
assert not bad, bad

out = ["""-- ============================================================================
-- ÂMAGO — conteúdo-semente. Executar DEPOIS de schema.sql.
-- Idempotente: pode correr-se outra vez para repor os textos.
-- Gerado a partir de src/lib/motor/*.ts por scripts/gerar-seed.py.
-- ============================================================================

-- ── Arquétipos ──────────────────────────────────────────────────────────────
insert into public.archetypes
  (codigo, nome_sombra, nome_integrado, medo, caminho, descricao,
   toque_reconhece, toque_agradece, toque_liberta, proximo_passo, ordem)
values"""]
rows = []
for i, a in enumerate(arqs):
    rows.append("  (%s, %s, %s, %s, %s,\n   %s,\n   %s,\n   %s,\n   %s,\n   %s, %d)" % (
        esc(a['codigo']), esc(a['nome_sombra']), esc(a['nome_integrado']), esc(a['medo']),
        esc(a['caminho']), esc(a['descricao']), esc(a['toque_reconhece']),
        esc(a['toque_agradece']), esc(a['toque_liberta']), esc(a['proximo_passo']), i + 1))
out.append(",\n".join(rows) + """
on conflict (codigo) do update set
  nome_sombra = excluded.nome_sombra, nome_integrado = excluded.nome_integrado,
  medo = excluded.medo, caminho = excluded.caminho, descricao = excluded.descricao,
  toque_reconhece = excluded.toque_reconhece, toque_agradece = excluded.toque_agradece,
  toque_liberta = excluded.toque_liberta, proximo_passo = excluded.proximo_passo,
  ordem = excluded.ordem, atualizado_em = now();

-- ── Perguntas ───────────────────────────────────────────────────────────────
insert into public.questions (chave, texto, nota, ronda, tipo, peso, peso_camada, ordem)
values""")
rows = []
for q in questions:
    rows.append("  (%s, %s, %s, %d, %s, %s, %s, %d)" % (
        esc(q['chave']), esc(q['texto']),
        esc(q['nota']) if q['nota'] else 'null',
        q['ronda'], esc(q['tipo']) + '::tipo_pergunta', q['peso'], q['peso_camada'], q['ordem']))
out.append(",\n".join(rows) + """
on conflict (chave) do update set
  texto = excluded.texto, nota = excluded.nota, ronda = excluded.ronda,
  tipo = excluded.tipo, peso = excluded.peso, peso_camada = excluded.peso_camada,
  ordem = excluded.ordem, atualizado_em = now();

-- ── Opções de resposta ──────────────────────────────────────────────────────
insert into public.answer_options (question_id, chave, texto, arquetipo, camada, peso_camada, ordem)
values""")
rows = []
for q in questions:
    for o in q['opcoes']:
        rows.append("  ((select id from public.questions where chave = %s), %s, %s, %s, %s, %s, %d)" % (
            esc(q['chave']), esc(o['chave']), esc(o['texto']),
            esc(o['arquetipo']) if o['arquetipo'] else 'null',
            (esc(o['camada']) + '::camada_mergulho') if o['camada'] else 'null',
            o['peso_camada'] if o['peso_camada'] is not None else 'null',
            o['ordem']))
out.append(",\n".join(rows) + """
on conflict (question_id, chave) do update set
  texto = excluded.texto, arquetipo = excluded.arquetipo, camada = excluded.camada,
  peso_camada = excluded.peso_camada, ordem = excluded.ordem;
""")

out.append("""
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
""")

open('supabase/seed.sql', 'w').write("\n".join(out))
print("arquetipos:", len(arqs), "perguntas:", len(questions),
      "opcoes:", sum(len(q['opcoes']) for q in questions))
