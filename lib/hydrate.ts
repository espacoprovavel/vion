/**
 * Pull cloud data into AsyncStorage when a user signs in.
 * Runs once per session; merges cloud → local (cloud wins on conflict).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { Storage, type Libertacao, type TestEntry } from './storage';

const HYDRATED_KEY = 'vion:hydrated-uid';

export async function hidratarDoCloud(uid: string): Promise<void> {
  if (!supabase) return;
  const already = await AsyncStorage.getItem(HYDRATED_KEY);
  if (already === uid) return;

  try {
    const [testes, libs, proto, compras, profile] = await Promise.all([
      supabase.from('testes').select('*').eq('user_id', uid).order('criado_em', { ascending: true }),
      supabase
        .from('libertacoes')
        .select('*')
        .eq('user_id', uid)
        .order('criado_em', { ascending: true }),
      supabase.from('protocolo').select('*').eq('user_id', uid).maybeSingle(),
      supabase.from('compras').select('produto').eq('user_id', uid),
      supabase.from('profiles').select('nome').eq('id', uid).maybeSingle(),
    ]);

    if (profile.data?.nome) await Storage.setNome(profile.data.nome);

    if (testes.data?.length) {
      const merged: TestEntry[] = testes.data.map((t: any) => ({
        hz: t.hz,
        nivelHz: t.nivel_hz,
        data: t.criado_em,
      }));
      const localHist = await Storage.getHistorico();
      const ids = new Set(merged.map((m) => m.data));
      const extra = localHist.filter((h) => !ids.has(h.data));
      const all = [...merged, ...extra].sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
      );
      await AsyncStorage.setItem('vion:historico', JSON.stringify(all));
      if (all.length) {
        await AsyncStorage.setItem('vion:ultimo-teste', all[all.length - 1].data);
      }
    }

    if (libs.data?.length) {
      const merged: Libertacao[] = libs.data.map((l: any) => ({
        data: l.criado_em,
        alvo: l.alvo ?? '',
        intensidadeAntes: l.intensidade_antes ?? 0,
        intensidadeDepois: l.intensidade_depois ?? 0,
        sensacao: l.sensacao ?? '',
      }));
      const localLibs = await Storage.getLibertacoes();
      const ids = new Set(merged.map((m) => m.data));
      const extra = localLibs.filter((l) => !ids.has(l.data));
      const all = [...merged, ...extra];
      await AsyncStorage.setItem('vion:libertacoes', JSON.stringify(all));
    }

    if (proto.data) {
      await AsyncStorage.setItem('vion:protocolo-inicio', proto.data.inicio);
      await AsyncStorage.setItem(
        'vion:protocolo-dias',
        JSON.stringify(proto.data.dias_feitos ?? []),
      );
    }

    if (compras.data?.some((c: any) => c.produto === 'guia-elevacao')) {
      await Storage.setGuiaUnlocked(true);
    }

    await AsyncStorage.setItem(HYDRATED_KEY, uid);
  } catch (e: any) {
    console.warn('hidratarDoCloud failed:', e?.message ?? e);
  }
}

export async function limparHidratacao() {
  await AsyncStorage.removeItem(HYDRATED_KEY);
}
