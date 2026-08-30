import Link from 'next/link';

export default function Inicio() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <section className="pt-20 pb-16 surge">
        <p className="text-sm uppercase tracking-[0.18em] text-tinta-tenue mb-6">
          O Mergulho Âmago
        </p>
        <h1 className="display text-4xl sm:text-5xl leading-[1.1] mb-7">
          Há um padrão teu que ainda não viste.
          <br />
          Não porque te falte lucidez — porque ele está por baixo dela.
        </h1>
        <p className="text-lg text-tinta-suave leading-relaxed max-w-xl">
          O Âmago faz-te perguntas que descem em três rondas. Cada ronda tira uma camada. No fim,
          levanta-se o Véu: aquilo que ainda não vês sobre ti e que te trava, mesmo quando tens
          tudo para avançar.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href="/mergulho"
            className="inline-flex items-center rounded-full bg-tinta px-7 py-3.5 text-papel text-sm tracking-wide hover:bg-barro transition-colors"
          >
            Começar o Mergulho
          </Link>
          <span className="text-sm text-tinta-tenue">12 perguntas · cerca de 6 minutos</span>
        </div>
      </section>

      <section className="border-t border-linha py-14">
        <h2 className="display text-2xl mb-8">Como se desce</h2>
        <ol className="space-y-7">
          {[
            {
              n: 'Primeira ronda',
              t: 'A superfície',
              d: 'O que fazes quando aquilo aperta. É a camada mais visível — e é por onde toda a gente começa.',
            },
            {
              n: 'Segunda ronda',
              t: 'A função e o corpo',
              d: 'Para que serve o padrão, do que te tem poupado, e onde é que ele mora quando dispara.',
            },
            {
              n: 'Terceira ronda',
              t: 'A raiz',
              d: 'O terreno em que isto cresceu e a parte de ti que dá as ordens. Aqui, o que não sabes responder também é resposta.',
            },
          ].map((p) => (
            <li key={p.n} className="grid sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-1">
              <span className="text-sm uppercase tracking-[0.14em] text-tinta-tenue pt-1">
                {p.n}
              </span>
              <div>
                <h3 className="display text-xl mb-1">{p.t}</h3>
                <p className="text-tinta-suave leading-relaxed">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-linha py-14">
        <h2 className="display text-2xl mb-5">O que recebes no fim</h2>
        <p className="text-tinta-suave leading-relaxed mb-6 max-w-xl">
          Uma leitura só. Não há separadores, não há métodos para escolher, não há jargão. O
          padrão que aparece é tratado como aquilo que é — uma solução antiga que te protegeu de
          alguma coisa e que talvez já possa descansar.
        </p>
        <ul className="space-y-3 text-tinta-suave">
          {[
            'O padrão de sombra que as tuas respostas desenham, e o medo que ele guarda.',
            'O Véu: a camada em que a luz ainda não bateu.',
            'O que dizes sobre ti vs. o que as respostas mostram — quando as duas coisas não batem certo.',
            'A forma integrada em que te tornas, e o caminho até lá.',
            'Um próximo passo pequeno, proposto com condição. Nunca uma ordem.',
          ].map((i) => (
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="text-barro-suave select-none pt-0.5">—</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-linha py-14">
        <h2 className="display text-2xl mb-5">Sobre o que isto é, e o que não é</h2>
        <p className="text-tinta-suave leading-relaxed max-w-xl mb-4">
          O Âmago funde psicologia cognitivo-comportamental, neurociência do hábito, análise da
          função do comportamento, padrões aprendidos na família, marcadores somáticos e a ideia de
          partes internas num único motor de leitura. Não há energias, níveis de consciência nem
          nada que se lhe pareça.
        </p>
        <p className="text-tinta-suave leading-relaxed max-w-xl">
          No fim de cada leitura fica uma linha discreta com as lentes usadas e o grau de cada uma
          — 🟢 ciência, 🟡 modelo. Para saberes de onde vem o que estás a ler.
        </p>
        <p className="mt-6 text-sm text-tinta-tenue max-w-xl">
          É uma ferramenta de autoconhecimento. Não faz diagnósticos, não fala de transtornos e não
          substitui acompanhamento psicológico.
        </p>
      </section>

      <div className="border-t border-linha py-14">
        <Link
          href="/mergulho"
          className="inline-flex items-center rounded-full bg-tinta px-7 py-3.5 text-papel text-sm tracking-wide hover:bg-barro transition-colors"
        >
          Começar o Mergulho
        </Link>
      </div>
    </div>
  );
}
