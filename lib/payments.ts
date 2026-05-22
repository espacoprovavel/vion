import { Storage } from './storage';
import { Sync } from './sync';

// V1: pagamentos locais (modo dev). RevenueCat/Stripe ligam-se mais tarde
// quando a app for distribuída via App Store / Play Store / Stripe Checkout web.

export function paymentsEnabled() {
  return false;
}

export async function configurar(_userId?: string) {
  // no-op
}

export async function comprarGuia(): Promise<boolean> {
  await Sync.unlockGuia();
  return true;
}

export async function restaurarCompras(): Promise<boolean> {
  return Storage.getGuiaUnlocked();
}
