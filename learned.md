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

## 21 july 26

### Login and password verification

The login form sends this JSON to the customer login route:

```ts
{
  email: "foodio.test1@example.com",
  password: "FoodIOTest123!",
}
```

The server normalizes the email, finds the profile, and calls Argon2 `verify(storedHash, submittedPassword)`. Argon2 does not create the same hash again. `verify()` reads the salt and settings stored inside the existing hash and checks whether the submitted password is valid for it.

The login service returns safe profile fields. It does not create HTTP responses, set cookies, or decide which portal the profile may access.

### JWT signing

`signAccessToken(profileId)` creates a signed token containing:

```ts
{
  sub: String(profileId),
  tokenType: "access",
  iss: "foodio",
  aud: "foodio-web",
  iat: currentUnixTime,
  exp: currentUnixTime + 60,
}
```

- `sub` identifies the profile.
- `iss` identifies FoodIO as the token issuer.
- `aud` identifies the FoodIO web application as the intended recipient.
- `iat` records when the token was created.
- `exp` makes the token invalid after one minute.
- `tokenType` is a custom claim. It has no automatic meaning unless verification explicitly checks it.
- `HS256` signs the token using the server's `JWT_SECRET`.

A signed JWT is not encrypted. Its header and payload can be decoded, but changing them invalidates the signature unless the attacker knows the secret.

### Login response and HTTP-only cookie

The successful customer login sequence is:

```text
Validate request → Verify credentials → Sign JWT → Create NextResponse → Set cookie on response → Return response
```

`NextResponse.json()` creates the JSON response first. `response.cookies.set()` then adds a `Set-Cookie` header to that same response. Returning the response sends both the JSON profile and the cookie.

The cookie is named `foodio_access_token` and uses:

```ts
{
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
}
```

`httpOnly` prevents client-side JavaScript from reading the cookie. The browser still stores it and sends it automatically with matching FoodIO requests.

JWT expiration does not notify the page or delete the cookie automatically. A server endpoint must read the cookie, verify the JWT, reject it after `exp`, and return a result the UI can display.

### Authentication is not authorization

The `/api/login/customer` endpoint currently verifies credentials but does not yet verify the `CUSTOMER` role. The endpoint name does not grant or prove authorization. A server-controlled role check is still required before the customer portal is production-ready.
