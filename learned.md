## 17 july 26

`registerProfile()` is a server-side business function that creates one login profile and assigns one or more server-selected roles to it.

**Handles:** Normalizing account info, checking duplicates, hashing passwords, looking up DB roles, creating profile, creating profile-role relationships, atomic transaction, returning safe profile.

**Does not handle:** HTTP, Zod validation, JWT, cookies, redirects, portal selection, client-controlled roles.

---

### Input type

```ts
readonly [PlatformRole, ...PlatformRole[]]
```

- Requires at least one role (empty `[]` is rejected).
- `readonly` prevents mutation of input.

### De-duplicate roles

```ts
const requestedRoles = [...new Set(input.roles)]
```

Prevents PK violations on `profile_roles` composite key and keeps count accurate.

### Duplicate check

```ts
const [existingProfile] = await db.select(...).from(profiles)
  .where(or(eq(profiles.email, email), eq(profiles.username, username))).limit(1)
```

### Transaction

```ts
return db.transaction(async (tx) => {
  // Look up role IDs by name
  const roleRows = await tx.select({ id: roles.id, role: roles.role }).from(roles)
    .where(inArray(roles.role, requestedRoles))

  if (roleRows.length !== requestedRoles.length) {
    throw new Error("REGISTRATION_ROLE_NOT_SEEDED")
  }

  // Map roles to join-table rows and insert
  await tx.insert(profileRoles).values(
    roleRows.map((roleRow) => ({ profileId: profile.id, roleId: roleRow.id }))
  )

  return profile
})
```
- `inArray()` finds all roles in one query.
- Transaction rolls back everything on failure (no orphan accounts).

### Flow

```
Receive input → Normalize → Deduplicate roles → Check existing → Hash pw → txn { Lookup roles → Validate all exist → Insert profile → Insert profile_roles → Commit } → Return safe profile
```