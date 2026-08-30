'use server';

import { revalidatePath } from 'next/cache';
import { criaClienteServidor, exigeMaster } from '@/lib/supabase/servidor';

async function clienteMaster() {
  const master = await exigeMaster();
  if (!master) throw new Error('Sem permissão.');
  const supabase = await criaClienteServidor();
  if (!supabase) throw new Error('Base de dados indisponível.');
  return supabase;
}

const texto = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const numero = (f: FormData, k: string, omissao = 0) => {
  const v = String(f.get(k) ?? '').trim();
  if (v === '') return omissao;
  const n = Number(v);
  return Number.isFinite(n) ? n : omissao;
};
const opcional = (f: FormData, k: string) => texto(f, k) || null;

// ── Perguntas e respostas ───────────────────────────────────────────────────
export async function guardaPergunta(formData: FormData) {
  const supabase = await clienteMaster();
  const id = texto(formData, 'id');

  await supabase
    .from('questions')
    .update({
      texto: texto(formData, 'texto'),
      nota: opcional(formData, 'nota'),
      ronda: numero(formData, 'ronda', 1),
      tipo: texto(formData, 'tipo'),
      peso: numero(formData, 'peso'),
      peso_camada: numero(formData, 'peso_camada'),
      ordem: numero(formData, 'ordem'),
      ativo: formData.get('ativo') === 'on',
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id);

  // As opções vêm no mesmo formulário: opcao:<id>:<campo>
  const porOpcao = new Map<string, Record<string, string>>();
  for (const [chave, valor] of formData.entries()) {
    const m = /^opcao:([^:]+):(.+)$/.exec(chave);
    if (!m) continue;
    const registo = porOpcao.get(m[1]) ?? {};
    registo[m[2]] = String(valor);
    porOpcao.set(m[1], registo);
  }

  for (const [opcaoId, campos] of porOpcao) {
    await supabase
      .from('answer_options')
      .update({
        texto: (campos.texto ?? '').trim(),
        arquetipo: campos.arquetipo ? campos.arquetipo : null,
        camada: campos.camada ? campos.camada : null,
        peso_camada: campos.peso_camada?.trim() ? Number(campos.peso_camada) : null,
        ordem: Number(campos.ordem ?? 0) || 0,
      })
      .eq('id', opcaoId);
  }

  revalidatePath('/master/perguntas');
  revalidatePath('/mergulho');
}

// ── Arquétipos ──────────────────────────────────────────────────────────────
export async function guardaArquetipo(formData: FormData) {
  const supabase = await clienteMaster();

  await supabase
    .from('archetypes')
    .update({
      nome_sombra: texto(formData, 'nome_sombra'),
      nome_integrado: texto(formData, 'nome_integrado'),
      medo: texto(formData, 'medo'),
      caminho: texto(formData, 'caminho'),
      descricao: texto(formData, 'descricao'),
      toque_reconhece: texto(formData, 'toque_reconhece'),
      toque_agradece: texto(formData, 'toque_agradece'),
      toque_liberta: texto(formData, 'toque_liberta'),
      proximo_passo: texto(formData, 'proximo_passo'),
      ativo: formData.get('ativo') === 'on',
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', texto(formData, 'id'));

  revalidatePath('/master/arquetipos');
  revalidatePath('/mergulho');
}

// ── Corpo de conhecimento ───────────────────────────────────────────────────
export async function criaItemConhecimento(formData: FormData) {
  const supabase = await clienteMaster();

  await supabase.from('knowledge_items').insert({
    titulo: texto(formData, 'titulo'),
    corpo: texto(formData, 'corpo'),
    tema: opcional(formData, 'tema'),
    grau_fonte: texto(formData, 'grau_fonte') || 'modelo',
    estado: texto(formData, 'estado') || 'rascunho',
  });

  revalidatePath('/master/conhecimento');
}

export async function guardaItemConhecimento(formData: FormData) {
  const supabase = await clienteMaster();

  await supabase
    .from('knowledge_items')
    .update({
      titulo: texto(formData, 'titulo'),
      corpo: texto(formData, 'corpo'),
      tema: opcional(formData, 'tema'),
      grau_fonte: texto(formData, 'grau_fonte'),
      estado: texto(formData, 'estado'),
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', texto(formData, 'id'));

  revalidatePath('/master/conhecimento');
}

export async function apagaItemConhecimento(formData: FormData) {
  const supabase = await clienteMaster();
  await supabase.from('knowledge_items').delete().eq('id', texto(formData, 'id'));
  revalidatePath('/master/conhecimento');
}
