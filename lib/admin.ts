// Quem pode abrir o painel de administração.
// Para acrescentar outra administradora, junta o email (minúsculas) à lista.
export const ADMIN_EMAILS = ['michellerodriguesudi@gmail.com'];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
