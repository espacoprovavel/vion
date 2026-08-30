import { Area, BotaoGuardar, Campo, Escolha } from '@/components/master/Campos';
import { criaClienteServidor } from '@/lib/supabase/servidor';
import { apagaItemConhecimento, criaItemConhecimento, guardaItemConhecimento } from '../acoes';

const GRAUS = [
  { valor: 'ciencia', rotulo: '🟢 ciência' },
  { valor: 'modelo', rotulo: '🟡 modelo' },
];

const ESTADOS = [
  { valor: 'rascunho', rotulo: 'Rascunho' },
  { valor: 'publicado', rotulo: 'Publicado' },
  { valor: 'arquivado', rotulo: 'Arquivado' },
];

interface Item {
  id: string;
  titulo: string;
  corpo: string;
  tema: string | null;
  grau_fonte: string;
  estado: string;
  atualizado_em: string;
}

export default async function MasterConhecimento() {
  const supabase = await criaClienteServidor();
  const { data } = (await supabase!
    .from('knowledge_items')
    .select('*')
    .order('atualizado_em', { ascending: false })) as { data: Item[] | null };
  const itens = data ?? [];

  return (
    <div>
      <h1 className="display text-2xl mb-2">Corpo de conhecimento</h1>
      <p className="text-sm text-tinta-suave mb-10 max-w-2xl leading-relaxed">
        Um só conjunto. O tema é uma etiqueta opcional para te orientares — não cria secções nem
        separadores para quem usa a app. Cada item leva um grau de fonte, que é o que sustenta a
        linha das lentes no fim da leitura.
      </p>

      <form
        action={criaItemConhecimento}
        className="rounded-2xl border border-linha px-5 py-5 sm:px-6 sm:py-6 space-y-4 mb-12"
      >
        <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue">Novo item</p>
        <Campo rotulo="Título" nome="titulo" />
        <Area rotulo="Corpo" nome="corpo" linhas={5} />
        <div className="grid sm:grid-cols-3 gap-3">
          <Campo rotulo="Tema" nome="tema" ajuda="Opcional." />
          <Escolha rotulo="Grau da fonte" nome="grau_fonte" valor="modelo" opcoes={GRAUS} />
          <Escolha rotulo="Estado" nome="estado" valor="rascunho" opcoes={ESTADOS} />
        </div>
        <BotaoGuardar>Adicionar</BotaoGuardar>
      </form>

      <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue mb-4">
        {itens.length} {itens.length === 1 ? 'item' : 'itens'}
      </p>

      <div className="space-y-8">
        {itens.map((item) => (
          <div key={item.id} className="rounded-2xl border border-linha px-5 py-5 sm:px-6 sm:py-6">
            <form action={guardaItemConhecimento} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <Campo rotulo="Título" nome="titulo" valor={item.titulo} />
              <Area rotulo="Corpo" nome="corpo" valor={item.corpo} linhas={5} />
              <div className="grid sm:grid-cols-3 gap-3">
                <Campo rotulo="Tema" nome="tema" valor={item.tema} />
                <Escolha rotulo="Grau da fonte" nome="grau_fonte" valor={item.grau_fonte} opcoes={GRAUS} />
                <Escolha rotulo="Estado" nome="estado" valor={item.estado} opcoes={ESTADOS} />
              </div>
              <BotaoGuardar />
            </form>
            <form action={apagaItemConhecimento} className="mt-3">
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="text-xs text-tinta-tenue hover:text-barro transition-colors"
              >
                Apagar item
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
