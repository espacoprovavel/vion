import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SUPABASE_ATIVO } from '@/lib/supabase/config';
import { exigeMaster } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

const SECCOES = [
  { href: '/master', rotulo: 'Painel' },
  { href: '/master/perguntas', rotulo: 'Perguntas' },
  { href: '/master/arquetipos', rotulo: 'Arquétipos' },
  { href: '/master/conhecimento', rotulo: 'Conhecimento' },
];

export default async function MasterLayout({ children }: { children: React.ReactNode }) {
  if (!SUPABASE_ATIVO) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-20">
        <h1 className="display text-2xl mb-4">Área Master indisponível</h1>
        <p className="text-tinta-suave leading-relaxed">
          A área Master precisa de base de dados. Esta instalação está em modo de demonstração.
        </p>
      </div>
    );
  }

  const master = await exigeMaster();
  if (!master) redirect('/entrar');

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-2">Área Master</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm border-b border-linha pb-4">
          {SECCOES.map((s) => (
            <Link key={s.href} href={s.href} className="text-tinta-suave hover:text-tinta transition-colors">
              {s.rotulo}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
