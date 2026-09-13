import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { after, before, beforeEach, mock, test } from "node:test"
import { PGlite } from "@electric-sql/pglite"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/pglite"
import * as tables from "../lib/db/schema/schema.ts"
import { restaurantOnboardingSchema } from "../lib/restaurants/schema/restaurant-schema.ts"

const pg = new PGlite()
const db = drizzle({ client: pg })
mock.module("server-only", { namedExports: {} })
mock.module(new URL("../lib/db/drizzle.ts", import.meta.url).href, { namedExports: { db } })
let sessionProfile = null
mock.module(new URL("../lib/auth/current-profile.ts", import.meta.url).href, {
  namedExports: { currentProfile: async () => sessionProfile },
})
const { handleOnboardingRequest } = await import("../lib/restaurants/onboarding-request.ts")
const { submitOnboarding } = await import("../lib/restaurants/submit-onboarding.ts")

const input = restaurantOnboardingSchema.parse({
  name: "Test Kitchen", description: "Lunch and dinner", phone: "9876543210",
  email: "", address: "42 Test Road", latitude: "12.97", longitude: "77.59",
  legalName: "Test Kitchen Ltd", entityType: "private_limited",
  registeredAddress: "42 Test Road", ownerOrPocName: "Test Owner", ownerOrPocPhone: "9876543210",
  fssaiRegistrationNumber: "12345678901234", gstRegistrationNumber: "", tradeLicenseNumber: "",
  bankName: "Test Bank", accountNumber: "0000123456", ifsc: "test0001234",
})
let ownerId

before(async () => {
  const root = new URL("../lib/db/migrations/", import.meta.url)
  for (const entry of (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    await pg.exec(await readFile(new URL(`${entry.name}/migration.sql`, root), "utf8"))
  }
})
after(async () => { await pg.close() })
beforeEach(async () => {
  await pg.exec("TRUNCATE restaurants, profiles, pricing_tiers CASCADE")
  const [owner] = await db.insert(tables.profiles).values({ name: "Owner", username: "owner", email: "owner@example.test", password: "unused" }).returning()
  ownerId = owner.id
  sessionProfile = { id: ownerId, emailVerifiedAt: new Date(), roles: ["RESTAURANT_OWNER"] }
  await db.insert(tables.pricingTiers).values({ id: 1, planName: "Free", planPrice: 0, restaurantLimit: 2, staffLimit: 1 })
  await db.insert(tables.profileSubscriptions).values({ profileId: ownerId, pricingTierId: 1, restaurantLimit: 2, staffLimit: 1 })
})

test("validates the entire application, including business and location", () => {
  const result = restaurantOnboardingSchema.safeParse({ ...input, legalName: "", latitude: "", fssaiRegistrationNumber: "", bankName: "" })
  assert.equal(result.success, false)
  if (!result.success) assert.deepEqual(new Set(result.error.issues.map((issue) => issue.path[0])), new Set(["legalName", "latitude", "fssaiRegistrationNumber", "bankName"]))
})

test("submits all details together and enters the admin review queue", async () => {
  const result = await submitOnboarding(ownerId, input)
  const [restaurant] = await db.select().from(tables.restaurants).where(eq(tables.restaurants.id, result.id))
  assert.equal(restaurant.status, "PENDING_REVIEW")
  assert.equal(restaurant.resmaplatitude, 12.97)
  assert.equal((await db.select().from(tables.restaurantBusinessDetails))[0].legal_name, input.legalName)
  const [bank] = await db.select().from(tables.restaurantBankAccounts)
  assert.equal(bank.accountNumber, "0000123456")
  assert.equal(bank.ifsc, "TEST0001234")
  assert.equal((await db.select().from(tables.restaurantCompliances)).length, 1)
  assert.equal((await db.select().from(tables.restaurantSetupStatus))[0].restaurantBankAccountsStatus, "COMPLETED")
})

test("replaces previously saved draft details and removes cleared optional registrations", async () => {
  const result = await submitOnboarding(ownerId, { ...input, gstRegistrationNumber: "old-gst" })
  await db.update(tables.restaurants).set({ status: "DRAFT" }).where(eq(tables.restaurants.id, result.id))
  await submitOnboarding(ownerId, { ...input, legalName: "Updated Kitchen" }, result.id)
  assert.equal((await db.select().from(tables.restaurantBusinessDetails))[0].legal_name, "Updated Kitchen")
  assert.deepEqual((await db.select().from(tables.restaurantCompliances)).map((item) => item.type), ["FSSAI"])
})

test("rejects access by another owner and repeated submission", async () => {
  const result = await submitOnboarding(ownerId, input)
  const [other] = await db.insert(tables.profiles).values({ name: "Other", username: "other", email: "other@example.test", password: "unused" }).returning()
  await assert.rejects(submitOnboarding(other.id, input, result.id), { status: 404 })
  await assert.rejects(submitOnboarding(ownerId, input, result.id), { status: 409 })
})

test("enforces the restaurant quota without blocking completion of an existing draft", async () => {
  await db.update(tables.profileSubscriptions).set({ restaurantLimit: 1 })
  const first = await submitOnboarding(ownerId, input)
  await assert.rejects(submitOnboarding(ownerId, input), { status: 403 })
  await db.update(tables.restaurants).set({ status: "DRAFT" }).where(eq(tables.restaurants.id, first.id))
  await submitOnboarding(ownerId, input, first.id)
  assert.equal((await db.select().from(tables.restaurants)).length, 1)
})

test("rolls back the whole application if a later write fails", async () => {
  await pg.exec("ALTER TABLE restaurant_bank_accounts ADD CONSTRAINT test_bank_failure CHECK (bank_name <> 'Fail Bank')")
  try {
    await assert.rejects(submitOnboarding(ownerId, { ...input, bankName: "Fail Bank" }))
    assert.equal((await db.select().from(tables.restaurants)).length, 0)
    assert.equal((await db.select().from(tables.restaurantBusinessDetails)).length, 0)
    assert.equal((await db.select().from(tables.restaurantMembers)).length, 0)
  } finally {
    await pg.exec("ALTER TABLE restaurant_bank_accounts DROP CONSTRAINT test_bank_failure")
  }
})

const request = (body = input) => new Request("http://localhost/api/restaurants", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
})

test("HTTP handler rejects anonymous, unverified, and non-owner callers", async () => {
  sessionProfile = null
  assert.equal((await handleOnboardingRequest(request())).status, 401)
  sessionProfile = { id: ownerId, emailVerifiedAt: null, roles: ["RESTAURANT_OWNER"] }
  assert.equal((await handleOnboardingRequest(request())).status, 403)
  sessionProfile = { id: ownerId, emailVerifiedAt: new Date(), roles: ["CUSTOMER"] }
  assert.equal((await handleOnboardingRequest(request())).status, 403)
  assert.equal((await db.select().from(tables.restaurants)).length, 0)
})

test("HTTP handler returns validation errors without writing partial data", async () => {
  const response = await handleOnboardingRequest(request({ name: "Incomplete" }))
  assert.equal(response.status, 400)
  assert.ok((await response.json()).fieldErrors.bankName)
  assert.equal((await handleOnboardingRequest(request(), "invalid-id")).status, 400)
  assert.equal((await db.select().from(tables.restaurants)).length, 0)
})

test("HTTP handler returns the submitted restaurant destination", async () => {
  const response = await handleOnboardingRequest(request())
  assert.equal(response.status, 201)
  const data = await response.json()
  assert.equal(data.restaurant.status, "PENDING_REVIEW")
  assert.equal(data.next, `/dashboard/restaurants/${data.restaurant.id}`)
})
