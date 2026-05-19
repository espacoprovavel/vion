import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_NOME = 'vion:nome';
const KEY_HIST = 'vion:historico';
const KEY_UNLOCK = 'vion:guia-unlocked';
const KEY_ULTIMO = 'vion:ultimo-teste';

export type TestEntry = {
  hz: number;
  data: string; // ISO
  nivelHz: number;
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
  async clearAll() {
    await AsyncStorage.multiRemove([KEY_NOME, KEY_HIST, KEY_UNLOCK, KEY_ULTIMO]);
  },
};
