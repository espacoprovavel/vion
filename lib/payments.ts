import { Platform } from 'react-native';
import { Storage } from './storage';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

const GUIA_ENTITLEMENT = 'guia_premium';
const GUIA_PACKAGE_ID = 'guia_unico_499';

let configurado = false;

// react-native-purchases é só mobile — carregamos lazy e tratamos web
function getPurchases(): any | null {
  if (Platform.OS === 'web') return null;
  try {
    return require('react-native-purchases').default;
  } catch {
    return null;
  }
}

export function paymentsEnabled() {
  if (Platform.OS === 'web') return false;
  return Platform.OS === 'ios' ? !!IOS_KEY : !!ANDROID_KEY;
}

export async function configurar(userId?: string) {
  if (!paymentsEnabled() || configurado) return;
  const Purchases = getPurchases();
  if (!Purchases) return;
  const key = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;
  Purchases.configure({ apiKey: key, appUserID: userId });
  configurado = true;
}

export async function obterOferta(): Promise<any | null> {
  if (!paymentsEnabled()) return null;
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function comprarGuia(): Promise<boolean> {
  if (!paymentsEnabled()) {
    await Storage.setGuiaUnlocked(true);
    return true;
  }
  const Purchases = getPurchases();
  if (!Purchases) {
    await Storage.setGuiaUnlocked(true);
    return true;
  }
  try {
    const oferta = await obterOferta();
    const pkg =
      oferta?.availablePackages.find((p: any) => p.identifier === GUIA_PACKAGE_ID) ??
      oferta?.availablePackages[0];
    if (!pkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const desbloqueado = customerInfo.entitlements.active[GUIA_ENTITLEMENT] !== undefined;
    if (desbloqueado) await Storage.setGuiaUnlocked(true);
    return desbloqueado;
  } catch {
    return false;
  }
}

export async function restaurarCompras(): Promise<boolean> {
  if (!paymentsEnabled()) return Storage.getGuiaUnlocked();
  const Purchases = getPurchases();
  if (!Purchases) return Storage.getGuiaUnlocked();
  try {
    const info = await Purchases.restorePurchases();
    const ok = info.entitlements.active[GUIA_ENTITLEMENT] !== undefined;
    if (ok) await Storage.setGuiaUnlocked(true);
    return ok;
  } catch {
    return false;
  }
}
