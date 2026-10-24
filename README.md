# FoodIO

Use Bun 1.4.2, as set in `package.json`.

```sh
bun install --frozen-lockfile
bun run dev
```

Copy `.env.example` to `.env` and set your service values before running the app.

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run dev:webpack` | Start the development server with Webpack |
| `bun run build` | Build the production app |
| `bun run start` | Serve the production build |
| `bun run check` | Run TypeScript, lint, and format checks |
| `bun run typecheck` | Check TypeScript |
| `bun run lint` | Check code with Oxlint |
| `bun run lint:fix` | Apply safe Oxlint fixes |
| `bun run format:check` | Check TypeScript formatting with Oxfmt |
| `bun run format` | Apply safe lint fixes and TypeScript formatting |
| `bun run test:seed` | Check the restaurant seed in an isolated database |
| `bun run db:check` | Check local migration consistency |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Apply migrations to the configured database |
| `bun run db:push` | Push the schema to the configured database |
| `bun run db:studio` | Open the database browser |

The existing short commands `b`, `s`, `l`, `mc`, `f`, `typec`, `dbg`, `dbm`,
`dbp`, and `dbs` remain available.

Oxlint uses `.oxlintrc.json`. Oxfmt uses `.oxfmtrc.json`. The tool versions are
pinned in `package.json` and `bun.lock`. Formatting covers `.ts` and `.tsx`
files, with 2 spaces, 80 columns, double quotes, and no semicolons.
Import sorting is off for this trial because its order differs from Biome.
The former Biome import-order check is therefore no longer enforced.

Correctness and hook checks report errors. The added React render, semantic
element, control-label, and empty-file checks report warnings during the trial.
Review these warnings before making their rules errors. This is not an exact
copy of Biome's recommended rules; Oxlint does not lint CSS or JSON.

In Zed, install the **Oxc** extension. The project settings use Oxlint for
diagnostics and Oxfmt for TypeScript and TSX formatting on save.

The app, build, TypeScript checks, seed scripts, and Drizzle commands use Bun.
Development and production builds use Turbopack. The development disk cache is
disabled in `next.config.ts`. Reusing the previous cache caused rapid PostCSS
worker and memory growth with both Bun and Node. In-session caching and Fast
Refresh remain available, but each server restart must compile pages again.
Use `bun run dev:webpack` if you need the alternative development compiler.
The `trustedDependencies` list in `package.json` allows the required dependency
install scripts. `bun.lock` stores the dependency versions.

The `db:migrate` and `db:push` commands can change your configured database.
Use `bun upgrade` to update Bun, then update `.bun-version`, `packageManager`,
and `engines.bun` in this project after verification.

[ideas to look into]
- what if i add city name in the db column
- we can filter with out needing to do the distance calucaltion on all the diffrent restaurants i pulled
