# How adding menu items works

This feature lets a restaurant owner add 1 to 50 dishes in one save. You fill in the form, the server checks your permission and dish details, and the database saves the dishes.

Saving adds new dishes. It does not replace the existing menu, edit an existing dish, or approve the restaurant.

This guide describes the current code. The ownership helper still lives in `checks/restaurant.ts`. Moving it into `commands.ts` was discussed but has not been done.

Read the guide in order, or jump to a part:

- [Opening the page](#1-opening-the-page)
- [Finding the logged-in account](#2-finding-the-logged-in-account)
- [Filling in the form](#3-filling-in-the-form)
- [Submitting the form](#4-clicking-submit-menu-items)
- [The save API](#5-the-save-api)
- [Ownership and saving](#6-ownership-and-saving)
- [Replies and errors](#7-replies-and-errors)
- [What is not included](#8-what-is-not-included-yet)
- [Checking it works](#9-checking-it-works)

## The full flow

```text
Open your restaurant's menu page
  → Check your account and restaurant ownership
  → Read saved dishes
  → Show MenuForm and the saved list

Fill in dishes and click Submit menu items
  → form.handleSubmit()
  → Validate the form
  → MenuForm's onSubmit callback
  → Remove form-only IDs
  → fetch POST /api/restaurants/:restaurantId/menu/add
  → POST handler
      → requireMenuOwnerAccount()
          → currentProfile()
              → Read login cookie and verifyAccessToken()
              → Read profile and account roles
      → checkRestaurantId()
      → readMenuInput()
          → request.json()
          → menuBatchSchema.safeParse()
      → addMenuItems()
          → db.transaction()
              → requireRestaurantOwner()
              → Insert dishes
              → Mark menu setup COMPLETED
      → Response.json()
  → Form reads the reply
      → Success: clear drafts and refresh saved dishes
      → Failure: show a message and keep your entries
```

The form runs in the browser. The page, account checks, API handler, and database calls run on the server.

`import "server-only"` in the backend files prevents them from being imported into browser code. It does not check whether the user is logged in; the account functions do that.

## Where the code lives

| File | Its job |
| --- | --- |
| [Dashboard layout](/Users/ana/Development/FOODIO/app/(pages)/dashboard/layout.tsx) | Checks login and verified email, then shows the sidebar and dashboard frame. |
| [Menu page](/Users/ana/Development/FOODIO/app/(pages)/dashboard/restaurants/[restaurantId]/menu/page.tsx) | Checks page access and shows the form and saved dishes. |
| [Menu form](/Users/ana/Development/FOODIO/components/menu/menu-form.tsx) | Holds draft dishes, handles inputs, and sends the save request. |
| [Form options](/Users/ana/Development/FOODIO/components/menu/menuFormData.tsx) | Lists food types, cuisines, and serving times shown in the form. |
| [Save API](/Users/ana/Development/FOODIO/app/api/restaurants/[restaurantId]/menu/route.ts) | Runs checks, calls the save function, and returns a reply. |
| [Original API URL](/Users/ana/Development/FOODIO/app/api/restaurants/[restaurantId]/menu/add/route.ts) | Reuses that POST handler for the form's `/menu/add` URL. |
| [Account check](/Users/ana/Development/FOODIO/lib/menu/checks/account.ts) | Requires a logged-in, verified restaurant owner account. |
| [Restaurant checks](/Users/ana/Development/FOODIO/lib/menu/checks/restaurant.ts) | Checks the ID format and ownership of the requested restaurant. |
| [Request check](/Users/ana/Development/FOODIO/lib/menu/checks/request.ts) | Reads JSON and checks all dish details. |
| [Check error](/Users/ana/Development/FOODIO/lib/menu/checks/error.ts) | Carries an error message and HTTP status to the API handler. |
| [Save function](/Users/ana/Development/FOODIO/lib/menu/commands.ts) | Saves dishes and menu setup progress together. |
| [Read function](/Users/ana/Development/FOODIO/lib/menu/queries.ts) | Reads a restaurant's saved dishes for its owner. |
| [Server validation](/Users/ana/Development/FOODIO/lib/menu/schema.ts) | Defines the request fields and values the server accepts. |
| [Server options](/Users/ana/Development/FOODIO/lib/menu/constants.ts) | Lists option values accepted by server validation. |
| [Current account](/Users/ana/Development/FOODIO/lib/auth/current-profile.ts) | Reads the login cookie and finds the profile and account roles. |
| [Token verification](/Users/ana/Development/FOODIO/lib/auth/jwt.ts) | Checks whether the login token is valid. |
| [Database tables](/Users/ana/Development/FOODIO/lib/db/schema/schema.ts) | Defines memberships, dishes, and setup progress. |

[form-values.ts](/Users/ana/Development/FOODIO/components/menu/form-values.ts) also exists. It defines a form schema, defaults, test details, and serving-time helper, but the current `MenuForm` does not import it. The active form still defines those values and helpers inside `menu-form.tsx`.

## 1. Opening the page

### `DashboardLayout()`

The layout calls `currentProfile()` to find the logged-in account. No account means redirect to login. An unverified email means redirect to email verification.

It then renders the sidebar and `children`, which means the page inside the dashboard.

This helps with navigation and shared UI. It does not replace API checks. Someone can send a request directly to the API without opening the dashboard.

### `MenuPage({ params })`

The `[restaurantId]` part of the URL captures the restaurant ID. `await params` gets that ID. `await` means wait for a result before continuing.

The page runs these calls:

1. `restaurantIdSchema.safeParse(restaurantId)` checks UUID format, the long ID format used for restaurants. A bad ID calls `notFound()`, which shows a 404 page.
2. `currentProfile()` gets the current account.
3. `redirect()` sends users without a login to restaurant login, users without a verified email to verification, and accounts without `RESTAURANT_OWNER` to the home page.
4. `encodeURIComponent(returnTo)` makes the menu URL safe to put inside the login or verification URL. `returnTo` tells those pages where to send the user afterwards.
5. `getMenuForOwner(profile.id, restaurantId)` checks ownership and reads dishes. A `null` result calls `notFound()`.
6. `<MenuForm restaurantId={...} restaurantName={...} />` gives the form the restaurant it should save to. The name is for display.

`data.items.map()` turns each saved dish into a list row. The row shows its name, vegetarian status, visibility or availability, and price.

`new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })` creates a rupee formatter. `priceFormatter.format(item.priceInPaise / 100)` converts paise back to rupees and formats the price.

An inactive dish shows `Hidden`. An active dish shows `Available` or `Unavailable`, depending on `isAvailable`.

### `getMenuForOwner(profileId, restaurantId)`

This reads data. It does not save anything.

The first query connects `restaurants` to `restaurantMembers` using `innerJoin()`. In simple words, it finds a restaurant with a matching membership record.

The query requires the requested restaurant, the given profile, and an `OWNER` role to match on the joined result. `.limit(1)` asks for at most one result. `const [restaurant]` takes the first result from the returned array.

No result means return `null`. The caller cannot tell whether the restaurant is missing or belongs to someone else.

If ownership matches, a second query reads that restaurant's dishes. `.orderBy(asc(menuItems.id))` sorts them by ID, smallest first. The function returns `{ restaurant, items }`.

## 2. Finding the logged-in account

### `currentProfile()`

The page and API both use this function. They do not trust a profile ID sent by the browser.

1. `cookies()` reads cookies from the incoming request.
2. `cookieStore.get("foodio_access_token")?.value` gets the login token. The `?.` makes a missing cookie give `undefined` rather than an error.
3. No token means return `null`.
4. `verifyAccessToken(token)` checks the token. A failed verification means return `null`.
5. A profile query looks up the account using the verified token's profile ID. A missing profile means return `null`.
6. Another query connects `profileRoles` to `roles` and reads the account's current roles.
7. `.map((row) => row.role)` turns those rows into a list such as `["RESTAURANT_OWNER"]`.
8. The function returns profile fields, the verified-email date, and roles.

React's `cache()` wraps this function so repeated calls during the same server render can reuse its result. It is not a shared login cache between users or a substitute for checking later requests.

### `verifyAccessToken(token)`

`jose.jwtVerify()` checks the token's signature, allowed algorithm, issuer, audience, and required claims, including expiry. The function also checks that this is an access token and the profile ID is a safe whole number.

It returns `{ authentication: true, profileId }` on success, or `{ authentication: false }` on failure.

Verification uses `JWT_SECRET` on the server. A missing secret is a configuration error. Signing tokens and setting login cookies happen in the login flow, not when saving dishes.

## 3. Filling in the form

### `MenuForm()` and its starting values

`"use client"` lets the form use browser events and React state.

- `useId()` gives the first draft a stable form ID.
- `useRouter()` gives access to `router.refresh()` after saving.
- `useState()` stores success or error feedback. `setMessage()` changes it.
- `emptyMenuItem(formId)` creates a blank draft with default values.
- `useForm()` holds draft values, validates them, and runs the save callback.

`emptyMenuItem()` starts with blank name and description text, a ₹100 price, all three switches on, no food types, North Indian cuisine, lunch and dinner, and no calorie value.

`formId` keeps draft cards distinct while adding, removing, or duplicating them. `key={item.formId}` helps React identify each card. It is not a database dish ID and is removed before saving.

In `useForm({ defaultValues, validators, onSubmit })`:

- `defaultValues` starts the form with one draft.
- `validators.onSubmit` checks the whole form using `menuFormSchema` before the save callback runs.
- `onSubmit` sends valid values to the API.

There is no `useMenuForm` custom hook in the current implementation.

### Entering values

`<form.Field name={...}>` connects an input to a form value. `menuItems[0].name` means the first dish's name.

- `field.state.value` is the current value shown in the input.
- `field.handleChange(newValue)` updates it when you type or select something.
- `field.handleBlur()` marks a field as touched when you leave an input wired to that callback.
- `field.state.meta.errors` holds validation errors.
- `<FieldError errors={...} />` displays those errors.

Some fields have `onChange` validators for quick feedback. The full schema checks all fields at submission. For example, the small price validator checks a positive price, while the submit schema also checks decimal places and minimum and maximum values.

`Number(e.target.value)` converts price and calorie input text into numbers. Empty calories become `null`, meaning no value was entered.

The cuisine select shows one choice but stores an array such as `["ITALIAN"]`. Food type and serving time toggle groups allow multiple choices. Switches call `field.handleChange()` with `true` or `false`.

`Card`, `Field`, `Input`, `Select`, `Switch`, and `Button` draw the UI. They do not check ownership or write dishes to the database.

### `addItem()`

`form.getFieldValue("menuItems")` reads the draft list. At 50 drafts, the function stops. Otherwise, `crypto.randomUUID()` creates a new form ID, `emptyMenuItem()` creates a blank draft, and `form.pushFieldValue()` adds it to the end.

### `removeItem(index)`

`form.removeFieldValue("menuItems", index)` removes the draft at that position. Positions start at zero, so index `0` is Dish 1.

The Remove button is disabled when only one draft remains. Removing a draft does not delete a saved dish.

### The Duplicate button callback

The callback reads the selected draft and stops if it is missing or there are already 50 drafts.

`form.insertFieldValue()` inserts a copy immediately after it. The copy gets a new `formId` and new copies of its food type, cuisine, and timing arrays. The drafts do not share those same array objects.

Duplicating does not save anything yet. Both drafts are saved on submission.

### `normalizeAvailability(previous, next)`

This keeps All day separate from individual serving times.

- Just selected `ALL_DAY`: return only `["ALL_DAY"]`.
- Otherwise: remove `ALL_DAY` from the next selection and keep the individual times.

Selecting All day while Lunch and Dinner are selected replaces both with All day. Selecting Lunch after All day switches to Lunch. An empty selection is possible while editing, but validation rejects it at submission.

### `formatMenuItemOption(option)`

This changes labels for display. `.toLowerCase()` lowers the text, `.replaceAll("_", " ")` replaces underscores with spaces, and `.replace()` with `.toUpperCase()` capitalizes each word's first letter.

`NORTH_INDIAN` becomes `North Indian` on screen. The stored value remains `NORTH_INDIAN`.

The form and server have separate option lists. Keep `menuFormData.tsx` and `lib/menu/constants.ts` aligned when adding options. `AvailabilitySelection` in the form options file describes allowed selections for TypeScript; it does not replace runtime validation.

### `fillTestDetails()`

The development-only Fill test details button clears feedback and fills the first draft with sample Margherita Pizza values. It keeps that draft's ID and any remaining drafts.

`form.setFieldValue()` replaces the list. This button does not save anything and is hidden outside development.

### `form.Subscribe`

This watches selected form state and updates the UI using it. `state.isSubmitting` says whether submission is running. The fieldset and test-fill button are disabled while submitting.

Another subscription watches `canSubmit` and `isSubmitting` for the submit button. That button also needs a `restaurantId`. The `/test` page renders `<MenuForm />` without one, so it is a preview with saving disabled.

## 4. Clicking Submit menu items

The HTML form's submit callback calls `event.preventDefault()` to stop normal browser page submission. `event.stopPropagation()` stops the event reaching parent handlers.

It stops if submission is already running. Otherwise, `form.handleSubmit()` starts validation and submission. `void` before the call means the event callback is not waiting for its promise; validation still runs.

`noValidate` turns off built-in browser form validation. TanStack Form and Zod handle validation instead.

### The form's `onSubmit({ value })` callback

After validation passes:

1. `setMessage(undefined)` clears earlier feedback.
2. A missing `restaurantId` shows an error and stops.
3. `value.menuItems.map(({ formId: _formId, ...item }) => item)` removes each form-only ID. `...item` means keep the other dish fields.
4. `JSON.stringify({ menuItems })` converts the request object into JSON text.
5. `fetch()` sends that text to `/api/restaurants/${restaurantId}/menu/add` using POST. The header says the body is JSON. This same-origin request uses the login cookie through normal browser cookie handling.
6. `response.json()` reads the server's JSON reply.
7. The callback checks `response.ok` for HTTP success and `result.success` for success in the reply body.

On an error reply, it shows the message and keeps drafts. It can display up to three optional `issues` strings, but the current API sends a simple error without those details.

On success, `form.reset()` replaces submitted drafts with one new blank draft. `setMessage()` shows the saved count. `router.refresh()` requests updated server-rendered page data so the saved list can show the new dishes. Refreshing does not send another save.

If fetching or reading the reply throws, `catch` keeps entries and says the save could not be confirmed. The server might already have saved them. Check the saved list before retrying.

## 5. The save API

### The `/menu/add` route

`export { POST } from "../route"` reuses the main menu route's handler. It does not make a second HTTP request or save twice.

Both `/api/restaurants/:restaurantId/menu` and `/api/restaurants/:restaurantId/menu/add` run the same handler.

### `POST(request, { params })`

`request` contains the incoming body and headers. `params` contains the restaurant ID from the URL.

1. `requireMenuOwnerAccount()` checks the logged-in account and returns its profile.
2. `await params` reads the restaurant ID.
3. `checkRestaurantId(restaurantId)` checks its format.
4. `readMenuInput(request)` reads and validates dish details.
5. `addMenuItems(profile.id, validRestaurantId, input)` checks ownership and saves.
6. `Response.json({ success: true, createdCount }, { status: 201 })` sends success.

The profile ID comes from the session. The restaurant ID comes from the URL and is checked against that profile's membership. Neither comes from the dish body.

### `requireMenuOwnerAccount()`

This calls `currentProfile()`. No account throws a `401` error. Unverified email or a missing `RESTAURANT_OWNER` account role throws a `403` error. Passing both checks returns the profile.

It proves you have a verified restaurant owner account. It does not prove you own this particular restaurant. That is checked inside the save.

### `checkRestaurantId(restaurantId)`

`restaurantIdSchema.safeParse()` checks UUID format. `safeParse()` gives a result with `success: true` and checked data, or `success: false` and validation errors.

A bad ID throws `MenuCheckError(400, "Invalid restaurant ID.")`. A valid ID is returned. Correct format does not mean the restaurant exists or belongs to you.

### `readMenuInput(request)`

`request.json()` reads JSON text and converts it into a JavaScript value. `.catch(() => null)` makes malformed JSON become `null` and fail the next check.

`menuBatchSchema.safeParse(body)` validates the whole batch. Any invalid dish rejects the request before the save function runs.

Failure throws `MenuCheckError(400, "Check the menu details and try again.")`. Success returns `result.data`, including trimmed name and description text.

There is no custom request-byte limit, separate content-type check, or detailed field-error map. The whole body is read before validation. The schema still limits the batch to 50 dishes.

### What the schemas check

The active form defines its own `menuItemSchema` and `menuFormSchema`. The server defines `menuItemSchema` and `menuBatchSchema` in `lib/menu/schema.ts`.

Browser checks help users fix mistakes. Server checks protect the API because someone can bypass the form and send a request directly.

| Field | Accepted value |
| --- | --- |
| `menuItems` | A list of 1 to 50 dishes. Every dish must pass. |
| `name` | Trimmed text with 1 to 120 characters. |
| `description` | Trimmed text with at most 2,000 characters. Empty text is allowed. |
| `priceInRupees` | A number from ₹0.01 to ₹21,474,836.47 with at most two decimal places. |
| `isVeg` | `true` or `false`. |
| `isAvailable` | `true` or `false` for availability. |
| `isActive` | `true` or `false` for being active on the menu. |
| `foodTypes` | At least one allowed food type, such as `ROLLS`. |
| `cuisines` | At least one allowed cuisine, such as `NORTH_INDIAN`. |
| `timings` | At least one allowed time. `ALL_DAY` must be used alone. |
| `caloriesKcal` | `null` or a whole number from 0 to 2,147,483,647. |

All dish fields must be present in the API body, even when description is empty or calories are `null`. The server also caps each option array's length at the number of available options.

The Zod calls mean:

- `z.strictObject()` describes an object and rejects unknown fields. Extra `profileId`, `restaurantId`, or `formId` fields are rejected.
- `z.object()` defines the active form's objects. Those include the form-only `formId`; the API's strict objects do not.
- `z.string()`, `z.number()`, and `z.boolean()` check types without converting text into numbers or booleans.
- `.trim()` removes spaces at the start and end of text.
- `.min()` and `.max()` set length or numeric limits.
- `z.array()` requires a list. `z.enum()` limits options to listed values.
- `.int()` requires a whole number. `.nullable()` also allows `null`.
- `.refine()` adds custom rules for decimal places and All day selections.
- `z.infer` creates a TypeScript type from a schema. It does not validate incoming data by itself.

`MenuBatchInput` describes validated save input. `MenuSaveResponse` describes success or error replies for TypeScript. `as MenuSaveResponse` in the form is a type assertion, not runtime validation of the reply.

## 6. Ownership and saving

### `addMenuItems(profileId, restaurantId, input)`

This takes the profile ID, restaurant ID, and already-validated dish details.

`db.transaction(async (transaction) => { ... })` groups the ownership check and both writes. In plain words, save everything together or undo the writes if something fails.

`transaction` is the database object for this group of work. Calls through it use the same transaction.

The shared `db` comes from [drizzle.ts](/Users/ana/Development/FOODIO/lib/db/drizzle.ts). Its `databaseUrl()` function reads `DATABASE_URL` and throws if it is missing. `drizzle(databaseUrl())` creates the database client used for queries and transactions. This setup runs when the module loads, not separately for each draft dish. Database connection details stay on the server.

First, `requireRestaurantOwner(transaction, profileId, restaurantId)` checks permission. An error stops the save before dishes are inserted.

### `requireRestaurantOwner(transaction, profileId, restaurantId)`

The membership table records which profile belongs to which restaurant and their role there. The query asks for a row matching all these conditions:

```sql
WHERE profile_id = the_logged_in_profile_id
  AND restaurant_id = the_requested_restaurant_id
  AND role = 'OWNER'
```

Each call has a job:

- `.select({ role: restaurantMembers.role })` asks for the role column rather than the whole record.
- `.from(restaurantMembers)` chooses the membership table.
- `eq(column, value)` builds an SQL equality check.
- `and(...)` requires every condition to match on the same row. It builds SQL; JavaScript `&&` cannot replace it.
- `.where(...)` applies those conditions.
- `.for("share")` locks matching membership rows until the transaction ends. It is not a loop.
- `await` waits for the result.
- `const [ownerMembership]` takes the first row from the result array. No match gives `undefined`.

No match throws `404, "Restaurant not found."`. Staff, managers, and owners of other restaurants fail this check. The same response covers a missing restaurant and one you cannot access.

`NeonTransaction<EmptyRelations>` tells TypeScript what kind of database object is passed in. It does not start another transaction or run another check.

The helper returns no data on success. Finishing without throwing means the save can continue.

### Why `.for("share")` is there

Suppose you own Foodio Café and are saving a burger. Another request is trying to remove your ownership at the same time.

Without the lock, you could pass the check, lose ownership, then still save using the earlier result.

With the lock, changing or deleting that matched membership must wait until your save transaction finishes. Other requests can still read it. This does not lock the whole menu or all membership records.

The ownership conditions prevent changes to someone else's restaurant. The lock adds protection against simultaneous requests. Normal saves work without it, but that timing gap remains. A normal read inside a transaction does not lock the row this way. See [PostgreSQL's row-lock explanation](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-ROWS).

### Inserting dishes

Back in `addMenuItems()`, `input.menuItems.map()` turns each dish into a database row. The code lists supported columns explicitly rather than copying the entire request.

Every row gets the checked restaurant ID from the server call. `description: item.description || null` stores an empty description as `null`.

`Math.round(item.priceInRupees * 100)` converts rupees into whole paise. ₹19.99 becomes `1999`. Validation has already checked decimal places and size. The database stores prices in an integer paise column.

Flags, food types, cuisines, timings, and calories go into matching columns. The database creates dish IDs and default timestamps.

`transaction.insert(menuItems).values(rows)` inserts the batch. `.returning({ id: menuItems.id })` returns created IDs. `created.length` gives the saved count returned to the API.

### Updating setup progress

`transaction.insert(restaurantSetupStatus)` writes `menuItemsStatus: "COMPLETED"` for the restaurant.

No existing setup row means create one. `.onConflictDoUpdate()` handles an existing row for the same restaurant by updating only menu status. Other setup sections stay unchanged.

Both writes use the same transaction. If inserting dishes works but updating progress fails, the dish inserts are undone. On success, the transaction commits before the API returns success.

`COMPLETED` means menu setup progress. It does not approve or publish the restaurant or check a subscription. This flow allows verified owners to add dishes regardless of restaurant approval status.

## 7. Replies and errors

### `MenuCheckError(status, message)`

This is an error carrying an HTTP status. `super(message)` stores its message using JavaScript's built-in `Error` class.

`throw new MenuCheckError(...)` stops the current work. The error goes back through awaited calls to the POST handler's `catch`. If thrown inside the transaction, that transaction fails too.

The checks folder contains ordinary functions, not middleware. They return checked data or stop the save by throwing.

### The POST handler's `catch`

`error instanceof MenuCheckError` identifies expected validation and permission errors. `Response.json()` sends their status and message.

Unexpected failures call `console.error()` to log details on the server. The browser gets a generic 500 message, not internal database details.

| Status | What it means here |
| --- | --- |
| `201` | Dishes and menu setup progress were saved. |
| `400` | Invalid ID format, JSON, or dish details. |
| `401` | No valid logged-in account. |
| `403` | Verified email and a restaurant owner account role are required. |
| `404` | No owner membership matches this profile and restaurant. |
| `500` | Unexpected server or database failure. |

Example request body after form IDs are removed:

```json
{
  "menuItems": [
    {
      "name": "Paneer roll",
      "description": "",
      "priceInRupees": 19.99,
      "isVeg": true,
      "isAvailable": true,
      "isActive": true,
      "foodTypes": ["ROLLS"],
      "cuisines": ["NORTH_INDIAN"],
      "timings": ["LUNCH"],
      "caloriesKcal": null
    }
  ]
}
```

Success reply:

```json
{ "success": true, "createdCount": 1 }
```

Invalid body reply:

```json
{ "success": false, "error": "Check the menu details and try again." }
```

## 8. What is not included yet

- Editing, deleting, archiving, or changing availability of saved dishes.
- Dish image uploads.
- Approving or publishing restaurants.
- Preventing duplicate dishes on a retried save. There is no idempotency key, which would identify repeated attempts as the same save.
- A custom request-byte limit or detailed server field errors.

Hidden and unavailable flags are saved as data. This owner form and saved list do not implement customer ordering rules.

## 9. Checking it works

Run these from the project folder:

```sh
pnpm typec
pnpm l
pnpm b
```

`typec` checks TypeScript. `l` runs Biome checks. `b` builds the Next.js application.

`package.json` also has a `test:menu` script pointing to `tests/menu-checks.test.mjs`, but that file is currently absent. The script cannot run until the test file is restored or replaced. The earlier menu tests used an in-memory PGlite database, not the live Neon database, and replaced `currentProfile()` with test accounts rather than testing real login cookies.

For a browser check with a real owner account:

1. Open your restaurant and select Manage menu.
2. Add, duplicate, and remove drafts. Confirm fields and switches affect the right dish.
3. Try an empty name, no food type, and a price with three decimal places. Submission must fail.
4. Save valid dishes. Check the success message, blank draft, and updated saved list. Reload and check again.
5. Block the request in browser developer tools. Confirm failed saves keep your entries.
6. Try another owner's restaurant ID. The page and API must reject access.

This browser walkthrough needs a real owner session. Type checking, linting, or building alone does not verify it.
