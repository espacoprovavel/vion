/**
 * Conteúdo editável (CMS leve).
 *
 * Cada texto tem uma `chave`, um valor por defeito (o que está hoje na app)
 * e pode ser substituído pela administradora. Os overrides ficam no Supabase
 * (tabela `conteudo`) e em cache local para funcionar offline.
 *
 * Os ecrãs leem via `useConteudo().t(chave)` — se não houver override,
 * cai no valor por defeito automaticamente.
 */
import { useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const CACHE_KEY = 'vion:conteudo';

export type CampoTexto = {
  chave: string;
  label: string;
  grupo: string;
  multiline?: boolean;
  default: string;
};

// Registo de todos os textos editáveis. Acrescentar aqui torna-os editáveis no painel.
export const TEXTOS: CampoTexto[] = [
  // ── Página inicial ──
  { chave: 'landing.tagline', grupo: 'Página inicial', label: 'Subtítulo do logo', default: 'VIBRACIONAL' },
  { chave: 'landing.titulo', grupo: 'Página inicial', label: 'Título grande', multiline: true, default: 'Em que frequência\nvibras?' },
  { chave: 'landing.subtitulo', grupo: 'Página inicial', label: 'Frase de apoio', multiline: true, default: '24 situações reais. Sem respostas certas.\nO teu padrão revela o teu nível de consciência.' },
  { chave: 'landing.footer', grupo: 'Página inicial', label: 'Rodapé', multiline: true, default: 'Baseado na Escala de David R. Hawkins · Para reflexão pessoal' },

  // ── Boas-vindas (onboarding) ──
  { chave: 'onboarding.s1.titulo', grupo: 'Boas-vindas', label: 'Slide 1 · título', multiline: true, default: 'Anos de trabalho.\nEm pouco tempo.' },
  { chave: 'onboarding.s1.desc', grupo: 'Boas-vindas', label: 'Slide 1 · texto', multiline: true, default: 'A VION condensa décadas de psicologia profunda, espiritualidade e neurociência num caminho prático. Sem rodeios.' },
  { chave: 'onboarding.s2.titulo', grupo: 'Boas-vindas', label: 'Slide 2 · título', multiline: true, default: '17 níveis de\nconsciência.' },
  { chave: 'onboarding.s2.desc', grupo: 'Boas-vindas', label: 'Slide 2 · texto', multiline: true, default: 'Baseado na escala de David R. Hawkins. Vais mapear exactamente onde estás — e o caminho concreto para o nível seguinte.' },
  { chave: 'onboarding.s3.titulo', grupo: 'Boas-vindas', label: 'Slide 3 · título', multiline: true, default: 'Não é um teste\nde personalidade.' },
  { chave: 'onboarding.s3.desc', grupo: 'Boas-vindas', label: 'Slide 3 · texto', multiline: true, default: 'É um espelho. Vais ver-te como és — não como te apresentas. Respira fundo. Sê honesta. O que descobrires é só para ti.' },

  // ── Antes do teste ──
  { chave: 'teste.intro.titulo', grupo: 'Antes do teste', label: 'Título', default: 'Antes de começar' },
  { chave: 'teste.intro.desc', grupo: 'Antes do teste', label: 'Instruções', multiline: true, default: 'Não há respostas certas. Escolhe a opção que mais se aproxima de como realmente reages — não como gostarias de reagir.\n\n24 situações. Cerca de 5 minutos.' },
];

const DEFAULTS: Record<string, string> = Object.fromEntries(
  TEXTOS.map((c) => [c.chave, c.default]),
);

// ── Loja reativa em memória ──
let store: Record<string, string> = {};
let carregado = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function tConteudo(chave: string): string {
  return store[chave] ?? DEFAULTS[chave] ?? '';
}

export async function carregarConteudo(): Promise<void> {
  try {
    const cache = await AsyncStorage.getItem(CACHE_KEY);
    if (cache) {
      store = JSON.parse(cache);
      carregado = true;
      emit();
    }
  } catch {}

  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('conteudo').select('chave, valor');
    if (error || !data) return;
    const next: Record<string, string> = {};
    for (const row of data) {
      // valor é jsonb; guardamos sempre uma string simples
      next[row.chave] = typeof row.valor === 'string' ? row.valor : String(row.valor ?? '');
    }
    store = next;
    carregado = true;
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(store));
    emit();
  } catch {}
}

export async function guardarConteudo(chave: string, valor: string): Promise<{ ok: boolean; erro?: string }> {
  store = { ...store, [chave]: valor };
  emit();
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(store)).catch(() => {});
  if (!supabase) return { ok: true };
  const { error } = await supabase
    .from('conteudo')
    .upsert({ chave, valor, actualizado_em: new Date().toISOString() });
  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}

export async function reporConteudo(chave: string): Promise<void> {
  const { [chave]: _, ...resto } = store;
  store = resto;
  emit();
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(store)).catch(() => {});
  if (supabase) await supabase.from('conteudo').delete().eq('chave', chave);
}

/** Hook: re-renderiza o ecrã quando o conteúdo é carregado/editado. */
export function useConteudo() {
  const [, bump] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    listeners.add(bump);
    if (!carregado) carregarConteudo();
    return () => {
      listeners.delete(bump);
    };
  }, []);
  return { t: tConteudo, carregado };
}
