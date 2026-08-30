'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LeituraCompleta from '@/components/Leitura';
import type { Leitura } from '@/lib/motor/tipos';

/**
 * Leitura de uma sessão sem conta: fica só no browser, não é guardada.
 */
export default function ResultadoDemonstracao() {
  const [leitura, setLeitura] = useState<Leitura | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const guardada = sessionStorage.getItem('amago:leitura');
      if (guardada) setLeitura(JSON.parse(guardada) as Leitura);
    } catch {
      // sessionStorage indisponível — mostra-se o estado vazio.
    }
    setCarregado(true);
  }, []);

  if (!carregado) return null;

  if (!leitura) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-20 surge">
        <h1 className="display text-2xl mb-4">Não há nenhuma leitura aberta</h1>
        <p className="text-tinta-suave leading-relaxed mb-8">
          Esta página mostra a leitura do Mergulho que acabaste de fazer. Se recarregaste o
          separador ou vieste de outro sítio, é preciso mergulhar outra vez.
        </p>
        <Link
          href="/mergulho"
          className="inline-flex items-center rounded-full bg-tinta px-7 py-3.5 text-papel text-sm hover:bg-barro transition-colors"
        >
          Começar o Mergulho
        </Link>
      </div>
    );
  }

  return <LeituraCompleta leitura={leitura} guardado={false} />;
}
