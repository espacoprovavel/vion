/**
 * URL pública do site. Configurável via EXPO_PUBLIC_SITE_URL.
 * Fallback para o domínio real de produção.
 *
 * Quando vion.pt estiver pronto, define a env no Vercel — nada de
 * hardcoded no código precisa de mudar.
 */
export const SITE_URL =
  process.env.EXPO_PUBLIC_SITE_URL || 'https://vion-three.vercel.app';
