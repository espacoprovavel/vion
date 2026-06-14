/**
 * Wrapper Resend — envia o Relatório VION em PDF por email.
 *
 * Configuração via env (server-side, NUNCA EXPO_PUBLIC_):
 *   RESEND_API_KEY     — chave Resend (re_...)
 *   RESEND_FROM        — remetente (ex: "VION <relatorio@vion.pt>"); para
 *                        testes podes usar "VION <onboarding@resend.dev>"
 *                        e enviar apenas para o teu próprio email.
 */
import { Resend } from 'resend';

const ASSUNTO = 'O teu Relatório VION';

const corpoHtml = (nome: string, hz: number, nivel: string) => `
<!doctype html>
<html lang="pt-PT">
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8F7FC; padding:32px; color:#1B1830;">
  <div style="max-width:520px; margin:0 auto; background:#FFFFFF; border:1px solid #E7E5F1; border-radius:14px; padding:36px;">
    <div style="font-family: monospace; font-size:11px; letter-spacing:3px; color:#8A879E; margin-bottom:12px;">VION VIBRACIONAL</div>
    <h1 style="font-family: Georgia, serif; font-size:28px; margin:0 0 14px;">${nome}, o teu relatório chegou.</h1>
    <p style="font-size:15px; line-height:1.6; margin:0 0 18px; color:#1B1830;">
      Vibras a <strong>${hz} Hz</strong> — nível <em>${nivel}</em>.
    </p>
    <p style="font-size:14px; line-height:1.6; color:#1B1830;">
      O PDF segue em anexo. São sete capítulos para ler com calma — não te apresses. Cada um abre uma porta. Fica nela o tempo que pedir.
    </p>
    <p style="font-size:14px; line-height:1.6; color:#1B1830; margin-top:18px;">
      Não é diagnóstico clínico nem substitui acompanhamento. Se atravessas um momento difícil, procura um profissional — o trabalho com alguém ao teu lado é o caminho mais seguro e mais profundo.
    </p>
    <div style="border-top:1px solid #E7E5F1; margin-top:24px; padding-top:18px; font-size:12px; color:#8A879E;">
      Com cuidado,<br/>VION
    </div>
  </div>
</body>
</html>`;

export async function enviarRelatorio(args: {
  para: string;
  nome: string;
  hz: number;
  nivel: string;
  pdf: Buffer;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? 'VION <onboarding@resend.dev>';
  if (!apiKey) {
    throw new Error('RESEND_API_KEY ausente.');
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: args.para,
    subject: ASSUNTO,
    html: corpoHtml(args.nome, args.hz, args.nivel),
    attachments: [
      {
        filename: `VION_${args.hz}Hz_${args.nivel}.pdf`,
        content: args.pdf,
      },
    ],
  });

  if (error) {
    throw new Error(`Falha a enviar email: ${error.message}`);
  }
}
