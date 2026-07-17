# FoodIO Authentication Plan

Last updated: 17 July 2026

## Goal

Build one authentication system for customers, restaurant owners, and delivery partners.

The system uses:

- One `profiles` table for login identities
- One `roles` table for platform roles
- One `profile_roles` join table so a profile can have multiple roles
- Separate signup pathways that assign server-controlled roles
- One role-aware login API with customer, restaurant, and delivery portal choices
- JWT access tokens stored in an HTTP-only cookie
- Server-side authorization for every protected page and API

## Product decisions

- A person has one profile and one password.
- A profile can have multiple roles.
- Customer signup assigns `CUSTOMER`.
- Restaurant signup assigns `CUSTOMER` and `RESTAURANT_OWNER`.
- Delivery signup assigns `CUSTOMER` and `DELIVERY_PARTNER`.
- The browser never submits an arbitrary roles array.
- Signup links or tabs choose an API pathway. The API handler chooses the roles.
- Login tabs express the requested portal. They never grant roles.
- Restaurant permissions for a specific restaurant will later use `restaurant_members`.
- Delivery approval will later use a delivery-partner profile with an approval status.

## Current progress

### Phase 1: Auth schema and platform roles

- [x] Create `profiles`.
- [x] Create `roles`.
- [x] Create `profile_roles` with a composite primary key.
- [x] Preserve the database field name `password`.
- [x] Seed roles idempotently.
- [x] Add `CUSTOMER`.
- [x] Add `RESTAURANT_OWNER`.
- [x] Add `DELIVERY_PARTNER`.
- [x] Add `ADMIN`.
- [x] Add `SUPPORT`.

Status: Complete.

### Phase 2: Transaction-capable database connection

- [x] Change the application driver from `drizzle-orm/neon-http` to `drizzle-orm/neon-serverless`.
- [x] Keep the standalone seed on `neon-http` because it does not need an interactive transaction.
- [x] Verify typecheck, lint, and production build.

Status: Complete.

### Phase 3: Shared registration service

File: `lib/auth/register-profile.ts`

- [x] Define a non-empty server-controlled role input.
- [x] Normalize name, username, and email.
- [x] Remove duplicate requested roles.
- [x] Check for existing email or username.
- [x] Hash the password with Argon2.
- [x] Start a database transaction.
- [x] Look up role IDs by role name.
- [x] Reject missing seeded roles.
- [x] Insert the profile.
- [x] Insert all `profile_roles` relationships.
- [x] Return only safe profile fields.
- [x] Roll back the transaction on failure.
- [x] Use stable duplicate error codes.

Status: Complete and build-verified.

### Phase 4: Route-specific registration APIs

Target structure:

```text
app/api/register/
  customer/
    route.ts
  restaurant/
    route.ts
  delivery/
    route.ts
```

- [ ] Create a working customer registration handler.
- [ ] Validate customer input with `signupFormSchema`.
- [ ] Call `registerProfile()` with `roles: ["CUSTOMER"]`.
- [ ] Translate duplicate service errors into HTTP `409` responses.
- [ ] Return HTTP `201` with the safe profile.
- [ ] Return a generic HTTP `500` for unexpected server failures.
- [ ] Runtime-test profile creation and the `CUSTOMER` relationship.
- [ ] Runtime-test duplicate email and username responses.
- [ ] Create the restaurant registration handler.
- [ ] Assign `CUSTOMER` and `RESTAURANT_OWNER` in the restaurant handler.
- [ ] Create the delivery registration handler.
- [ ] Assign `CUSTOMER` and `DELIVERY_PARTNER` in the delivery handler.

Status: In progress.

Current worktree notes:

- `app/api/register/route.ts` is partially rewritten and does not yet pass roles to `registerProfile()`.
- `app/api/register/customer/route.js` is only a placeholder and contains TypeScript syntax inside a JavaScript file.
- `app/api/register/restraurant/` is misspelled. The target folder is `restaurant/`.
- `app/api/register/deliveryagent/` should be simplified to `delivery/` for consistency.
- New route handlers should use `route.ts`, not `route.js`.
- Do not keep both the root registration handler and route-specific handlers unless the root route intentionally acts as an alias.

### Phase 5: Signup pages and forms

Target pages:

```text
/signup
/signup/restaurant
/signup/delivery
```

- [ ] Make customer signup call `/api/register/customer`.
- [ ] Add a restaurant signup experience.
- [ ] Make restaurant signup call `/api/register/restaurant`.
- [ ] Add a delivery signup experience.
- [ ] Make delivery signup call `/api/register/delivery`.
- [ ] Keep role names out of all request bodies.
- [ ] Handle an existing account by directing the person to login and onboarding.

