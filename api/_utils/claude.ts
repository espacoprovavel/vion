/**
 * Wrapper Claude — gera os 7 capítulos do Relatório VION a partir das
 * âncoras da Michelle + nível Hawkins do utilizador + respostas opcionais.
 *
 * Usa Claude Haiku 4.5 (rápido, ~€0,01 por relatório).
 *
 * Saída: objeto com 7 capítulos prontos a entrar no template PDF.
 *
 * BUDGET: cada chamada usa ~4-6k tokens output → ~$0.008-0.012.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { AncorasNivel } from '../../constants/ancoras';

export type CapitulosClaude = {
  feridaCentral: string;
  domEscondido: string;
  corpo: string;
  mente: string;
  relacoes: string;
  todo: string;
  travessia: string;
};

const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `És a voz por trás do Relatório VION — um sistema vibracional baseado nos 17 níveis de consciência de David Hawkins (20Hz a 700Hz). Escreves em português europeu (PT-PT), com tom íntimo, claro e literário. Nada de jargão new-age vazio. Profundidade real, encarnada, não floreada.

REGRAS:
1. Escreve sempre em PT-PT (não PT-BR). "tu" e não "você".
2. Trata o leitor pelo nome quando for natural — não em todos os parágrafos.
3. Cada capítulo: 700 a 1100 palavras. Parágrafos curtos (3-5 linhas).
4. Voz: serena, firme, sem condescendência. Como quem fala a um igual a sério.
5. Não uses listas com bullets nem títulos a meio do capítulo — texto corrido.
6. Não menciones "Claude", "IA", "Hawkins" diretamente ao leitor.
7. Mantém a voz e ideias das âncoras dadas. NÃO as contradigas. Expande-as.
8. Se houver respostas concretas do utilizador, integra-as com naturalidade.

ESTRUTURA: devolve EXCLUSIVAMENTE um JSON válido com 7 chaves:
{
  "feridaCentral": "...",
  "domEscondido": "...",
  "corpo": "...",
  "mente": "...",
  "relacoes": "...",
  "todo": "...",
  "travessia": "..."
}
Cada valor é o texto completo do capítulo. Sem markdown.`;

export async function gerarCapitulosClaude(args: {
  ancoras: AncorasNivel;
  nivelNome: string;
  hz: number;
  nome: string;
  respostas?: number[];
}): Promise<CapitulosClaude> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY ausente.');
  }

  const client = new Anthropic({ apiKey });

  const respostasDesc = args.respostas?.length
    ? `\n\nO utilizador respondeu o teste com estes 24 valores Hz (1-12 são situações de comportamento, 13-24 são crenças internas): ${args.respostas.join(', ')}. Usa este detalhe SUBTILMENTE — repara em ondas baixas que se repetem, ou no contraste entre os dois blocos. Não cites números nem refiras "teste".`
    : '';

  const userPrompt = `O utilizador chama-se ${args.nome} e vibra a ${args.hz} Hz — nível "${args.nivelNome}".

ESTAS SÃO AS ÂNCORAS QUE TENS DE EXPANDIR. Cada capítulo deve ficar fiel à ideia da âncora, mas amplificá-la em texto profundo e bem escrito:

I — FERIDA CENTRAL:
${args.ancoras.feridaCentral}

II — DOM ESCONDIDO:
${args.ancoras.domEscondido}

III — PRÁTICA DO CORPO:
${args.ancoras.corpo}

IV — PRÁTICA DA MENTE:
${args.ancoras.mente}

V — PRÁTICA NAS RELAÇÕES:
${args.ancoras.relacoes}

VI — ENCONTRO COM O TODO:
${args.ancoras.todo}

VII — TRAVESSIA PARA O PRÓXIMO NÍVEL:
${args.ancoras.travessia}${respostasDesc}

Gera agora os 7 capítulos completos no formato JSON pedido. Responde APENAS com o JSON.`;

  const resposta = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const bloco = resposta.content.find((c) => c.type === 'text');
  if (!bloco || bloco.type !== 'text') {
    throw new Error('Claude devolveu resposta vazia.');
  }

  // Extrai JSON do texto (Claude pode envolver em ```json ... ```).
  const texto = bloco.text.trim();
  const inicio = texto.indexOf('{');
  const fim = texto.lastIndexOf('}');
  if (inicio === -1 || fim === -1) {
    throw new Error('Resposta do Claude não contém JSON válido.');
  }
  const json = texto.slice(inicio, fim + 1);

  let parsed: CapitulosClaude;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(`Falha a parsear JSON do Claude: ${(e as Error).message}`);
  }

  // Sanidade: garante que os 7 campos vieram preenchidos.
  for (const chave of ['feridaCentral', 'domEscondido', 'corpo', 'mente', 'relacoes', 'todo', 'travessia'] as const) {
    if (!parsed[chave] || parsed[chave].length < 100) {
      throw new Error(`Capítulo "${chave}" vazio ou demasiado curto.`);
    }
  }

  return parsed;
}
