<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `apps/www/node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# rhiva

Turborepo + bun workspaces monorepo (`bun@1.3.4`). There is **no test suite** anywhere — verification is lint + typecheck.

## Commands

- Install: `bun install` (root `preinstall` script auto-inits git submodules and deletes their `biome.json`, sets `skip-worktree` on their `bun.lock`/`biome.json`).
- Lint/format: `bun lint` = `biome format --write` + `biome lint --fix` + `biome check .`. It **auto-rewrites files**, and the pre-commit hook runs it — run it yourself to keep diffs clean.
- Typecheck: `bun x turbo check` (`apps/www` defines `check: tsc --noEmit`). `next build` **does not** typecheck (`typescript.ignoreBuildErrors: true` in `next.config.ts`).
- Dev: `bun run dev` (turbo) or `cd apps/www && bun run dev` (`next dev --turbopack`).
- Build: `bun run build`; `apps/www` uses `NODE_OPTIONS=--max-old-space-size=8192` and may OOM without it.
- Test the real CF Worker locally: in `apps/www`, `bun run preview` (OpenNext build + wrangler preview) — `next dev` alone is not production-accurate. `bun run cf-typegen` regenerates `cloudflare-env.d.ts` after changing `wrangler.jsonc` bindings.

## Repo layout

- `apps/www` — the app. **Next.js 16.2.9 + React 19**, deployed as a **Cloudflare Worker via OpenNext** (`wrangler.jsonc`, `open-next.config.ts`) — not a Node server. Local dev gets CF bindings from `initOpenNextCloudflareForDev()`. `reactCompiler: true` (skip manual memoization — the compiler handles it), `typedRoutes: true`. Paths: `@/*` → `src/*`, `@/public/*` → `public/*`.
- `packages/userapi` — `@rhivadotfun/userapi`.
- Deploy: push to `main` → GitHub Actions runs `opennextjs-cloudflare deploy` for `apps/www`. All runtime config is `NEXT_PUBLIC_*` baked into the build from GH secrets — changing env vars means rebuilding/redeploying.
- `modules/*` are **git submodules (separate repos)**: `server` (TS + Rust turbo monorepo) and `terminal-trading-backend` (Rust: Geyser→NATS→ClickHouse/Redis→Axum, plus `sdk/`). `apps/www/public/static/charting_library` is TradingView's lib, also a submodule.
- `@rhivadotfun/*` workspace packages: `api` → `modules/server/servers/api`, `dataapi` → `modules/terminal-trading-backend/sdk`, `zap` → `modules/server/modules/zap`, plus `shared`/`env`/`datasource`/`tx-builder` → `modules/server/packages/*`. Edit submodule packages in the submodule repo, not under `apps/www/node_modules` (symlinks).

## Conventions

- Biome only (no eslint/prettier): double quotes, 2-space indent, multiline JSX attributes.
- `.agents/rules/generic.md` applies: named exports, kebab-case filenames, DRY (extract repeated UI into data arrays), prefer cva variants / component props over repeated `className`.
- Env: all `.env*` are gitignored except `.env.spec`. `apps/www/.env.spec` lists required vars; deploys inject them from GitHub secrets.
- shadcn/ui + Tailwind v4 (`components.json`, base-nova style). New components go in `apps/www/src/components/ui`.
