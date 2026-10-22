# 21st import notes

This file was added by the distributor and is not an upstream Creative Tim document.

## What this package is

Vite + React + HashRouter SPA based on Creative Tim Material Dashboard Shadcn.
Client demo data is local.
An Express / Neon / Passport scaffold remains in `server/` and `shared/` but is unused by the static client demo.

## Run locally (Express + Vite)

Use Node.js 20+ and npm.

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
```

`npm run dev` starts Express with the Vite middleware via `tsx server/index.ts` on port 5000.
The process keeps running until stopped with Ctrl-C.

## Static client build

```bash
npx vite build
```

Output directory: `dist/public`.
Production Vite base is `/`.
Routing uses `HashRouter`, so static hosts do not need HTML rewrite rules for client routes.

Equivalent package scripts:

- `npm run build:client` runs `vite build --base=/`
- `npm run build` builds the client and also bundles the Express server into `dist/`

## Environment

`DATABASE_URL` is only needed if you run drizzle-kit (`npm run db:push`).
It is not required for the static client demo or `npx vite build`.
Do not add `.env`, `.npmrc`, or `.vercel/` to redistributed artifacts.

## Auth and billing UI

Sign In / Sign Up and subscription plan buttons are demonstration-only.
They prevent network submit, do not log credentials, and show a local status message.
They do not perform OAuth, payments, mailto, or live sales contact.

## Attribution

Keep `LICENSE.md` (MIT, Copyright (c) 2025 Creative Tim).
See `ATTRIBUTION.md` and `THIRD_PARTY_NOTICES.md`.

The two upstream Replit-only Vite plugins were removed because they are unnecessary for this portable build and their pinned npm metadata did not state license terms.
