'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_ATIVO, SUPABASE_URL } from './config';

export function criaClienteBrowser() {
  if (!SUPABASE_ATIVO) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
