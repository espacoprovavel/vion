/**
 * Cloud sync wrappers: write to local Storage AND Supabase (when authenticated).
 *
 * Anonymous users continue to work fully — data stays local.
 * Authenticated users get cross-device persistence.
 */
import { Storage, type Libertacao, type TestEntry } from './storage';
import { supabase } from './supabase';

async function userId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const Sync = {
  async pushTeste(entry: TestEntry, respostas: number[]) {
    await Storage.pushHistorico(entry);
    const uid = await userId();
    if (!uid || !supabase) return;
    await supabase
      .from('testes')
      .insert({
        user_id: uid,
        hz: entry.hz,
        nivel_hz: entry.nivelHz,
        respostas,
        criado_em: entry.data,
      })
      .then(({ error }) => {
        if (error) console.warn('sync.pushTeste:', error.message);
      });
  },

  async pushLibertacao(l: Libertacao) {
    await Storage.pushLibertacao(l);
    const uid = await userId();
    if (!uid || !supabase) return;
    await supabase
      .from('libertacoes')
      .insert({
        user_id: uid,
        alvo: l.alvo,
        intensidade_antes: l.intensidadeAntes,
        intensidade_depois: l.intensidadeDepois,
        sensacao: l.sensacao,
        criado_em: l.data,
      })
      .then(({ error }) => {
        if (error) console.warn('sync.pushLibertacao:', error.message);
      });
  },

  async iniciarProtocolo() {
    await Storage.iniciarProtocolo();
    const inicio = await Storage.getProtocoloInicio();
    const uid = await userId();
    if (!uid || !supabase || !inicio) return;
    await supabase
      .from('protocolo')
      .upsert({ user_id: uid, inicio, dias_feitos: [], actualizado_em: new Date().toISOString() })
      .then(({ error }) => {
        if (error) console.warn('sync.iniciarProtocolo:', error.message);
      });
  },

  async marcarDia(dia: number) {
    await Storage.marcarDia(dia);
    const dias = await Storage.getDiasFeitos();
    const inicio = await Storage.getProtocoloInicio();
    const uid = await userId();
    if (!uid || !supabase || !inicio) return;
    await supabase
      .from('protocolo')
      .upsert({
        user_id: uid,
        inicio,
        dias_feitos: dias,
        actualizado_em: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.warn('sync.marcarDia:', error.message);
      });
  },

  async resetProtocolo() {
    await Storage.resetProtocolo();
    const uid = await userId();
    if (!uid || !supabase) return;
    await supabase
      .from('protocolo')
      .delete()
      .eq('user_id', uid)
      .then(({ error }) => {
        if (error) console.warn('sync.resetProtocolo:', error.message);
      });
  },

  async unlockGuia() {
    await Storage.setGuiaUnlocked(true);
    const uid = await userId();
    if (!uid || !supabase) return;
    await supabase
      .from('compras')
      .insert({
        user_id: uid,
        produto: 'guia-elevacao',
        valor_cents: 499,
        fonte: 'web',
      })
      .then(({ error }) => {
        if (error) console.warn('sync.unlockGuia:', error.message);
      });
  },
};
