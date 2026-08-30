export function Campo({
  rotulo,
  nome,
  valor,
  tipo = 'text',
  ajuda,
  className = '',
}: {
  rotulo: string;
  nome: string;
  valor?: string | number | null;
  tipo?: string;
  ajuda?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs uppercase tracking-[0.12em] text-tinta-tenue mb-1.5">
        {rotulo}
      </span>
      <input
        type={tipo}
        name={nome}
        defaultValue={valor ?? ''}
        step={tipo === 'number' ? 'any' : undefined}
        className="w-full rounded-lg border border-linha bg-white/70 px-3 py-2 text-sm outline-none focus:border-barro-suave"
      />
      {ajuda && <span className="block text-xs text-tinta-tenue mt-1">{ajuda}</span>}
    </label>
  );
}

export function Area({
  rotulo,
  nome,
  valor,
  linhas = 3,
  ajuda,
}: {
  rotulo: string;
  nome: string;
  valor?: string | null;
  linhas?: number;
  ajuda?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.12em] text-tinta-tenue mb-1.5">
        {rotulo}
      </span>
      <textarea
        name={nome}
        rows={linhas}
        defaultValue={valor ?? ''}
        className="w-full rounded-lg border border-linha bg-white/70 px-3 py-2 text-sm leading-relaxed outline-none focus:border-barro-suave resize-y"
      />
      {ajuda && <span className="block text-xs text-tinta-tenue mt-1">{ajuda}</span>}
    </label>
  );
}

export function Escolha({
  rotulo,
  nome,
  valor,
  opcoes,
  className = '',
}: {
  rotulo: string;
  nome: string;
  valor?: string | null;
  opcoes: { valor: string; rotulo: string }[];
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs uppercase tracking-[0.12em] text-tinta-tenue mb-1.5">
        {rotulo}
      </span>
      <select
        name={nome}
        defaultValue={valor ?? ''}
        className="w-full rounded-lg border border-linha bg-white/70 px-3 py-2 text-sm outline-none focus:border-barro-suave"
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Interruptor({
  rotulo,
  nome,
  ligado,
}: {
  rotulo: string;
  nome: string;
  ligado: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={nome} defaultChecked={ligado} className="accent-[#a05a3f]" />
      <span>{rotulo}</span>
    </label>
  );
}

export function BotaoGuardar({ children = 'Guardar' }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center rounded-full bg-tinta px-5 py-2.5 text-papel text-sm hover:bg-barro transition-colors"
    >
      {children}
    </button>
  );
}
