# Âmago

Ferramenta de autoconhecimento. Através de um mergulho progressivo de perguntas,
descama camada a camada e levanta o Véu — aquilo que a pessoa ainda não vê sobre
si e que a afasta daquilo que quer.

Base científica, sem misticismo. Não há energias, níveis de consciência,
constelação espiritual nem nada que se lhe pareça. A interpretação, no MVP, é
feita por **regras e pontuação** — não há IA no caminho.

> O Âmago é uma ferramenta de autoconhecimento. Não é um instrumento clínico,
> não faz diagnósticos e não substitui acompanhamento psicológico ou médico.

---

## O método — "O Mergulho Âmago"

Cinco camadas, cada ronda mais funda, com linguagem indireta e permissiva:

1. **Comportamento** — o que fazes
2. **História** — o que pensas e sentes quando aquilo dispara
3. **Função** — do que é que o padrão te protege
4. **Terreno** — o que se aprendeu na família
5. **Comando** — que parte interna dá a ordem

O **Véu** é revelado pelo **fosso consciente/inconsciente**: compara-se o que a
pessoa *afirma* sobre si com o *padrão* que as respostas mostram. Onde não batem
certo, está o Véu.

### Os seis padrões

Cada um é uma **sombra** com uma **forma integrada** — a leitura mostra sempre os
dois e a ponte entre eles.

| Sombra | Medo | Forma integrada | Caminho |
|---|---|---|---|
| O Controlador | caos, perder o controlo | O Soberano | confiar e soltar em testes |
| O Provador | não valer | O Criador | separar valor de desempenho |
| O Invisível | ser visto e julgado | O Herói | exposição gradual e segura |
| O Guardião | errar | O Explorador | agir imperfeito de propósito |
| O Leal | trair, deixar os seus | O Sábio | autorizar-se a ir mais longe |
| O Indigno | não merecer | O Merecedor | reconhecer e receber |

### O Toque

A app nunca acusa. Ao revelar a sombra, o texto segue sempre três tempos:
**reconhece** (apareceu por uma boa razão) → **agradece** (protegeu-te de…) →
**liberta** (podes deixá-la descansar; olha quem te tornas). Não há partes más.

### As lentes

O motor funde psicologia cognitivo-comportamental, neurociência do hábito,
análise da função do comportamento, esquemas e padrões aprendidos na família,
marcadores somáticos, teoria dos eus e linguagem permissiva de raiz ericksoniana.

Quem usa a app **não escolhe métodos, não vê abas nem jargão** — recebe uma só
leitura fundida. No fim fica uma linha discreta com a origem e o grau de cada
lente: 🟢 ciência · 🟡 modelo.

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Supabase (Auth + Postgres, região UE) · deploy Vercel + Supabase.

---

## Pôr a correr

```bash
cd amago
npm install
cp .env.example .env.local   # preencher as chaves do Supabase
npm run dev
```

Sem chaves preenchidas, a app corre em **modo demonstração**: o Mergulho funciona
de ponta a ponta e a leitura aparece no fim, mas nada é guardado e não há sessão
nem área Master.

### Variáveis de ambiente

| Variável | Função |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publicável do Supabase |
| `NEXT_PUBLIC_SITE_URL` | URL pública, usada no redirecionamento dos emails de confirmação |

### Base de dados

No SQL Editor do Supabase, corre por esta ordem:

1. `supabase/schema.sql` — tabelas, tipos, RLS e as funções de agregação anónima
2. `supabase/seed.sql` — arquétipos, as 12 perguntas, as respostas e o corpo de
   conhecimento inicial

O `seed.sql` é idempotente: pode voltar a correr para repor os textos originais.
É gerado a partir do conteúdo-semente em `src/lib/motor/` — depois de mexeres lá,
corre `npm run semente:sql` para o regenerar.

Escolhe uma região da UE (Frankfurt ou Irlanda) ao criar o projeto Supabase: as
respostas do Mergulho são categoria especial de dados (artigo 9.º do RGPD).

### Dar o papel de master a uma conta

Cria a conta pela app (`/entrar` → criar conta) e depois, no SQL Editor:

