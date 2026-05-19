# VION Vibracional

App mobile de autoconhecimento vibracional baseada na Escala de Hawkins (17 níveis, 20Hz–700Hz). Quiz de 24 perguntas → mapeamento de frequência → guia de elevação personalizado.

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
| `EXPO_PUBLIC_SUPABASE_URL` | URL Supabase (opcional) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase (opcional) |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat iOS |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat Android |

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

## Pagamentos

O fluxo passa por **RevenueCat** com offerings/packages — configura no dashboard:
- Entitlement: `guia_premium`
- Package: `guia_unico_499`

A Stripe está conectada via RevenueCat → App Store / Play Store. Sem chaves RC, a app cai em modo dev (desbloqueio local).

## Notificações

Lembrete semanal automaticamente agendado às segundas 09:00 (após permissão).
