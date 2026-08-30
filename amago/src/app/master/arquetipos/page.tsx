import { Area, BotaoGuardar, Campo, Interruptor } from '@/components/master/Campos';
import { criaClienteServidor } from '@/lib/supabase/servidor';
import { guardaArquetipo } from '../acoes';

interface LinhaArquetipo {
  id: string;
  codigo: string;
  nome_sombra: string;
  nome_integrado: string;
  medo: string;
  caminho: string;
  descricao: string;
  toque_reconhece: string;
  toque_agradece: string;
  toque_liberta: string;
  proximo_passo: string;
  ativo: boolean;
}

export default async function MasterArquetipos() {
  const supabase = await criaClienteServidor();
  const { data } = (await supabase!.from('archetypes').select('*').order('ordem')) as {
    data: LinhaArquetipo[] | null;
  };
  const arquetipos = data ?? [];

  return (
    <div>
      <h1 className="display text-2xl mb-2">Arquétipos</h1>
      <p className="text-sm text-tinta-suave mb-3 max-w-2xl leading-relaxed">
        Cada padrão é uma sombra com uma forma integrada. A leitura mostra sempre os dois e a ponte
        entre eles.
      </p>
      <p className="text-sm text-tinta-tenue mb-10 max-w-2xl leading-relaxed">
        O Toque tem três tempos e a ordem importa: reconhecer que apareceu por uma boa razão,
        agradecer o que protegeu, libertar. Nunca acusar. A frase do medo entra na leitura a seguir
        a &laquo;protegeu-te&raquo;, por isso escreve-a a continuar a frase — por exemplo,
        &laquo;de errar&raquo;.
      </p>

      {arquetipos.length === 0 && (
        <p className="rounded-xl border border-linha px-5 py-4 text-sm text-tinta-suave">
          Não há arquétipos na base de dados. Corre <code>supabase/seed.sql</code>.
        </p>
      )}

      <div className="space-y-10">
        {arquetipos.map((a) => (
          <form
            key={a.id}
            action={guardaArquetipo}
            className="rounded-2xl border border-linha px-5 py-5 sm:px-6 sm:py-6 space-y-4"
          >
            <input type="hidden" name="id" value={a.id} />

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.12em] text-tinta-tenue">
                {a.codigo}
              </span>
              <Interruptor rotulo="Ativo" nome="ativo" ligado={a.ativo} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Campo rotulo="Nome da sombra" nome="nome_sombra" valor={a.nome_sombra} />
              <Campo rotulo="Forma integrada" nome="nome_integrado" valor={a.nome_integrado} />
            </div>

            <Campo
              rotulo="Medo"
              nome="medo"
              valor={a.medo}
              ajuda="Continua a frase «protegeu-te…»."
            />
            <Campo
              rotulo="Caminho"
              nome="caminho"
              valor={a.caminho}
              ajuda="Continua a frase «há um caminho, e é este:…»."
            />
            <Area rotulo="Descrição do padrão" nome="descricao" valor={a.descricao} linhas={2} />

            <div className="border-t border-linha pt-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.12em] text-tinta-tenue">O Toque</p>
              <Area rotulo="1 · Reconhece" nome="toque_reconhece" valor={a.toque_reconhece} linhas={2} />
              <Area rotulo="2 · Agradece" nome="toque_agradece" valor={a.toque_agradece} linhas={2} />
              <Area rotulo="3 · Liberta" nome="toque_liberta" valor={a.toque_liberta} linhas={3} />
            </div>

            <Area
              rotulo="Próximo passo"
              nome="proximo_passo"
              valor={a.proximo_passo}
              linhas={4}
              ajuda="Proposta com condição — «se…, e só se…, talvez possas…». Nunca uma ordem."
            />

            <BotaoGuardar />
          </form>
        ))}
      </div>
    </div>
  );
}
