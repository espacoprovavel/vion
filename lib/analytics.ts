/**
 * Analytics VION — wrapper sobre PostHog.
 *
 * - Web: usa `posthog-js`.
 * - Mobile / sem chave: no-op silencioso (não rebenta o app, não
 *   bloqueia o fluxo).
 *
 * Chave lida de EXPO_PUBLIC_POSTHOG_KEY. Se vazia, tudo fica desligado.
 * Host opcional via EXPO_PUBLIC_POSTHOG_HOST (default eu.i.posthog.com).
 *
 * USO:
 *   import { track } from '@/lib/analytics';
 *   track('teste_completo', { hz, nivel });
 */
import { Platform } from 'react-native';
import posthog from 'posthog-js';

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

let pronto = false;

export function initAnalytics() {
  if (pronto) return;
  if (Platform.OS !== 'web') return; // mobile: no-op por agora
  if (!KEY) return; // sem chave: no-op
  if (typeof window === 'undefined') return;
  try {
    posthog.init(KEY, {
      api_host: HOST,
      autocapture: false, // só registamos os eventos que escolhemos
      capture_pageview: false,
      persistence: 'localStorage',
      disable_session_recording: true,
    });
    pronto = true;
  } catch {
    /* silencioso */
  }
}

export function track(evento: string, props?: Record<string, unknown>) {
  if (!pronto) return;
  try {
    posthog.capture(evento, props);
  } catch {
    /* silencioso */
  }
}

export function identify(userId: string, props?: Record<string, unknown>) {
  if (!pronto) return;
  try {
    posthog.identify(userId, props);
  } catch {
    /* silencioso */
  }
}

export function resetAnalytics() {
  if (!pronto) return;
  try {
    posthog.reset();
  } catch {
    /* silencioso */
  }
}

/** Catálogo de eventos que medimos (documentado para o funil principal). */
export const EVENTOS = {
  APP_ABERTO: 'app_aberto',
  ONBOARDING_COMPLETO: 'onboarding_completo',
  TESTE_INICIADO: 'teste_iniciado',
  TESTE_PERGUNTA_RESPONDIDA: 'teste_pergunta_respondida',
  TESTE_COMPLETO: 'teste_completo',
  RESULTADO_VISTO: 'resultado_visto',
  PARTILHA_CLICADA: 'partilha_clicada',
  GUIA_CTA_CLICADO: 'guia_cta_clicado',
  CHECKOUT_INICIADO: 'checkout_iniciado',
  COMPRA_COMPLETA: 'compra_completa',
} as const;