```sql
update public.users set role = 'master' where email = 'o-teu@email.pt';
```

A área `/master` fica disponível a partir daí. Sem esse papel, `/master`
redireciona para o ecrã de entrada.

---

## Estrutura

```
src/
  app/
    page.tsx                 Entrada pública
    mergulho/                Consentimento → entrada → 3 rondas
    resultado/               Leitura sem conta (fica só no browser)
    resultado/[id]/          Leitura guardada
    historico/               Mergulhos anteriores
    entrar/                  Autenticação
    privacidade/             Política de privacidade
    master/                  Área protegida (papel 'master')
      page.tsx               Painel de agregados anónimos
      perguntas/             Perguntas, rondas, respostas e sinais
      arquetipos/            Sombra, forma integrada, medo, caminho, Toque
      conhecimento/          Um só corpo de conhecimento, com grau e estado
    api/mergulho/            Calcula a leitura e grava-a
  components/                Mergulho, Leitura, Autenticação
  lib/
    motor/                   O motor: tipos, arquétipos, perguntas, regras
    supabase/                Clientes de browser e de servidor
    conteudo.ts              Carrega o conteúdo da BD, com fallback em código
supabase/
  schema.sql                 Esquema, RLS e agregados anónimos
  seed.sql                   Conteúdo-semente (gerado)
scripts/
  gerar-seed.py              Gera o seed.sql a partir de src/lib/motor/
  verificar-motor.mjs        Verifica as regras do motor pela API
```

### Como funciona o motor

`src/lib/motor/motor.ts` é puro: recebe perguntas, respostas e a porta de
entrada, devolve a leitura. Não há aleatoriedade — as mesmas respostas dão sempre
a mesma leitura.

- **Pontuação do arquétipo** — cada resposta soma o peso da sua pergunta ao
  padrão que aciona. As perguntas da 2.ª ronda (função e reação à conquista)
  pesam o dobro das da 1.ª. Empates desfazem-se por uma ordem de prioridade fixa.
- **Camada do Véu** — só contam as perguntas que perguntam pelo que a pessoa
  *não* vê (q8, q9, q10). As camadas marcadas nas respostas de arquétipo ficam
  como etiquetas para o painel Master, com peso zero.
- **Fosso** — se a pessoa afirma que assume sempre a responsabilidade ou que
  avança sem hesitar, mas o padrão dominante é dos que recuam (Leal, Guardião,
  Indigno, Invisível), marca-se o fosso. Quando há fosso, é ele que decide a
  camada do Véu: essa distância é, por definição, o que ainda não está visto.
- **Rede de segurança** — o texto livre da entrada é lido à procura de sinais de
  sofrimento grave. Se aparecerem, mostra-se apoio profissional (SNS 24 —
  808 24 24 24) sem interpretar nada, e a pessoa decide se continua.

### Verificar as regras

```bash
npm run build && npm start     # noutro terminal
npm run verificar
```

Percorre a API com cenários montados à mão e confirma o padrão dominante, a
camada do Véu, a deteção do fosso, a linha das lentes e as recusas (sem
consentimento, mergulho incompleto).

---

## Deploy

**Vercel** — importa o repositório e define `amago` como *Root Directory*. Depois
preenche as três variáveis de ambiente. A região está fixada em `fra1`
(Frankfurt) no `vercel.json`.

**Supabase** — projeto numa região da UE, com `schema.sql` e `seed.sql` corridos.
Em *Authentication → URL Configuration*, aponta o *Site URL* para o domínio de
produção.

---

## Privacidade e RGPD

- Consentimento **explícito** pedido antes de começar, com a data e a versão da
  política guardadas em `users`.
- Cada pessoa vê apenas os seus mergulhos — imposto por *row level security* na
  própria base de dados, não por verificações na aplicação.
- A área Master vê **apenas agregados anónimos**, servidos por funções SQL
  dedicadas. Não há ecrã que ligue uma resposta a uma pessoa, e o texto livre
  nunca entra nos agregados.
- Apagar a conta apaga os mergulhos, as respostas e as leituras em cascata.
