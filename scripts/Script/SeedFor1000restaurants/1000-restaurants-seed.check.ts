import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { PGlite } from "@electric-sql/pglite"
import { hash, verify } from "argon2"
import { drizzle } from "drizzle-orm/pglite"
import { ownerPassword, seeds, totalDishes } from "./1000-restaurants-data"
import { writeSeed } from "./1000-restaurants-seed"

// In-memory Postgres only. This check never reads DATABASE_URL.
const client = new PGlite()
const db = drizzle({ client })
try {
  const migrations = new URL("../../../lib/db/migrations/", import.meta.url)
  for (const directory of (await readdir(migrations)).sort()) {
    if (!/^\d/.test(directory)) continue
    await client.exec(
      await readFile(new URL(`${directory}/migration.sql`, migrations), "utf8")
    )
  }
  const passwordHash = await hash(ownerPassword)
  const hashes = seeds.map(() => passwordHash)
  const run = () =>
    db.transaction(async (tx) => {
      // Both drivers implement the same Drizzle PostgreSQL query interface.
      await writeSeed(tx as unknown as Parameters<typeof writeSeed>[0], hashes)
    })
  await client.exec(
    `INSERT INTO restaurants (restaurant_id, name) VALUES ('00000000-0000-4000-8000-000000000001', 'Existing restaurant')`
  )
  console.log("Checking first insert...")
  await run()
  const count = async (table: string) =>
    Number(
      (
        await client.query<{ count: number }>(
          `SELECT count(*)::int AS count FROM ${table}`
        )
      ).rows[0].count
    )
  assert.equal(await count("restaurants"), 1001)
  assert.equal(await count("profiles"), 1000)
  assert.equal(await count("profile_subscriptions"), 1000)
  assert.equal(await count("restaurant_members"), 1000)
  assert.equal(await count("profile_roles"), 2000)
  assert.equal(await count("restaurant_business_details"), 1000)
  assert.equal(await count("restaurant_bank_accounts"), 1000)
  assert.equal(await count("restaurant_compliances"), 2000)
  assert.equal(await count("restaurant_setup_status"), 1000)
  assert.equal(await count("menu_items"), totalDishes)
  const invalidMenus = await client.query(
    `SELECT restaurant_id FROM menu_items GROUP BY restaurant_id HAVING count(*) < 20 OR count(*) > 30 OR count(*) <> count(DISTINCT name)`
  )
  assert.equal(invalidMenus.rows.length, 0)
  const owners = await client.query<{
    password: string
    email_verified_at: Date
  }>("SELECT password, email_verified_at FROM profiles LIMIT 1")
  assert.ok(owners.rows[0].email_verified_at)
  assert.ok(await verify(owners.rows[0].password, ownerPassword))
  const before = (
    await client.query(
      "SELECT id, restaurant_id, name FROM menu_items ORDER BY id"
    )
  ).rows
  console.log("Checking rerun and stable menu IDs...")
  await run()
  assert.deepEqual(
    (
      await client.query(
        "SELECT id, restaurant_id, name FROM menu_items ORDER BY id"
      )
    ).rows,
    before
  )
  assert.equal(await count("restaurants"), 1001)
  assert.equal(await count("profiles"), 1000)
  assert.equal(await count("restaurant_members"), 1000)
  const existing = await client.query<{ name: string }>(
    "SELECT name FROM restaurants WHERE restaurant_id = '00000000-0000-4000-8000-000000000001'"
  )
  assert.equal(existing.rows[0].name, "Existing restaurant")
  // A late collision must roll back earlier updates in the same transaction.
  await client.query(
    "UPDATE menu_items SET price_in_paise = 1 WHERE restaurant_id = $1",
    [seeds[0].id]
  )
  await client.query(
    "UPDATE profiles SET name = 'Conflicting account' WHERE email = $1",
    [seeds[20].email]
  )
  await assert.rejects(run(), /Account collision/)
  const prices = await client.query<{ price_in_paise: number }>(
    "SELECT price_in_paise FROM menu_items WHERE restaurant_id = $1",
    [seeds[0].id]
  )
  assert.ok(prices.rows.every((item) => item.price_in_paise === 1))
  console.log(
    `Passed: 1,000 restaurants, 29 cities, ${totalDishes} dishes, owner login, reruns, preservation and collision rollback.`
  )
} finally {
  await client.close()
}
