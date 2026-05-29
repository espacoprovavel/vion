import { Storage } from './storage';
import { Sync } from './sync';
import { track, EVENTOS } from './analytics';

// V1: pagamentos locais (modo dev). Stripe Checkout web ligará no Sprint 3
// (quando houver chaves). Em mobile, RevenueCat fica para a distribuição
// via App Store / Play Store.

export function paymentsEnabled() {
  return false;
}

export async function configurar(_userId?: string) {
  // no-op
}

export async function comprarGuia(): Promise<boolean> {
  track(EVENTOS.CHECKOUT_INICIADO, { produto: 'guia-elevacao', preco_cents: 499 });
  await Sync.unlockGuia();
  track(EVENTOS.COMPRA_COMPLETA, { produto: 'guia-elevacao', valor_cents: 499 });
  return true;
}

export async function restaurarCompras(): Promise<boolean> {
  return Storage.getGuiaUnlocked();
}