Status: Pending.

### Phase 6: Portal-aware login UI

- [ ] Add Customer, Restaurant owner, and Delivery partner tabs or links.
- [ ] Represent the selected portal in the URL.
- [ ] Use `customer`, `restaurant`, or `delivery` as the portal value.
- [ ] Keep one email and password form.
- [ ] Keep one login API.
- [ ] Change signup links and success destinations based on the selected portal.

Suggested URLs:

```text
/login?portal=customer
/login?portal=restaurant
/login?portal=delivery
```

Status: Pending.

### Phase 7: Role-aware login API

- [ ] Add the portal value to login validation.
- [ ] Verify email and password.
- [ ] Load all current profile roles.
- [ ] Require `CUSTOMER` for the customer portal.
- [ ] Require `RESTAURANT_OWNER` for the restaurant portal.
- [ ] Require `DELIVERY_PARTNER` for the delivery portal.
- [ ] Return HTTP `401` for invalid credentials.
- [ ] Return HTTP `403` for valid credentials without portal access.
- [ ] Return the correct dashboard destination after successful login.

Status: Pending.

### Phase 8: JWT wiring

- [ ] Install `jose`.
- [ ] Add a strong `JWT_SECRET` environment variable.
- [ ] Create `lib/auth/jwt.ts`.
- [ ] Sign a short-lived access token after successful login.
- [ ] Put the profile ID in the JWT `sub` claim.
- [ ] Add issuer, audience, issued-at, expiry, and token-type claims.
- [ ] Do not put passwords, full profiles, portal selection, or restaurant IDs in the JWT.
- [ ] Keep roles out of the token initially so database role changes take effect immediately.
- [ ] Verify signature, issuer, audience, type, and expiry when reading a token.

Status: Pending.

### Phase 9: Authentication cookie and current profile

- [ ] Store the JWT in an HTTP-only cookie named `foodio_access_token`.
- [ ] Use `secure` in production.
- [ ] Use `sameSite: "lax"`.
- [ ] Use `path: "/"`.
- [ ] Create `lib/auth/current-profile.ts`.
- [ ] Read and verify the JWT cookie.
- [ ] Load safe profile fields and current roles from the database.
- [ ] Return `null` for missing, invalid, or expired authentication.
- [ ] Create `GET /api/auth/me`.

Status: Pending.

### Phase 10: Logout

- [ ] Create `POST /api/auth/logout`.
- [ ] Delete the authentication cookie using the same cookie name and path.
- [ ] Confirm `/api/auth/me` returns HTTP `401` after logout.

Status: Pending.

### Phase 11: Authorization and protected portals

- [ ] Create `requireProfile()`.
- [ ] Create `requireRole()`.
- [ ] Create `requireAnyRole()`.
- [ ] Protect restaurant server pages and APIs.
- [ ] Protect delivery server pages and APIs.
- [ ] Protect admin server pages and APIs.
- [ ] Return HTTP `401` when unauthenticated.
- [ ] Return HTTP `403` when authenticated without permission.
- [ ] Do not rely only on tabs, hidden buttons, redirects, or route interception.

Status: Pending.

### Phase 12: Domain onboarding

- [ ] Add `restaurants`.
- [ ] Add `restaurant_members` with restaurant-specific `OWNER`, `MANAGER`, and `STAFF` membership.
- [ ] Add a delivery-partner details table.
- [ ] Add delivery approval status.
- [ ] Prevent pending delivery partners from receiving orders.
- [ ] Prevent global restaurant roles from granting access to every restaurant.

Status: Pending.

### Phase 13: Authentication hardening

- [ ] Add email verification.
- [ ] Add password reset.
- [ ] Add login and registration rate limiting.
- [ ] Add CSRF protection for authenticated mutations.
- [ ] Add refresh-token sessions and rotation if long-lived login is required.
- [ ] Add server-side session revocation.
- [ ] Add logout from all devices.
- [ ] Add audit logging for privileged role and account changes.

Status: Pending.

## Verification checklist for every phase

Run:

```bash
pnpm typecheck
pnpm lint
pnpm build
git diff --check
```

For database or API phases, also verify the real database result and HTTP status codes. A successful build alone does not prove that registration, role assignment, cookies, or authorization work at runtime.

## Immediate next task

Finish only the customer registration API at:

```text
app/api/register/customer/route.ts
```

It must validate input, call `registerProfile()` with `roles: ["CUSTOMER"]`, map known duplicate errors to HTTP `409`, return HTTP `201` on success, and hide unexpected server details behind a generic HTTP `500` response.
