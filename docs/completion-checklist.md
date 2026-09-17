# FoodIO completion checklist

Reviewed on 7 September 2026 against the current working tree and the database configured in `.env`.

FoodIO currently has the beginnings of a restaurant management product. The strongest implemented area is restaurant registration and approval. To present it as a finished food ordering portfolio project, complete the journey from restaurant discovery to a fulfilled order.

This is my hiring review judgment, not a claim that every recruiter expects the same feature set. I would value a small, reliable product with clear engineering decisions more than a long list of unfinished portals.

## What I inspected

- App pages, API routes, authentication, restaurant access checks, onboarding, admin approval, menu form, pricing, database schema, migrations, seeds, README and project notes.
- Read-only database queries for table names, aggregate row counts and restaurant statuses. No personal records or bank details were retrieved.
- `pnpm typec` and `pnpm l`. Both currently fail. I did not run a production build or browser walkthrough, so visual quality and runtime flows remain unverified.
- Existing uncommitted work is included in this assessment. The menu route and page are untracked work in progress.

## What already exists

| Area | Evidence and current limit |
| --- | --- |
| Authentication | Password hashing with Argon2, signed JWT cookies, role checks, email verification and rate limiting code exist. Account recovery and session renewal still need attention. |
| Multiple restaurants | Restaurant creation inserts the restaurant, owner membership and setup status in a transaction. Subscription limits are checked before creation. |
| Onboarding | Basic details, map coordinates, business details, compliance registrations, bank details and section progress have schema and routes. |
| Admin review | Admins can approve or reject pending restaurants. The update checks that the restaurant is still pending. |
| Menu model | Integer paise prices, vegetarian status, availability, cuisines, food types and serving times are represented in the database. |
| Customer page | Reads the menu for one fixed seeded restaurant. It is a catalogue, with no ordering controls. |
| Delivery | Role-specific login and a placeholder dashboard exist. |
| Plans | Pricing tiers and per-profile subscription limits exist. This is not a complete billing system. |

The connected database contains 13 public tables, 5 profiles, 3 restaurants, 17 menu items, 3 restaurant memberships and 3 subscriptions. Two restaurants are drafts and one is active. These counts do not establish data correctness or imply every profile needs a subscription.

## Required before calling the ordering build complete

Work through these in order. Each item includes a practical completion check.

### 1. Restore a passing baseline

- [ ] Finish the menu API. It references an undefined `createRestaurantSchema`, does not insert menu items, and has no success response. Replace the copied restaurant-creation checks with menu validation and authorization for the restaurant in the URL.
- [ ] Connect the menu form to the API. Its submit handler currently calls `console.log` only. Pass the restaurant ID, show errors, prevent duplicate submission and show saved results.
- [ ] Clear TypeScript and Biome failures, then run the production build. Current Biome output reports 3 errors and 2 warnings, mostly formatting, import ordering and unused menu styles.

Done when a valid menu submission persists after refresh, unauthorized writes fail, and `pnpm typec`, `pnpm l` and `pnpm b` pass.

### 2. Finish restaurant menu management

- [ ] Load existing dishes and support create, edit, archive and availability toggles.
- [ ] Validate prices on the server and convert rupees to integer paise consistently. Keep historical orders independent of later dish edits.
- [ ] Add restaurant and dish images with a fallback. A simple controlled upload is enough; a media management system is unnecessary.
- [ ] Decide when menus are required. Currently submission checks four onboarding sections and excludes menu status. Require at least one orderable dish before customers can order.

Done when an owner can maintain the menu without a seed script and customers see the saved changes.

### 3. Build restaurant discovery

- [ ] Replace the hardcoded FoodIO Kitchen lookup with a list of active restaurants and a public detail page for each restaurant.
- [ ] Add search by restaurant or dish, cuisine and vegetarian filters, and pagination or a bounded result list.
- [ ] Add opening hours and an explicit open or closed state. Choose one supported city or service area for version one.
- [ ] Enforce restaurant visibility on the server. The current demo lookup does not filter restaurant status.
- [ ] Cover no results, an empty menu, a missing restaurant and a failed request.

Done when a visitor can find several restaurants, inspect a menu and understand whether ordering is available.

### 4. Add cart and checkout

- [ ] Support adding dishes, changing quantities, removing dishes and restoring a cart after refresh. A browser-persisted cart is sufficient.
- [ ] Limit each cart to one restaurant and explain what happens when switching restaurants.
- [ ] Collect an address and contact details. Offer saved addresses if keeping delivery in scope.
- [ ] Show a clear item subtotal, any delivery fee and the final total.
- [ ] Recalculate all amounts on the server and recheck restaurant status, item availability and prices at checkout.
- [ ] Use cash on delivery or an explicitly labelled simulated payment. Real payment integration is optional for this portfolio scope.

Done when a customer can place an order and receives a persistent order ID. Changing prices in a browser request must not change the charged total.

### 5. Complete the order lifecycle

- [ ] Persist orders and order items in one transaction. Store purchased item names, unit prices, quantities, totals and the delivery address as historical snapshots.
- [ ] Define permitted transitions, such as placed, accepted, preparing, out for delivery and delivered, with rejected and cancelled outcomes.
- [ ] Give owners an order queue with details and valid status actions.
- [ ] Give customers order history and a status page. Polling is sufficient for version one.
- [ ] Add cancellation rules and a reason for rejection or cancellation.
- [ ] Make repeated checkout requests create at most one order. Guard concurrent status changes so stale actions cannot overwrite newer states.
- [ ] Keep a timestamped order event history with the actor who changed the status.

Done when two browser sessions can demonstrate a customer placing an order and an owner fulfilling it, including rejection and retry cases.

