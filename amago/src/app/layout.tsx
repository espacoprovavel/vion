import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { getUtilizador } from '@/lib/supabase/servidor';
import { SUPABASE_ATIVO } from '@/lib/supabase/config';

export const metadata: Metadata = {
  title: 'Âmago — o mergulho que levanta o véu',
  description:
    'Uma ferramenta de autoconhecimento. Camada a camada, o Âmago mostra-te o padrão que te afasta daquilo que queres — e a forma em que te tornas quando ele descansa.',
};

export const viewport: Viewport = {
  themeColor: '#faf7f2',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const utilizador = await getUtilizador();

  return (
    <html lang="pt-PT">
      <body className="min-h-dvh flex flex-col">
        <header className="border-b border-linha/70">
          <nav className="mx-auto w-full max-w-3xl px-6 py-5 flex items-center justify-between gap-4">
            <Link href="/" className="display text-lg tracking-tight">
              Âmago
            </Link>
            <div className="flex items-center gap-5 text-sm text-tinta-suave">
              {utilizador ? (
                <>
                  <Link href="/historico" className="hover:text-tinta transition-colors">
                    Histórico
                  </Link>
                  {utilizador.role === 'master' && (
                    <Link href="/master" className="hover:text-tinta transition-colors">
                      Master
                    </Link>
                  )}
                  <form action="/api/sair" method="post">
                    <button type="submit" className="hover:text-tinta transition-colors">
                      Sair
                    </button>
                  </form>
                </>
              ) : (
                SUPABASE_ATIVO && (
                  <Link href="/entrar" className="hover:text-tinta transition-colors">
                    Entrar
                  </Link>
                )
              )}
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-linha/70 mt-20">
          <div className="mx-auto w-full max-w-3xl px-6 py-8 text-xs text-tinta-tenue space-y-2">
            <p>
              O Âmago é uma ferramenta de autoconhecimento. Não é um instrumento clínico, não faz
              diagnósticos e não substitui acompanhamento psicológico ou médico.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/privacidade" className="underline underline-offset-4 hover:text-tinta-suave">
                Privacidade e dados
              </Link>
              <span>Se precisares de falar com alguém: SNS 24 — 808 24 24 24</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
