import { supabase, supabaseEnabled } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export type AuthResult = {
  ok: boolean;
  erro?: string;
  user?: User | null;
};

const traduzErro = (msg: string): string => {
  if (/Invalid login credentials/i.test(msg)) return 'Email ou palavra-passe incorrectos.';
  if (/User already registered/i.test(msg)) return 'Já existe conta com este email.';
  if (/Email not confirmed/i.test(msg)) return 'Confirma o email antes de entrar.';
  if (/Password should be at least/i.test(msg))
    return 'A palavra-passe precisa de pelo menos 6 caracteres.';
  if (/rate limit/i.test(msg)) return 'Demasiadas tentativas. Espera um minuto.';
  return msg;
};

export const Auth = {
  enabled: supabaseEnabled,

  async sessao(): Promise<Session | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onSessionChange(cb: (s: Session | null) => void) {
    if (!supabase) return { unsubscribe() {} };
    const { data } = supabase.auth.onAuthStateChange((_e, s) => cb(s));
    return data.subscription;
  },

  async entrar(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { ok: false, erro: 'Auth não configurada.' };
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { ok: false, erro: traduzErro(error.message) };
    return { ok: true, user: data.user };
  },

  async criarConta(nome: string, email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { ok: false, erro: 'Auth não configurada.' };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { nome: nome.trim() } },
    });
    if (error) return { ok: false, erro: traduzErro(error.message) };
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
      });
    }
    return { ok: true, user: data.user };
  },

  async sair(): Promise<AuthResult> {
    if (!supabase) return { ok: true };
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, erro: error.message };
    return { ok: true };
  },

  async recuperar(email: string): Promise<AuthResult> {
    if (!supabase) return { ok: false, erro: 'Auth não configurada.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: 'vion://recuperar',
    });
    if (error) return { ok: false, erro: traduzErro(error.message) };
    return { ok: true };
  },

  async actualizarNome(nome: string): Promise<AuthResult> {
    if (!supabase) return { ok: false, erro: 'Auth não configurada.' };
    const { data, error } = await supabase.auth.updateUser({ data: { nome } });
    if (error) return { ok: false, erro: error.message };
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, nome });
    }
    return { ok: true, user: data.user };
  },
};
