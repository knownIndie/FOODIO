### 28Aug26 main learnings

- A composite primary key makes the **combination** unique:

  ```ts
  primaryKey({
    columns: [table.restaurantId, table.profileId],
  });
  ```

  This prevents the same profile from being added to the same restaurant twice.

- A composite key does not make the relationship one-to-one. It allows:

  ```text
  profile 1 -> restaurant A
  profile 1 -> restaurant B
  ```

  That is many-to-many membership.

- For one profile to have one subscription row, make `profileId` the primary key by itself:

  ```ts
  profileId: integer("profile_id").primaryKey();
  ```

  This allows many profiles to share the same pricing tier, but prevents one profile from having two subscription rows.

- This enforces **at most one** subscription per profile. You still need to create the default Free subscription when registering the profile if every profile must have one.

- The `(table) => [...]` part of `pgTable` defines table-level rules such as composite keys. It does not define the relationship by itself.

- This TypeScript line:

  ```ts
  export type PricingTier = (typeof pricingTiers)[number];
  ```

  extracts the type of one item from the pricing array. It is only for TypeScript and has no database effect.

- `export const pricingTiers` is runtime data. The seed script uses it.

- Seeding can use `map`:

  ```ts
  await db.insert(pricingTierTable).values(
    pricingTierData.map((tier) => ({
      id: tier.id,
      planName: tier.planName,
      planPrice: tier.planPrice,
      staffLimit: tier.staffLimit,
      restaurantLimit: tier.restaurantLimit,
    })),
  );
  ```

  `map` creates multiple rows, and Drizzle inserts them with one bulk database query.
