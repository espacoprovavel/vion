import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// HYDRATED_KEY vive aqui (em vez de em hydrate.ts) para o clearAll poder
// limpar a marca de hidratação sem criar um ciclo storage ↔ hydrate.
const KEY_HYDRATED = 'vion:hydrated-uid';

const KEY_NOME = 'vion:nome';
const KEY_HIST = 'vion:historico';
const KEY_UNLOCK = 'vion:guia-unlocked';
const KEY_ULTIMO = 'vion:ultimo-teste';
const KEY_PROTO_INICIO = 'vion:protocolo-inicio';
const KEY_PROTO_DIAS = 'vion:protocolo-dias';
const KEY_LIBERTACOES = 'vion:libertacoes';
const KEY_OCULTOS = 'vion:ocultos';
const KEY_ONBOARDING = 'vion:onboarding-feito';
const KEY_SONHOS = 'vion:sonhos';

export type TestEntry = {
  hz: number;
  data: string; // ISO
  nivelHz: number;
};

export type Libertacao = {
  data: string;
  alvo: string;
  intensidadeAntes: number;
  intensidadeDepois: number;
  sensacao: string;
};

export type Sonho = {
  id: string;
  data: string; // ISO
  texto: string;
  humor: string; // emoção ao acordar
  simbolos: string[]; // ids dos símbolos detetados
};

export const Storage = {
  async setNome(nome: string) {
    await AsyncStorage.setItem(KEY_NOME, nome);
  },
  async getNome(): Promise<string | null> {
    return AsyncStorage.getItem(KEY_NOME);
  },
  async pushHistorico(entry: TestEntry) {
    const raw = await AsyncStorage.getItem(KEY_HIST);
    const arr: TestEntry[] = raw ? JSON.parse(raw) : [];
    arr.push(entry);
    await AsyncStorage.setItem(KEY_HIST, JSON.stringify(arr));
    await AsyncStorage.setItem(KEY_ULTIMO, entry.data);
  },
  async getHistorico(): Promise<TestEntry[]> {
    const raw = await AsyncStorage.getItem(KEY_HIST);
    return raw ? JSON.parse(raw) : [];
  },
  async getUltimoTeste(): Promise<string | null> {
    return AsyncStorage.getItem(KEY_ULTIMO);
  },
  async podeFazerTeste(): Promise<boolean> {
    const ultimo = await AsyncStorage.getItem(KEY_ULTIMO);
    if (!ultimo) return true;
    const dias = (Date.now() - new Date(ultimo).getTime()) / (1000 * 60 * 60 * 24);
    return dias >= 7;
  },
  async setGuiaUnlocked(v: boolean) {
    await AsyncStorage.setItem(KEY_UNLOCK, v ? '1' : '0');
  },
  async getGuiaUnlocked(): Promise<boolean> {
    const v = await AsyncStorage.getItem(KEY_UNLOCK);
    return v === '1';
  },
  async iniciarProtocolo() {
    await AsyncStorage.setItem(KEY_PROTO_INICIO, new Date().toISOString());
    await AsyncStorage.setItem(KEY_PROTO_DIAS, JSON.stringify([]));
  },
  async getProtocoloInicio(): Promise<string | null> {
    return AsyncStorage.getItem(KEY_PROTO_INICIO);
  },
  async marcarDia(dia: number) {
    const raw = await AsyncStorage.getItem(KEY_PROTO_DIAS);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    if (!arr.includes(dia)) arr.push(dia);
    await AsyncStorage.setItem(KEY_PROTO_DIAS, JSON.stringify(arr));
  },
  async getDiasFeitos(): Promise<number[]> {
    const raw = await AsyncStorage.getItem(KEY_PROTO_DIAS);
    return raw ? JSON.parse(raw) : [];
  },
  async resetProtocolo() {
    await AsyncStorage.multiRemove([KEY_PROTO_INICIO, KEY_PROTO_DIAS]);
  },
  async pushLibertacao(l: Libertacao) {
    const raw = await AsyncStorage.getItem(KEY_LIBERTACOES);
    const arr: Libertacao[] = raw ? JSON.parse(raw) : [];
    arr.push(l);
    await AsyncStorage.setItem(KEY_LIBERTACOES, JSON.stringify(arr));
  },
  async getLibertacoes(): Promise<Libertacao[]> {
    const raw = await AsyncStorage.getItem(KEY_LIBERTACOES);
    return raw ? JSON.parse(raw) : [];
  },
  async toggleOculto(id: string) {
    const raw = await AsyncStorage.getItem(KEY_OCULTOS);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(id);
    await AsyncStorage.setItem(KEY_OCULTOS, JSON.stringify(arr));
    return arr;
  },
  async getOcultos(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(KEY_OCULTOS);
    return raw ? JSON.parse(raw) : [];
  },
  async getOnboardingFeito(): Promise<boolean> {
    const v = await AsyncStorage.getItem(KEY_ONBOARDING);
    return v === '1';
  },
  async setOnboardingFeito() {
    await AsyncStorage.setItem(KEY_ONBOARDING, '1');
  },
  async pushSonho(s: Sonho) {
    const raw = await AsyncStorage.getItem(KEY_SONHOS);
    const arr: Sonho[] = raw ? JSON.parse(raw) : [];
    arr.unshift(s);
    await AsyncStorage.setItem(KEY_SONHOS, JSON.stringify(arr));
  },
  async getSonhos(): Promise<Sonho[]> {
    const raw = await AsyncStorage.getItem(KEY_SONHOS);
    return raw ? JSON.parse(raw) : [];
  },
  async removerSonho(id: string) {
    const raw = await AsyncStorage.getItem(KEY_SONHOS);
    const arr: Sonho[] = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(KEY_SONHOS, JSON.stringify(arr.filter((s) => s.id !== id)));
  },
  async clearAll() {
    await AsyncStorage.multiRemove([
      KEY_NOME,
      KEY_HIST,
      KEY_UNLOCK,
      KEY_ULTIMO,
      KEY_PROTO_INICIO,
      KEY_PROTO_DIAS,
      KEY_LIBERTACOES,
      KEY_OCULTOS,
      KEY_SONHOS,
      KEY_HYDRATED,
    ]);
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
  },
};
