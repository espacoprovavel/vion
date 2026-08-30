'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { TITULOS_RONDA } from '@/lib/motor/perguntas';
import {
  detetaSinaisDeSofrimento,
  EMERGENCIA,
  SNS24,
  TEXTO_REDE_DE_SEGURANCA,
} from '@/lib/motor/seguranca';
import type { Leitura, MapaRespostas, Pergunta, PortaDeEntrada } from '@/lib/motor/tipos';

type Etapa = 'consentimento' | 'entrada' | 'ronda' | 'a-enviar';

const PORTAS: { valor: PortaDeEntrada; titulo: string; descricao: string }[] = [
  {
    valor: 'duvida',
    titulo: 'Uma dúvida',
    descricao: 'Há uma pergunta que anda contigo e ainda não tem resposta.',
  },
  {
    valor: 'curiosidade',
    titulo: 'Uma curiosidade',
    descricao: 'Não te dói nada em particular. Queres ver o que aparece.',
  },
  {
    valor: 'dificuldade',
    titulo: 'Uma dificuldade',
    descricao: 'Há alguma coisa que te trava e que se repete há demasiado tempo.',
  },
];

export default function Mergulho({
  perguntas,
  autenticado,
}: {
  perguntas: Pergunta[];
  autenticado: boolean;
}) {
  const router = useRouter();
  const topo = useRef<HTMLDivElement>(null);

  const [etapa, setEtapa] = useState<Etapa>('consentimento');
  const [consentimentoDados, setConsentimentoDados] = useState(false);
  const [consentimentoNaoClinico, setConsentimentoNaoClinico] = useState(false);
  const [porta, setPorta] = useState<PortaDeEntrada | null>(null);
  const [descricao, setDescricao] = useState('');
  const [redeAvisada, setRedeAvisada] = useState(false);
  const [ronda, setRonda] = useState(1);
  const [respostas, setRespostas] = useState<MapaRespostas>({});
  const [erro, setErro] = useState<string | null>(null);

  const rondas = useMemo(
    () => Array.from(new Set(perguntas.map((p) => p.ronda))).sort((a, b) => a - b),
    [perguntas],
  );
  const perguntasDaRonda = useMemo(
    () => perguntas.filter((p) => p.ronda === ronda).sort((a, b) => a.ordem - b.ordem),
    [perguntas, ronda],
  );
  const rondaCompleta = perguntasDaRonda.every((p) => respostas[p.id]);
  const ultimaRonda = ronda === rondas[rondas.length - 1];

  function sobe() {
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function avancaDaEntrada() {
    if (!porta) return;
    if (!redeAvisada && detetaSinaisDeSofrimento(descricao)) {
      setRedeAvisada(true);
      sobe();
      return;
    }
    setEtapa('ronda');
    sobe();
  }

  async function submete() {
    setErro(null);
    setEtapa('a-enviar');
    try {
      const resposta = await fetch('/api/mergulho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          porta,
          descricao: descricao.trim() || undefined,
          respostas,
          consentimento: true,
        }),
      });
      const dados = (await resposta.json()) as {
        leitura?: Leitura;
        id?: string;
        guardado?: boolean;
        erro?: string;
      };

      if (!resposta.ok || !dados.leitura) {
        setErro(dados.erro ?? 'Não foi possível fechar o Mergulho. Tenta outra vez.');
        setEtapa('ronda');
        return;
      }

      if (dados.guardado && dados.id) {
        router.push(`/resultado/${dados.id}`);
        return;
      }

      sessionStorage.setItem('amago:leitura', JSON.stringify(dados.leitura));
      router.push('/resultado');
    } catch {
      setErro('Não foi possível ligar ao servidor. Tenta outra vez.');
      setEtapa('ronda');
    }
  }

  // ── Consentimento ────────────────────────────────────────────────────────
  if (etapa === 'consentimento') {
    const pronto = consentimentoDados && consentimentoNaoClinico;
    return (
      <Envelope ref={topo}>
        <Cabecalho
          sobre="Antes de começarmos"
          titulo="Duas coisas para ficarem claras"
          nota="Não é burocracia. É o mínimo para poderes entrar sem dúvidas."
        />

        <div className="space-y-4">
          <Caixa
            marcada={consentimentoDados}
            aoMudar={setConsentimentoDados}
            id="c-dados"
            texto={
              <>
                Consinto expressamente que as minhas respostas sejam guardadas e usadas para gerar
                e conservar a minha leitura. Compreendo que dizem respeito ao meu estado
                psicológico e que o RGPD as trata como categoria especial de dados (artigo 9.º).
                Li a{' '}
                <Link
                  href="/privacidade"
                  target="_blank"
                  className="underline underline-offset-4 hover:text-barro"
                >
                  política de privacidade
                </Link>{' '}
                e sei que posso retirar este consentimento a qualquer momento.
              </>
            }
          />
          <Caixa
            marcada={consentimentoNaoClinico}
            aoMudar={setConsentimentoNaoClinico}
            id="c-clinico"
            texto={
              <>
                Compreendo que o Âmago é uma ferramenta de autoconhecimento: não faz diagnósticos,
                não avalia risco e <strong className="font-medium">não substitui acompanhamento
                psicológico</strong> ou médico.
              </>
            }
          />
        </div>

        {!autenticado && (
          <p className="mt-6 text-sm text-tinta-tenue">
            Não tens sessão iniciada. Podes fazer o Mergulho na mesma — a leitura aparece no fim,
            mas não fica guardada.{' '}
            <Link href="/entrar" className="underline underline-offset-4 hover:text-barro">
              Entrar ou criar conta
            </Link>
            .
          </p>
        )}

        <Rodape>
          <Botao
            disabled={!pronto}
            onClick={() => {
              setEtapa('entrada');
              sobe();
            }}
          >
            Continuar
          </Botao>
        </Rodape>
      </Envelope>
    );
  }

  // ── Entrada ──────────────────────────────────────────────────────────────
  if (etapa === 'entrada') {
    return (
      <Envelope ref={topo}>
        <Cabecalho
          sobre="A entrada"
          titulo="O que é que trazes hoje?"
          nota="Escolhe a que estiver mais perto. Não tem de estar exata."
        />

        <div className="space-y-3">
          {PORTAS.map((p) => (
            <button
              key={p.valor}
              type="button"
              onClick={() => setPorta(p.valor)}
              aria-pressed={porta === p.valor}
              className={`w-full text-left rounded-xl border px-5 py-4 transition-colors ${
                porta === p.valor
                  ? 'border-barro bg-papel-2'
                  : 'border-linha hover:border-barro-suave'
              }`}
            >
              <span className="display text-lg block">{p.titulo}</span>
              <span className="text-sm text-tinta-suave">{p.descricao}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <label htmlFor="descricao" className="block text-sm mb-2">
            Se quiseres, diz em duas linhas o que é.{' '}
            <span className="text-tinta-tenue">Opcional — podes deixar em branco.</span>
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => {
              setDescricao(e.target.value);
              setRedeAvisada(false);
            }}
            rows={4}
            maxLength={2000}
            className="w-full rounded-xl border border-linha bg-white/60 px-4 py-3 leading-relaxed focus:border-barro-suave outline-none resize-y"
            placeholder="Por exemplo: sempre que aquilo começa a resultar, eu travo."
          />
        </div>

        {redeAvisada && <RedeDeSeguranca />}

        <Rodape>
          <Botao disabled={!porta} onClick={avancaDaEntrada}>
            {redeAvisada ? 'Continuar mesmo assim' : 'Começar a descer'}
          </Botao>
        </Rodape>
      </Envelope>
    );
  }

  // ── Rondas ───────────────────────────────────────────────────────────────
  const titulos = TITULOS_RONDA[ronda];
  const aEnviar = etapa === 'a-enviar';

  return (
    <Envelope ref={topo}>
      <Progresso ronda={ronda} total={rondas.length} />
      <Cabecalho sobre={titulos?.titulo ?? `Ronda ${ronda}`} titulo={titulos?.subtitulo ?? ''} />

      <div className="space-y-12">
        {perguntasDaRonda.map((pergunta, i) => (
          <fieldset key={pergunta.id} disabled={aEnviar}>
            <legend className="display text-xl leading-snug mb-1">
              <span className="text-tinta-tenue text-sm font-sans mr-2 align-middle">
                {String(i + 1).padStart(2, '0')}
              </span>
              {pergunta.texto}
            </legend>
            {pergunta.nota && (
              <p className="text-sm text-tinta-tenue mb-4 mt-1">{pergunta.nota}</p>
            )}
            <div className={`space-y-2 ${pergunta.nota ? '' : 'mt-4'}`}>
              {pergunta.opcoes.map((opcao) => {
                const escolhida = respostas[pergunta.id] === opcao.id;
                return (
                  <label
                    key={opcao.id}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      escolhida ? 'border-barro bg-papel-2' : 'border-linha hover:border-barro-suave'
                    }`}
                  >
                    <input
                      type="radio"
                      name={pergunta.id}
                      value={opcao.id}
                      checked={escolhida}
                      onChange={() =>
                        setRespostas((r) => ({ ...r, [pergunta.id]: opcao.id }))
                      }
                      className="mt-1.5 accent-[#a05a3f]"
                    />
                    <span className="leading-relaxed">{opcao.texto}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {erro && <p className="mt-8 text-sm text-barro">{erro}</p>}

      <Rodape>
        {ronda > 1 && !aEnviar && (
          <button
            type="button"
            onClick={() => {
              setRonda((r) => r - 1);
              sobe();
            }}
            className="text-sm text-tinta-suave hover:text-tinta transition-colors"
          >
            Voltar atrás
          </button>
        )}
        <Botao
          disabled={!rondaCompleta || aEnviar}
          onClick={() => {
            if (ultimaRonda) {
              void submete();
            } else {
              setRonda((r) => r + 1);
              sobe();
            }
          }}
        >
          {aEnviar ? 'A compor a leitura…' : ultimaRonda ? 'Levantar o Véu' : 'Descer mais uma camada'}
        </Botao>
      </Rodape>

      {!rondaCompleta && (
        <p className="mt-4 text-sm text-tinta-tenue">
          Falta responder a{' '}
          {perguntasDaRonda.filter((p) => !respostas[p.id]).length === 1
            ? 'uma pergunta'
            : `${perguntasDaRonda.filter((p) => !respostas[p.id]).length} perguntas`}{' '}
          desta ronda.
        </p>
      )}
    </Envelope>
  );
}

// ── Peças ──────────────────────────────────────────────────────────────────

function Envelope({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <div ref={ref} className="scroll-mt-8 surge">
        {children}
      </div>
    </div>
  );
}

function Cabecalho({
  sobre,
  titulo,
  nota,
}: {
  sobre: string;
  titulo: string;
  nota?: string;
}) {
  return (
    <header className="mb-10">
      <p className="text-sm uppercase tracking-[0.16em] text-tinta-tenue mb-3">{sobre}</p>
      {titulo && <h1 className="display text-2xl sm:text-3xl leading-snug">{titulo}</h1>}
      {nota && <p className="text-tinta-suave mt-3 leading-relaxed">{nota}</p>}
    </header>
  );
}

function Progresso({ ronda, total }: { ronda: number; total: number }) {
  return (
    <div
      className="flex gap-1.5 mb-8"
      role="progressbar"
      aria-valuenow={ronda}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Ronda ${ronda} de ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-0.5 flex-1 rounded-full transition-colors ${
            i < ronda ? 'bg-barro' : 'bg-linha'
          }`}
        />
      ))}
    </div>
  );
}

function Caixa({
  id,
  marcada,
  aoMudar,
  texto,
}: {
  id: string;
  marcada: boolean;
  aoMudar: (v: boolean) => void;
  texto: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 rounded-xl border px-5 py-4 cursor-pointer transition-colors ${
        marcada ? 'border-barro bg-papel-2' : 'border-linha hover:border-barro-suave'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={marcada}
        onChange={(e) => aoMudar(e.target.checked)}
        className="mt-1 accent-[#a05a3f]"
      />
      <span className="text-sm leading-relaxed text-tinta-suave">{texto}</span>
    </label>
  );
}

function Botao({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-full bg-tinta px-7 py-3.5 text-papel text-sm tracking-wide hover:bg-barro transition-colors disabled:opacity-30 disabled:hover:bg-tinta disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function Rodape({ children }: { children: React.ReactNode }) {
  return <div className="mt-12 flex items-center gap-6">{children}</div>;
}

export function RedeDeSeguranca() {
  return (
    <aside className="mt-8 rounded-xl border border-barro-suave bg-papel-2 px-6 py-5">
      <h2 className="display text-lg mb-2">{TEXTO_REDE_DE_SEGURANCA.titulo}</h2>
      <p className="text-tinta-suave leading-relaxed mb-3">{TEXTO_REDE_DE_SEGURANCA.corpo}</p>
      <p className="leading-relaxed mb-3">
        Se quiseres falar com alguém agora, o <strong className="font-medium">{SNS24.nome}</strong>{' '}
        atende no{' '}
        <a href={`tel:${SNS24.telefone.replace(/\s/g, '')}`} className="underline underline-offset-4">
          {SNS24.telefone}
        </a>{' '}
        — {SNS24.nota}. Em emergência, liga{' '}
        <a href={`tel:${EMERGENCIA.telefone}`} className="underline underline-offset-4">
          {EMERGENCIA.telefone}
        </a>
        .
      </p>
      <p className="text-sm text-tinta-tenue">{TEXTO_REDE_DE_SEGURANCA.continuar}</p>
    </aside>
  );
}
