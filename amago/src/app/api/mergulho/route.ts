import { NextResponse } from 'next/server';
import { z } from 'zod';
import { carregaConteudo } from '@/lib/conteudo';
import { interpreta } from '@/lib/motor/motor';
import { detetaSinaisDeSofrimento } from '@/lib/motor/seguranca';
import { criaClienteServidor } from '@/lib/supabase/servidor';

export const VERSAO_CONSENTIMENTO = 'privacidade-v1';

const Corpo = z.object({
  porta: z.enum(['duvida', 'curiosidade', 'dificuldade']),
  descricao: z.string().max(2000).optional(),
  respostas: z.record(z.string(), z.string()),
  consentimento: z.literal(true),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ erro: 'Pedido inválido.' }, { status: 400 });
  }

  const parsed = Corpo.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: 'Faltam dados ou o consentimento não foi dado.' },
      { status: 400 },
    );
  }
  const { porta, descricao, respostas, consentimento } = parsed.data;

  const conteudo = await carregaConteudo();

  // Só contam respostas a perguntas e opções que existem de facto.
  const respostasValidas: Record<string, string> = {};
  for (const pergunta of conteudo.perguntas) {
    const opcaoId = respostas[pergunta.id];
    if (opcaoId && pergunta.opcoes.some((o) => o.id === opcaoId)) {
      respostasValidas[pergunta.id] = opcaoId;
    }
  }

  const obrigatorias = conteudo.perguntas.filter((p) => p.ativo);
  if (Object.keys(respostasValidas).length < obrigatorias.length) {
    return NextResponse.json({ erro: 'O Mergulho ainda não está completo.' }, { status: 400 });
  }

  const leitura = interpreta({
    perguntas: conteudo.perguntas,
    respostas: respostasValidas,
    entrada: { porta, descricao },
    arquetipos: conteudo.arquetipos,
  });

  const redeSeguranca = detetaSinaisDeSofrimento(descricao);

  const supabase = await criaClienteServidor();
  if (!supabase) {
    // Modo demonstração: nada é guardado, a leitura volta para o browser.
    return NextResponse.json({ leitura, guardado: false });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ leitura, guardado: false });
  }

  // Consentimento explícito registado com data e versão da política.
  await supabase
    .from('users')
    .update({ consentimento_em: new Date().toISOString(), consentimento_versao: VERSAO_CONSENTIMENTO })
    .eq('id', user.id);

  const { data: assessment, error: erroAssessment } = await supabase
    .from('assessments')
    .insert({
      user_id: user.id,
      porta,
      descricao: descricao?.trim() ? descricao.trim() : null,
      rede_seguranca_acionada: redeSeguranca,
    })
    .select('id')
    .single();

  if (erroAssessment || !assessment) {
    return NextResponse.json({ leitura, guardado: false });
  }

  const linhas = Object.entries(respostasValidas).map(([perguntaChave, opcaoChave]) => {
    const pergunta = conteudo.perguntas.find((p) => p.id === perguntaChave)!;
    const opcao = pergunta.opcoes.find((o) => o.id === opcaoChave)!;
    return {
      assessment_id: assessment.id,
      question_id: conteudo.idsPergunta[perguntaChave] ?? null,
      answer_option_id: conteudo.idsOpcao[opcaoChave] ?? null,
      question_chave: perguntaChave,
      option_chave: opcaoChave,
      option_texto: opcao.texto,
    };
  });

  await supabase.from('assessment_answers').insert(linhas);

  await supabase.from('results').insert({
    assessment_id: assessment.id,
    arquetipo_sombra: leitura.arquetipoSombra.codigo,
    arquetipo_integrado: leitura.arquetipoIntegrado,
    camada_veu: leitura.camadaVeu,
    fosso_detetado: leitura.fosso.detetado,
    fosso_o_que_dizes: leitura.fosso.detetado ? leitura.fosso.oQueDizes : null,
    fosso_o_que_mostras: leitura.fosso.detetado ? leitura.fosso.oQueMostras : null,
    proximo_passo: leitura.proximoPasso,
    lentes_usadas: leitura.lentesUsadas,
    leitura,
  });

  void consentimento;

  return NextResponse.json({ leitura, guardado: true, id: assessment.id });
}
