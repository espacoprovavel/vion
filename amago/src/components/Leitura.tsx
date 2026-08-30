import Link from 'next/link';
import type { Leitura } from '@/lib/motor/tipos';

/**
 * UMA leitura fundida, no tom do Toque: reconhecer, agradecer, libertar.
 * Sem separadores, sem métodos à vista, sem jargão. A app nunca acusa.
 */
export default function LeituraCompleta({
  leitura,
  guardado,
  data,
}: {
  leitura: Leitura;
  guardado: boolean;
  data?: string;
}) {
  const a = leitura.arquetipoSombra;

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-14 surge">
      <header className="mb-12">
        <p className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">
          A tua leitura{data ? ` · ${data}` : ''}
        </p>
        <p className="text-lg text-tinta-suave leading-relaxed">{leitura.texto.abertura}</p>
      </header>

      {/* Reconhecer — o padrão aparece com nome, nunca como acusação. */}
      <section className="mb-12">
        <h1 className="display text-3xl sm:text-4xl leading-tight mb-5">{a.nomeSombra}</h1>
        <p className="text-lg leading-relaxed">{leitura.texto.reconhece}</p>
      </section>

      {/* Agradecer — a função e o medo que ela guardou. */}
      <section className="mb-12 border-l-2 border-barro-suave pl-6">
        <h2 className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">
          Do que te protegeu
        </h2>
        <p className="text-lg leading-relaxed">{leitura.texto.agradece}</p>
      </section>

      {/* O Véu. */}
      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">O Véu</h2>
        <p className="text-lg leading-relaxed">{leitura.texto.veu}</p>
      </section>

      {/* O fosso: o que dizes vs. o que mostras. */}
      {leitura.texto.fosso && (
        <section className="mb-12 rounded-2xl bg-papel-2 px-6 py-6 sm:px-7 sm:py-7">
          <h2 className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">
            O que dizes · o que mostras
          </h2>
          <p className="text-lg leading-relaxed">{leitura.texto.fosso}</p>
        </section>
      )}

      {/* Libertar + a ponte para a forma integrada. */}
      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">
          Quem te tornas
        </h2>
        <p className="text-lg leading-relaxed mb-5">{leitura.texto.liberta}</p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
          <span className="display text-2xl text-tinta-tenue line-through decoration-1 decoration-barro-suave">
            {a.nomeSombra}
          </span>
          <span className="text-barro-suave select-none">→</span>
          <span className="display text-2xl">{a.nomeIntegrado}</span>
        </div>
        <p className="text-lg leading-relaxed">{leitura.texto.ponte}</p>
      </section>

      {/* Próximo passo — proposta com condição, nunca uma ordem. */}
      <section className="mb-12 border-t border-linha pt-10">
        <h2 className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">
          Uma proposta, se quiseres
        </h2>
        <p className="text-lg leading-relaxed">{leitura.proximoPasso}</p>
        <p className="mt-4 text-sm text-tinta-tenue">
          Não é um exercício para cumprir. É uma experiência para observar — e podes não a fazer.
        </p>
      </section>

      <footer className="border-t border-linha pt-8 space-y-6">
        <div className="text-xs text-tinta-tenue leading-relaxed">
          <p>As lentes desta leitura: {leitura.lentesUsadas}.</p>
          <p className="mt-1">
            <span className="whitespace-nowrap">🟢 ciência</span> ·{' '}
            <span className="whitespace-nowrap">🟡 modelo</span>
          </p>
        </div>

        {!guardado && (
          <p className="text-sm text-tinta-suave">
            Esta leitura não ficou guardada.{' '}
            <Link href="/entrar" className="underline underline-offset-4 hover:text-barro">
              Cria conta ou entra
            </Link>{' '}
            para conservares o teu histórico.
          </p>
        )}

        <div className="flex flex-wrap gap-5 items-center">
          <Link
            href="/mergulho"
            className="inline-flex items-center rounded-full border border-linha px-6 py-3 text-sm hover:border-barro transition-colors"
          >
            Mergulhar outra vez
          </Link>
          {guardado && (
            <Link href="/historico" className="text-sm text-tinta-suave hover:text-tinta">
              Ver histórico
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
