# FoodIO

Use pnpm 10.33.0, as set in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm typecheck` and `pnpm lint` to check the code. Run `pnpm build`
to build the app, then `pnpm start` to serve it. The existing short commands
`typec`, `l`, `b`, and `s` also work.

Copy `.env.example` to `.env` and set your service values before running the app.
The pnpm workspace file lists the dependency install scripts this project allows.

[ideas to look into]
- what if i add city name in the db column
- we can filter with out needing to do the distance calucaltion on all the diffrent restaurants i pulled
