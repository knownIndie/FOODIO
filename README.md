## App packaging and research

- [x] Research how to package the Next.js frontend as an Android APK.
  - [x] Review [Capacitor](https://capacitorjs.com/).
  - [x] Review the [Next.js Progressive Web Apps guide](https://nextjs.org/docs/app/guides/progressive-web-apps).

### Docker setup questions

- [x] Decide whether Docker should continue using the hosted Neon database and Redis, or run local database and Redis services.
  - setup everything locally -> docker [ plugin ans everything]
- [ ] Define what a one-command startup should boot and document that command.

## This week

- [x] Allow one owner to manage multiple restaurants.
- [x] make maps interactive accordinf to sid req [ coudn't figure it out ]
- [ ] make the multiple steps for restaurant to work
- [ ] ask if we want the auto approve after 24 h { given we have all the provided docs }or manual review
- [ ] get docker work

## Restaurant onboarding
[later]
- [ ] aLLOW Upload a restaurant logo.
- [x] Collect address details.
- [ ] Explore the 15 km radius and franchise behavior.[later]
- [ ] Add menu photo uploads.
- [ ] Capture availability for breakfast, lunch, and dinner.
- [ ] Capture item prices.
- [ ] Build a Google Sheets-like CMS for managing dishes and prices.

## Database design

- [?] Review and finalize the restaurant database design.
- [x] Start with basic restaurant information.
- [x] Link each restaurant to the creating profile and its role.
- [x] Add the creator as the restaurant owner inside a database transaction.
- [x] Support one owner having multiple restaurants.
- [working] make editing each part of the regestration work in different form in its own setting page

## Payments and plans
[later]
- [ ] Confirm the pricing and account limits.
- [ ] Paid plan: `$100` signup, up to 50 restaurant listings, and 3 staff accounts.
- [ ] Free plan: up to 3 restaurant listings and no staff accounts.
- [ ] database id chage to uuid
