/**
 * POST /api/relatorio
 *
 * Body JSON: { hz: number, nome: string, email: string, respostas?: number[] }
 *
 * Fluxo:
 *   1. Valida input + chaves de ambiente
 *   2. Carrega âncoras da Michelle para este nível
 *   3. Pede ao Claude para expandir os 7 capítulos
 *   4. Gera PDF (React-PDF)
 *   5. Envia por email (Resend) com PDF em anexo
 *
 * Resposta:
 *   200 { ok: true }
 *   400 { ok: false, erro: "..."} — input inválido
 *   503 { ok: false, erro: "..."} — chaves ausentes / nível sem âncoras
 *   500 { ok: false, erro: "..."} — erro inesperado
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NIVEIS, getNivelMaisProximo } from '../constants/niveis';
import { getAncoras } from '../constants/ancoras';
import { gerarCapitulosClaude } from './_utils/claude';
import { gerarPdf } from './_utils/pdf';
import { enviarRelatorio } from './_utils/email';

type Body = {
  hz?: number;
  nome?: string;
  email?: string;
  respostas?: number[];
};

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, erro: 'Método não permitido.' });
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) as Body | null;
  if (!body) {
    return res.status(400).json({ ok: false, erro: 'Body JSON inválido.' });
  }

  const hz = Number(body.hz);
  const nome = (body.nome ?? '').toString().trim();
  const email = (body.email ?? '').toString().trim();
  const respostas = Array.isArray(body.respostas)
    ? body.respostas.map(Number).filter((n) => Number.isFinite(n))
    : undefined;

  if (!Number.isFinite(hz) || hz < 10 || hz > 1000) {
    return res.status(400).json({ ok: false, erro: 'Hz inválido.' });
  }
  if (!nome || nome.length > 80) {
    return res.status(400).json({ ok: false, erro: 'Nome inválido.' });
  }
  if (!EMAIL_RX.test(email)) {
    return res.status(400).json({ ok: false, erro: 'Email inválido.' });
  }

  if (!process.env.ANTHROPIC_API_KEY || !process.env.RESEND_API_KEY) {
    return res.status(503).json({
      ok: false,
      erro: 'Geração de relatório ainda não está configurada. Em breve.',
    });
  }

  const nivel = getNivelMaisProximo(hz);
  const ancoras = getAncoras(nivel.hz);

  if (!ancoras) {
    return res.status(503).json({
      ok: false,
      erro: `O nível "${nivel.nome}" ainda não tem conteúdo final. Por agora só está pronto Coragem (200 Hz) — em breve teremos todos.`,
    });
  }

  try {
    const capitulos = await gerarCapitulosClaude({
      ancoras,
      nivelNome: nivel.nome,
      hz: nivel.hz,
      nome,
      respostas,
    });

    const pdf = await gerarPdf({
      nome,
      hz: nivel.hz,
      nivelNome: nivel.nome,
      nivelEn: nivel.en,
      capitulos,
    });

    await enviarRelatorio({
      para: email,
      nome,
      hz: nivel.hz,
      nivel: nivel.nome,
      pdf,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ ok: false, erro: msg });
  }
}

function safeParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}

// Keep linter happy about unused import in production builds
void NIVEIS;
