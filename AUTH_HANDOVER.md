# FoodIO Auth Handover

## Working style

The user is implementing the code. Act as a technical mentor and reviewer.

When the user says `check`:

1. Inspect the live code first.
2. Run relevant verification.
3. Separate correct behavior, broken behavior, and cleanup.
4. Explain why each issue matters using concrete values and object shapes.
5. Give only the next focused task.
6. Do not implement unless the user explicitly asks for implementation.

Be direct. Do not use em dashes. Do not jump several phases ahead.

## Repository

Path: `/Users/ana/Development/FOODIO`

Stack:

- Next.js 16 App Router
- TypeScript
- Drizzle ORM
- Neon PostgreSQL
- Argon2
- Zod
- TanStack Form
- shadcn components
- pnpm
- `jose` 6.2.3

`AUTH_PLAN.md` was deliberately deleted as outdated. Do not recreate it unless the user asks. Current learning notes are in `learned.md`.

Useful verification commands:

```bash
pnpm typec
pnpm l
pnpm b
git diff --check
```

## Preserved decisions

- Keep the database property named `password`.
- One human has one `profiles` row and one password.
- A profile may have multiple platform roles through `profile_roles`.
- The browser never submits arbitrary roles.
- Signup routes assign roles on the server.
- Login endpoints identify the requested portal but do not grant its role.
- Restaurant-specific access will eventually use `restaurant_members`. A global `RESTAURANT_OWNER` role must not grant access to every restaurant.
- The seed command remains `pnpm seed`.
- Finish the customer vertical slice before cloning restaurant and delivery routes.

## Verified completed work

### Customer registration

`app/api/register/customer/route.ts`:

- Safely parses JSON.
- Validates with `signupFormSchema`.
- Assigns `roles: ["CUSTOMER"]` on the server.
- Calls the shared `registerProfile()` service.
- Returns `201` with a safe profile.
- Maps invalid input to `400` and duplicate email or username to `409`.

Runtime registration and database role assignment were previously verified.

### Credential login

`lib/auth/login-profile.ts`:

- Normalizes email.
- Looks up the profile.
- Verifies the submitted password with Argon2.
- Throws `INVALID_CREDENTIALS` for an unknown email or wrong password.
- Returns safe profile fields.

`app/api/login/customer/route.ts` validates the request and maps invalid credentials to a generic `401` response.

### JWT signing and cookie issuance

`lib/auth/jwt.ts` exports `signAccessToken(profileId)`.

The signed token uses:

```text
algorithm: HS256
sub: string profile ID
iss: foodio
aud: foodio-web
iat: current time
exp: current time plus 60 seconds
tokenType: access
```

Successful customer login:

1. Verifies credentials.
2. Calls `signAccessToken(profile.id)`.
3. Creates a `NextResponse` containing the safe profile.
4. Sets `foodio_access_token` as an HTTP-only cookie.
5. Returns the response.

The cookie options are:

```ts
{
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
}
```

Verified runtime result for the test profile:

```json
{
  "alg": "HS256",
  "sub": "7",
  "iss": "foodio",
  "aud": "foodio-web",
  "tokenType": "access",
  "lifetimeSeconds": 60
}
```

The customer login returned `200` and a cookie with `Path=/`, `HttpOnly`, and `SameSite=lax`. Typecheck, lint, production build, whitespace checks, and runtime login passed.

## Intentional temporary debug behavior

The user intentionally returns the raw JWT in the successful login JSON and displays it in the login UI with a `∑` character. This is for the current demonstration only. Do not repeatedly report the character as an accidental typo.

The raw token response bypasses the protection of the HTTP-only cookie because browser JavaScript can read the duplicate token. The user understands this and accepts it for the current test data. Remove the raw token response, client response type, and UI display before real production use.

## Known incomplete work

- `lib/auth/jwt.ts` currently contains a user-started empty stub: `setResponseCookie(token: string, response: Response)`. It is not used. It causes unused-parameter lint warnings and contains trailing whitespace. Preserve it until the user says whether they want to finish or remove that abstraction.
- There is no `verifyAccessToken(token)` helper.
- There is no `/api/auth/me` route to read and verify the cookie.
- The UI does not detect or display JWT expiration.
- The customer login route does not check that the profile has the `CUSTOMER` role before issuing a token.
- `tokenType: "access"` is currently metadata only because nothing verifies it.
- Restaurant and delivery registration and login routes are not complete.
- Logout and cookie deletion are not implemented.

Do not claim the entire original route-specific registration phase or the complete authentication system is finished.

## Immediate next task

First inspect the live `setResponseCookie()` stub and ask whether the user wants to finish it or remove it. Do not silently implement or delete it.

After that stub is resolved, complete only `verifyAccessToken(token)` in `lib/auth/jwt.ts`.

It should:

1. Accept the JWT string.
2. Call `jose.jwtVerify()` using the existing encoded secret.
3. Allow only `HS256`.
4. Require issuer `foodio`.
5. Require audience `foodio-web`.
6. Confirm `sub` exists and represents a valid numeric profile ID.
7. If retaining the custom claim, confirm `tokenType === "access"`.
8. Return a small safe result such as `{ profileId }`.
9. Treat invalid signatures, malformed tokens, and expired tokens as verification failures without leaking internals.

Do not create `/api/auth/me`, change the UI, or add role authorization until this helper is implemented and checked.
