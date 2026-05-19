import { Platform } from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { Storage } from './storage';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

const GUIA_ENTITLEMENT = 'guia_premium';
const GUIA_PACKAGE_ID = 'guia_unico_499';

let configurado = false;

export function paymentsEnabled() {
  return Platform.OS === 'ios' ? !!IOS_KEY : !!ANDROID_KEY;
}

export async function configurar(userId?: string) {
  if (!paymentsEnabled() || configurado) return;
  const key = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;
  Purchases.configure({ apiKey: key, appUserID: userId });
  configurado = true;
}

export async function obterOferta(): Promise<PurchasesOffering | null> {
  if (!paymentsEnabled()) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function comprarGuia(): Promise<boolean> {
  if (!paymentsEnabled()) {
    // Modo dev — desbloqueio local sem cobrança real
    await Storage.setGuiaUnlocked(true);
    return true;
  }
  try {
    const oferta = await obterOferta();
    const pkg =
      oferta?.availablePackages.find((p) => p.identifier === GUIA_PACKAGE_ID) ??
      oferta?.availablePackages[0];
    if (!pkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const desbloqueado =
      customerInfo.entitlements.active[GUIA_ENTITLEMENT] !== undefined;
    if (desbloqueado) await Storage.setGuiaUnlocked(true);
    return desbloqueado;
  } catch {
    return false;
  }
}

export async function restaurarCompras(): Promise<boolean> {
  if (!paymentsEnabled()) return Storage.getGuiaUnlocked();
  try {
    const info = await Purchases.restorePurchases();
    const ok = info.entitlements.active[GUIA_ENTITLEMENT] !== undefined;
    if (ok) await Storage.setGuiaUnlocked(true);
    return ok;
  } catch {
    return false;
  }
}
