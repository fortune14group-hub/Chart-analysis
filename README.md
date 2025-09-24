# Chart2Signals

Chart2Signals är ett Next.js 14-projekt (App Router) som låter dig ladda upp en aktie/krypto/forex-graf och få teknisk analys tillsammans med köp/sälj-signaler. Vision (OpenAI) används när det finns API-nyckel, annars används heuristisk OpenCV-liknande tolkning och CSV-fallback. Projektet är byggt för produktion med Tailwind, shadcn/ui-inspirerade komponenter och strikt TypeScript.

## Funktioner

- 🚀 **Next.js 14 App Router** med server actions, server components och in-memory persistence.
- 🎨 **Tailwind CSS + shadcn/ui-stil** med mörkt tema som standard.
- 📤 Drag & drop-uppladdning av prisgrafer (PNG/JPG) + CSV-fallback.
- 🧠 **AI-vision** (OpenAI gpt-4o-mini) med strukturerad output när `OPENAI_API_KEY` finns.
- 🔍 Heuristisk fallback (kan köras offline) samt CSV-parser om allt misslyckas.
- 📈 Tekniska indikatorer: SMA, EMA, RSI, MACD, Bollingerband, ATR.
- 🎯 Signaler: SMA-kors, MACD-kors, RSI-reversal, Bollinger-återtag med volymkonfidens + ATR-baserad SL/TP.
- 📊 Resultatsida med Recharts-graf, signal-tabell och export (PNG, CSV, JSON).
- 🔒 NextAuth (magisk länk i dev-läge) med Pro-flagga, mockad webhook-hantering och status-endpoint.
- ✅ Vitest-enhetstester för indikatorer och signalregler.

## Tech-stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- lucide-react
- Recharts
- NextAuth (e-post/magic link, mockad backend)
- OpenAI (valfri Vision-tolkning)
- Vitest
- pnpm

## Kom igång

```bash
# kräver Node.js 20
pnpm install --no-frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Fyll i `.env.local` med dina nycklar vid behov:

- `OPENAI_API_KEY` – aktiverar Vision-tolkning (annars används heuristik/CSV).
- `NEXT_PUBLIC_SITE_URL` – krävs för status-sida och metadata.
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DEV_ADMIN_TOKEN`, `STATUS_TOKEN` – för auth/dev-endpoints.

Besök `http://localhost:3000` för att starta.

## Bygg för produktion

```bash
pnpm install --no-frozen-lockfile
pnpm build
```

## Analysflöde

1. Ladda upp en PNG/JPG eller dra & släpp i dropzonen.
2. Välj marknad och tidsupplösning, slå på önskade indikatorer.
3. Klicka **Analysera** – server action `analyzeImage` sparar analysen och skickar dig till `/result/[id]`.
4. Fungerar inte bilduppladdning? Använd CSV-fallback (`t,o,h,l,c[,v]`) eller hämta exempel från `/examples/sample.csv`.
5. Resultatsidan visar interaktiv graf (Recharts), signaler, SL/TP och exportknappar för PNG/CSV/JSON.

## Exempel

- `public/examples/sample.csv` – minimal dataset som fungerar med CSV-fallbacken.
- Ladda upp egna exempelbilder till `public/examples/` via GitHub ("Add file → Upload files") efter merge.

## Arkitekturöversikt

- **App Router**: `app/page.tsx` (upload), `app/result/[id]` (resultat), `app/pricing`, `app/signup`, `app/thanks`, `app/status`, auth-sidor.
- **Server Actions**: `lib/actions/analyze.ts` hanterar Vision → heuristik → CSV, indikatorer och signaler.
- **Persistens**: In-memory `Map` i `lib/utils/persist.ts` (lätt att ersätta med t.ex. Prisma/SQLite).
- **Bildtolkning**: `extractFromVision.ts` (OpenAI structured outputs) och `extractWithOpenCV.ts` (heuristisk linjetracing på PNG/JPG-data).
- **Indikatorer**: rena funktioner i `lib/ta/*` med vitest-tester i `tests/ta.spec.ts`.
- **Signaler**: `lib/signals/rules.ts` och risk-hantering i `lib/signals/risk.ts` (ATR-baserade SL/TP).
- **Autentisering**: NextAuth med mockad e-post/magic link (`/auth/signin`, `/auth/dev`) och Pro-toggling via `/api/dev/pro`.
- **Webhooks**: `/api/webhook` verifierar signatur (mock) + idempotens. Status läses via `/api/status` & `/status` (kräver token).

## Priser & FAQ

- `/pricing` visar prisplaner och vanliga frågor.
- CTA-sticka i sidfoten leder snabbt tillbaka till uppladdningen.

## Webhooks (mock)

- POST `/api/webhook` (Stripe/Memberstack-redo, mock-verifiering).
- Idempotens i minnet via `lib/utils/idempotency.ts`.
- Status: GET `/api/status` (kräver `STATUS_TOKEN`) + dev-sida `/status`.

## Inloggning (dev)

- NextAuth (JWT) med mockad e-post/magisk länk.
- `/auth/signin` begär länk → `/auth/dev` visar senaste länk (skickas även till server-logg).
- PRO flaggas per e-postadress i in-memory store.

## Dev: Toggle PRO

- POST `/api/dev/pro` (kräver `DEV_ADMIN_TOKEN`).
- Body: `{"email":"user@exempel.se","enable":true|false}` – `enable` kan utelämnas för toggle.

### Byt ut in-memory store

Ersätt `persistAnalysis`/`getAnalysis` i `lib/utils/persist.ts` med valfri databas (t.ex. Prisma med SQLite/Postgres). Alla beroenden är samlade där.

## Tester

Kör vitest för indikatorer och signalregler:

```bash
pnpm test
```

## Deploy på Vercel

- Framework Preset: Next.js
- Root Directory: /
- Node.js version: 20.x (respektera "engines")
- Install Command: pnpm install --no-frozen-lockfile
- Build Command: pnpm build
- Output Directory: .next
- Env-variabler (Production + Preview):
  - NEXT_PUBLIC_SITE_URL=https://<din-domän-eller-vercel-url>
  - NEXTAUTH_SECRET=<slumpad>
  - ENABLE_PRO=false
  - OPENAI_API_KEY=<valfritt>
  - OPENAI_VISION_MODEL=gpt-4o-mini
  - STATUS_TOKEN=<slumpad>
  - DEV_ADMIN_TOKEN=<slumpad>
  - WEBHOOK_PROVIDER=stripe
  - WEBHOOK_SECRET=<från leverantör>
  - WEBHOOK_IDEMP_TTL_MS=7200000

## Deploy till Vercel

```bash
npm i -g vercel
vercel login
vercel
vercel env add OPENAI_API_KEY
vercel env add OPENAI_VISION_MODEL   # valfritt, default gpt-4o-mini
vercel build
vercel deploy --prebuilt --prod
```

## Övrigt

- `/api/health` → `{ status: "ok" }`
- `/api/status` och `/status` visar senast hanterade webhooks (kräver `STATUS_TOKEN`).
- CTA-sticka (`components/CTASticky`) visas på alla sidor förutom resultat.
- Dark mode är default via Tailwind-variabler i `app/globals.css`.

Byggt med ❤️ av Chart2Signals by BetSpread.