### 6. Close the onboarding loop

- [ ] Store the reviewer, review time and rejection reason. Show the reason to the owner.
- [ ] Allow a rejected restaurant to correct its details and resubmit. Current edit and submission routes require `DRAFT`, while rejection changes status to `REJECTED`.
- [ ] Define which active restaurant details can change directly and which require review.
- [ ] Choose whether compliance is a demo declaration or an actual document-review feature. Current storage records registration numbers, not uploaded documents. Describe this honestly in the UI.
- [ ] Add a minimal suspension action if retaining `SUSPENDED`, and make it block discovery and checkout.

Done when a restaurant can move through rejection, correction, approval and publication without database edits.

### 7. Prove access control and failure handling

- [ ] Check restaurant membership on every restaurant mutation, including menus and orders. Owner A must never modify owner B's restaurant by changing a URL.
- [ ] Restrict customers to their own orders and keep admin review actions admin-only.
- [ ] Add password reset and a deliberate session-expiry experience. Access tokens currently expire after 10 minutes, with no renewal flow found.
- [ ] Preserve form work on recoverable errors and provide useful loading, empty and retry states.
- [ ] Remove sensitive values from logs and mask bank details where full values are unnecessary. Use fictional financial and compliance information in the demo.

Done when explicit negative tests cover cross-account access, expired sessions, malformed requests and repeated actions.

### 8. Package a reviewable release

- [ ] Add focused automated tests for checkout totals, duplicate submissions, order transitions, authorization and approval resubmission.
- [ ] Add one end-to-end test for the customer-to-owner ordering journey.
- [ ] Add CI for type checking, linting, tests and a build with documented environment requirements.
- [ ] Verify keyboard navigation, form labels and mobile layouts. The menu form currently repeats switch IDs and has labels targeting different IDs.
- [ ] Deploy a stable demo with fictional data and a safe way to try customer, owner and admin roles.
- [ ] Replace the README task notes with setup instructions, environment variable explanations, migration and seed commands, screenshots, an architecture diagram and a short demo script.
- [ ] Document what is simulated and deliberately out of scope. Hide placeholder actions from the main demo journey.

Done when someone unfamiliar with the repository can run it and demonstrate the core flow without asking you to repair data or explain missing buttons.

## Database work to include

The existing schema has useful foreign keys, composite membership keys, unique compliance types and integer menu prices. Preserve those choices.

| Change | Why it is needed |
| --- | --- |
| Add `orders`, `order_items` and `order_events` | These are absent from the live table inventory and local schema. They support checkout, historical prices and status history. |
| Add customer addresses or an order address snapshot | Address changes must not rewrite the destination of an existing order. A saved-address table is optional; the snapshot is required for delivery. |
| Add checkout idempotency uniqueness | Retried requests must not create duplicate orders. Scope the key to the customer. |
| Add review decision records | Current approval only updates restaurant status. Preserve reasons and the reviewing actor. |
| Add hours and image references | Neither is currently represented as a complete feature in the schema. |
| Add database checks | Enforce valid price and quantity ranges, nonnegative limits and valid coordinate ranges. Application validation alone does not protect every write path. |
| Add indexes for actual queries | Start with restaurant status, member lookup by profile, menu lookup by restaurant and order history by customer or restaurant and time. Verify plans before adding more. |
| Make quota checks safe under concurrency | The restaurant count is checked before the creation transaction. Concurrent requests can both pass. Serialize creation per owner or use another atomic enforcement strategy. |
| Reconcile subscription rules | Notes describe different limits from `pricing-teirs.ts`. Document units and whether subscription limits are deliberate overrides or copies of tier defaults. |
| Verify migration upgrades | A recent migration adds a non-null restaurant limit without a default. Test an upgrade against a populated disposable database and add a backfill where required. |
| Define deletion rules for orders | Cascading deletion suits some setup records. Historical order records should survive menu archival and have an explicit restaurant/account deletion policy. |

Do not convert every numeric ID to UUID merely for appearance. Either can work. Authorization and database constraints matter more.

## Useful additions after the core flow

- [ ] Reviews limited to completed orders, with one review per order and basic moderation. This adds a useful integrity rule and makes discovery richer.
- [ ] A small owner dashboard showing real order counts, sales totals and popular dishes, with clear treatment of cancellations and simulated payments.
- [ ] Reordering, with current availability and prices checked again.
- [ ] Staff invitations and role-specific permissions if you want restaurant operations to be a major part of the portfolio. The schema has manager and staff roles, but the inspected restaurant access helper admits owners only.

I would choose one or two of these after the required checklist passes.

## Deliberately leave out of version one

Live GPS tracking, automatic driver assignment, route optimization, multi-restaurant carts, real money settlement, subscription billing, coupons, loyalty points, recommendation engines, franchise rules, a spreadsheet-style CMS and Android packaging can wait. A handful of varied restaurants is enough for the demo; 100 seeded listings does not compensate for missing checkout.

If delivery is important to your story, add manual assignment and a partner accepting, picking up and completing a delivery. Otherwise, hide the placeholder delivery portal and label fulfillment as simulated.

## Release demonstration

1. An owner creates a restaurant, saves its menu and submits it.
2. An admin rejects it with a reason; the owner corrects it and resubmits.
3. The admin approves it and it becomes discoverable.
4. A customer searches, adds dishes and places an order.
5. The owner accepts and progresses the order; the customer sees each update.
6. A repeated checkout request creates no duplicate, and another account cannot access the order.
7. The app passes its checks and a new developer can reproduce the demo from the README.

When this works on the deployed app, I would call the reduced-scope FoodIO ordering build complete. Reviews, billing and live delivery can become separate releases.
