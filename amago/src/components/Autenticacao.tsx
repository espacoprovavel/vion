'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { criaClienteBrowser } from '@/lib/supabase/cliente';
import { SITE_URL } from '@/lib/supabase/config';

type Modo = 'entrar' | 'criar';

export default function Autenticacao() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>('entrar');
  const [email, setEmail] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function submete(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setOcupado(true);

    const supabase = criaClienteBrowser();
    if (!supabase) {
      setErro('A base de dados não está configurada.');
      setOcupado(false);
      return;
    }

    if (modo === 'criar') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: palavraPasse,
        options: { emailRedirectTo: `${SITE_URL}/historico` },
      });
      setOcupado(false);
      if (error) {
        setErro(traduzErro(error.message));
        return;
      }
      if (!data.session) {
        setAviso('Enviámos-te um email para confirmares a conta. Depois disso já podes entrar.');
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: palavraPasse,
      });
      setOcupado(false);
      if (error) {
        setErro(traduzErro(error.message));
        return;
      }
    }

    router.push('/historico');
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-20 surge">
      <h1 className="display text-3xl mb-3">
        {modo === 'entrar' ? 'Entrar' : 'Criar conta'}
      </h1>
      <p className="text-tinta-suave leading-relaxed mb-10">
        {modo === 'entrar'
          ? 'Para voltares aos teus mergulhos anteriores.'
          : 'Para que as tuas leituras fiquem guardadas e possas comparar o que muda.'}
      </p>

      <form onSubmit={submete} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-linha bg-white/60 px-4 py-3 outline-none focus:border-barro-suave"
          />
        </div>
        <div>
          <label htmlFor="pw" className="block text-sm mb-2">
            Palavra-passe
          </label>
          <input
            id="pw"
            type="password"
            required
            minLength={8}
            autoComplete={modo === 'criar' ? 'new-password' : 'current-password'}
            value={palavraPasse}
            onChange={(e) => setPalavraPasse(e.target.value)}
            className="w-full rounded-xl border border-linha bg-white/60 px-4 py-3 outline-none focus:border-barro-suave"
          />
          {modo === 'criar' && (
            <p className="text-xs text-tinta-tenue mt-2">Pelo menos 8 caracteres.</p>
          )}
        </div>

        {erro && <p className="text-sm text-barro">{erro}</p>}
        {aviso && <p className="text-sm text-musgo">{aviso}</p>}

        <button
          type="submit"
          disabled={ocupado}
          className="w-full rounded-full bg-tinta px-7 py-3.5 text-papel text-sm hover:bg-barro transition-colors disabled:opacity-40"
        >
          {ocupado ? 'Um momento…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-8 text-sm text-tinta-suave">
        {modo === 'entrar' ? 'Ainda não tens conta? ' : 'Já tens conta? '}
        <button
          type="button"
          onClick={() => {
            setModo(modo === 'entrar' ? 'criar' : 'entrar');
            setErro(null);
            setAviso(null);
          }}
          className="underline underline-offset-4 hover:text-barro"
        >
          {modo === 'entrar' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>

      <p className="mt-10 text-xs text-tinta-tenue leading-relaxed">
        Ao criares conta aceitas a{' '}
        <Link href="/privacidade" className="underline underline-offset-4">
          política de privacidade
        </Link>
        . O consentimento para guardar as respostas do Mergulho é pedido à parte, antes de
        começares.
      </p>
    </div>
  );
}

function traduzErro(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou palavra-passe não conferem.';
  if (m.includes('email not confirmed')) return 'Falta confirmares a conta no email que te enviámos.';
  if (m.includes('user already registered')) return 'Já existe uma conta com este email.';
  if (m.includes('password should be')) return 'A palavra-passe é demasiado curta.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Demasiadas tentativas. Espera um pouco e tenta outra vez.';
  return 'Não foi possível concluir. Tenta outra vez daqui a pouco.';
}
