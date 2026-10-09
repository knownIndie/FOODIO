# 1,000 restaurant seed

This seed creates 1,000 fictional restaurants across 29 Indian cities, 1,000 verified owner accounts, and 24,995 menu items. Each restaurant has 20 to 30 distinct dishes. Fourteen cities have 35 restaurants each; the other fifteen have 34.

Names combine 20 prefixes, 20 suffixes, and the city name. Each owner gets a unique username and email, CUSTOMER and RESTAURANT_OWNER roles, an OWNER membership, and a free subscription. Restaurants are ACTIVE with completed basic, business, compliance, bank, and menu setup. Contact, bank, compliance, and address values are demo placeholders. Coordinates are synthetic points near city centres.

The seed reuses the earlier regional menus and adds sides, drinks, and other dishes. Menus and prices vary deterministically. It uses a separate ID and login namespace from the earlier 29-restaurant seed and FoodIO Kitchen. It does not delete records or implement location switching.

## Owner login

All owners use the existing password `FoodIO-Demo-2026!`.

Example username: `seed1000_mumbai_001`.

Sign in with the email address. Example email: `seed1000.mumbai-001@example.test`.

The preview lists every username, email, restaurant, location, and menu.

## Preview

From the repository root:

```sh
bun run scripts/Script/SeedFor1000restaurants/1000-restaurants-seed.ts
```

This validates the dataset and writes `1000-restaurants-preview.json` beside the script without connecting to a database.

## Database write

```sh
bun --env-file=.env run scripts/Script/SeedFor1000restaurants/1000-restaurants-seed.ts --write
```

The write targets DATABASE_URL. It hashes each owner's password with a separate salt, then writes all records in one transaction. Reruns update this seed's records and preserve menu IDs. Unexpected account, restaurant, ownership, or menu collisions abort the transaction. Existing roles and pricing tiers are preserved. Reruns reset the seeded owners' passwords and subscriptions to these seed defaults.

## Local integration check

```sh
bun run scripts/Script/SeedFor1000restaurants/1000-restaurants-seed.check.ts
```

The check applies the repository migrations to an in-memory PGlite database. It checks insertion counts, menu sizes, password verification, reruns, stable menu IDs, preservation of an unrelated restaurant, and rollback on an account collision. It does not read DATABASE_URL.
