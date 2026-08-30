import { NextResponse } from 'next/server';
import { criaClienteServidor } from '@/lib/supabase/servidor';

export async function POST(request: Request) {
  const supabase = await criaClienteServidor();
  if (supabase) await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
