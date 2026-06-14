# VION Vibracional

App mobile de autoconhecimento vibracional baseada na Escala de Hawkins (17 níveis, 20Hz–700Hz). Quiz de 24 perguntas → mapeamento de frequência → guia de elevação personalizado.

## 🚀 Deploy num clique (web)

[![Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fespacoprovavel%2Fvion&env=EXPO_PUBLIC_SUPABASE_URL,EXPO_PUBLIC_SUPABASE_ANON_KEY&envDescription=Chaves%20do%20teu%20projeto%20Supabase%20(Project%20URL%20%2B%20chave%20public%C3%A1vel)&envLink=https%3A%2F%2Fsupabase.com%2Fdashboard&project-name=vion-vibracional&repository-name=vion)

1. Clica no botão acima
2. Liga ao GitHub (autoriza o Vercel)
3. Quando pedir a branch, escolhe `claude/build-vion-app-jHdyQ`
4. Cola as duas variáveis do Supabase (URL + chave publicável)
5. Clica em **Deploy** → ~2 min depois tens um link `https://vion-xxx.vercel.app` público

## Stack

- React Native + Expo (SDK 51) + Expo Router (file-based)
- Supabase (auth/backend) — opcional
- RevenueCat (Stripe via stores) — guia premium €4,99
- Reanimated, Expo Linear Gradient, react-native-svg
- Expo Notifications (lembrete semanal seg. 09:00)
- AsyncStorage (histórico local)

## Setup

```bash
npm install
cp .env.example .env  # preencher chaves
npx expo start
```

Sem chaves preenchidas a app corre em **modo dev** — o desbloqueio do guia premium funciona localmente para testes.

### Variáveis de ambiente

| Var | Função |
|---|---|
| `EXPO_PUBLIC_SITE_URL` | URL pública do site (default `https://vion-three.vercel.app`). Usada nas OG tags e redirect de recuperar palavra-passe. |
| `EXPO_PUBLIC_SUPABASE_URL` | URL Supabase (opcional) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase (opcional) |
| `EXPO_PUBLIC_POSTHOG_KEY` | Chave PostHog (opcional). Sem chave, analytics fica em no-op. |
| `EXPO_PUBLIC_POSTHOG_HOST` | Host PostHog (default `https://eu.i.posthog.com`). |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat iOS (futuro) |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat Android (futuro) |
| `ANTHROPIC_API_KEY` | **Server-only.** Chave Anthropic (Claude Haiku 4.5) para gerar o relatório-ebook personalizado. Sem ela, o endpoint `/api/relatorio` devolve 503. |
| `RESEND_API_KEY` | **Server-only.** Chave Resend para enviar o PDF por email. |
| `RESEND_FROM` | **Server-only.** Remetente, ex.: `VION <relatorio@vion.pt>`. Default: `VION <onboarding@resend.dev>` (para testes Resend). |

## Estrutura

```
app/
  _layout.tsx       Root (fontes, providers, RC init)
  index.tsx         Landing
  escala.tsx        Escala completa (timeline)
  teste.tsx         Quiz 24 perguntas (2 blocos)
  resultado.tsx     Resultado animado + posição na escala
  guia.tsx          Guia premium €4,99
  tracker.tsx       Tracker semanal + gráfico
  praticas.tsx      Biblioteca por nível
components/         Cosmic bg, particles, ring, fade, gradient btn
constants/          Cores, fontes, 17 níveis, 24 perguntas, guias
lib/                Supabase, storage, scoring, notifications, payments
```

## Algoritmo

```
mediaB1 = soma(b1)/12
mediaB2 = soma(b2)/12
hz = round(mediaB1 * 0.40 + mediaB2 * 0.60)
```

Depois `getNivelMaisProximo(hz)` mapeia para um dos 17 níveis canónicos.

## Autenticação (opcional)

A app funciona em modo anónimo (dados só no dispositivo). Para activar **login com email + palavra-passe**:

1. Cria um projecto em [supabase.com](https://supabase.com).
2. Em **Project Settings → API** copia `URL` e `anon key`.
3. Cola no `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Em **SQL Editor**, cola o conteúdo de `supabase/schema.sql` e executa.
5. Em **Authentication → Providers** garante que `Email` está ligado. Para dev, desactiva "Confirm email" para entrares sem confirmar.
6. Reinicia `npx expo start`.

Ecrãs incluídos: `/auth/login`, `/auth/signup`, `/auth/recuperar`, `/conta`. Botão "Entrar" aparece no canto superior do Landing e da Evolução.

## Pagamentos

O fluxo passa por **RevenueCat** com offerings/packages — configura no dashboard:
- Entitlement: `guia_premium`
- Package: `guia_unico_499`

A Stripe está conectada via RevenueCat → App Store / Play Store. Sem chaves RC, a app cai em modo dev (desbloqueio local).

## Notificações

Lembrete semanal automaticamente agendado às segundas 09:00 (após permissão).

## Relatório E-book personalizado (PDF por email)

Endpoint Vercel Function em `api/relatorio.ts`:

- Recebe `{ hz, nome, email, respostas? }`
- Carrega as **âncoras** do nível em `constants/ancoras.ts` (a Michelle escreve 7 frases-âncora por nível, 1 vez)
- **Claude Haiku 4.5** expande as âncoras para 7 capítulos de 700-1100 palavras cada, integrando as respostas concretas do utilizador
- **React-PDF** gera um e-book A4 com capa + índice + 7 capítulos
- **Resend** envia o PDF em anexo para o email do utilizador

Modo offline (sem `ANTHROPIC_API_KEY` ou `RESEND_API_KEY`): o endpoint devolve 503 com mensagem clara; o utilizador continua a ver a versão e-book no site, sem PDF.

Custo estimado: ~€0,01 por relatório gerado (Claude) + free tier Resend (3000 emails/mês).

## Analytics

PostHog (web) com no-op silencioso no mobile e quando não há chave. Wrapper em `lib/analytics.ts`.

### Eventos registados

| Evento | Propriedades | Quando dispara |
|---|---|---|
| `app_aberto` | — | Ao carregar a app |
| `onboarding_completo` | `saltou` (bool) | Fim do onboarding (concluído ou saltado) |
| `teste_iniciado` | — | Botão "Começar" antes das 24 perguntas |
| `teste_pergunta_respondida` | `pergunta`, `hz` | Cada resposta do teste |
| `teste_completo` | `hz`, `nivel`, `nivel_hz` | Cálculo final do teste |
| `resultado_visto` | `hz`, `nivel`, `nivel_hz` | Abertura do ecrã `/resultado` |
| `partilha_clicada` | `hz`, `nivel` | Botão de partilhar resultado |
| `guia_cta_clicado` | `hz`, `nivel`, `origem` | Clique no CTA do guia/elevação |
| `checkout_iniciado` | `produto`, `preco_cents` | Início do fluxo de compra |
| `compra_completa` | `produto`, `valor_cents` | Compra confirmada (hoje via stub; Sprint 3 via webhook Stripe) |

### Funil principal

```
app_aberto
  → teste_iniciado
    → teste_completo
      → resultado_visto
        → guia_cta_clicado
          → checkout_iniciado
            → compra_completa
```

Métricas-chave que este funil permite responder: taxa de conclusão do teste, % de utilizadores que veem o guia depois do resultado, taxa de checkout e taxa de conversão para compra.
