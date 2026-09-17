# Restaurant onboarding

Owners complete one form with restaurant, business, compliance, location, and bank details. Review validates the entire form without saving it. Owners can return to editing before submitting for approval.

New applications POST to `/api/restaurants`. Existing drafts POST the same payload to `/api/restaurants/[restaurantId]/submit`. Both require a verified restaurant owner account. Existing drafts also require owner membership for the restaurant and a `DRAFT` status.

Submission saves every section and changes the restaurant to `PENDING_REVIEW` in one transaction. New applications check the subscription limit inside that transaction. A profile row lock serializes submissions by the same owner. The existing admin approval queue reads `PENDING_REVIEW` restaurants.

Existing drafts prefill the form, including sections previously marked complete. Old section URLs redirect to the single setup page. Old section-save endpoints return HTTP 410 with a reload instruction. No database migration is required. Section status columns remain for compatibility and are marked complete at submission.

Changes stay in the form while switching between editing and review. Leaving or reloading the page discards changes that have not been submitted. Bank account numbers are masked in review and retained as strings so leading zeros are preserved.

## Tests

Run `pnpm test:onboarding` with Node.js 22.3 or newer. The suite uses Node's experimental module mocking and an isolated PGlite database. It applies the repository's migrations and never connects to the configured database.

Coverage includes complete submissions, draft updates, optional registration removal, ownership, repeated draft submission, subscription limits, rollback, request authentication, and validation.
