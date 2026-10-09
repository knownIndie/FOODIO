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
| `bun run check` | Run TypeScript and lint checks |
| `bun run typecheck` | Check TypeScript |
| `bun run lint` | Check code style and lint rules |
| `bun run format` | Apply code style and safe lint fixes |
| `bun run test:seed` | Check the restaurant seed in an isolated database |
| `bun run db:check` | Check local migration consistency |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Apply migrations to the configured database |
| `bun run db:push` | Push the schema to the configured database |
| `bun run db:studio` | Open the database browser |

The existing short commands `b`, `s`, `l`, `mc`, `f`, `typec`, `dbg`, `dbm`,
`dbp`, and `dbs` remain available.

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
