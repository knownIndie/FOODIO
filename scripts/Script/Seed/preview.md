# FoodIO restaurant seed preview

29 fictional restaurants, 29 verified owners, 29 free subscriptions and 580 dishes.

Shared owner password: `FoodIO-Demo-2026!`

Each menu has 10 regional dishes plus 10 shared sides, drinks and desserts. Prices are demo prices. Vegetarian labels describe these seed recipes; dishes containing egg, meat or fish are non-vegetarian.

Locations use approximate city coordinates. Contact, bank and compliance details are fictional. No OTP messages are sent. These records do not enable payments or payouts.

Owners receive CUSTOMER and RESTAURANT_OWNER roles, an OWNER membership and a free subscription. The script copies the free tier limits from the database. The configured defaults are 3 restaurants and 15 staff.

Restaurants are ACTIVE. Business, compliance, bank, basic and menu setup sections are COMPLETED. Each has a sole proprietorship business record, demo FSSAI and GST references, and a demo bank account.

Run a preview without a database connection:

```sh
pnpm exec tsx scripts/Script/Seed/29-restaurants-seed.ts
```

Write to the database configured by DATABASE_URL:

```sh
pnpm exec tsx --env-file=.env scripts/Script/Seed/29-restaurants-seed.ts --write
```

Reruns update these seed records and preserve menu IDs. Unexpected account or restaurant collisions stop the transaction. Existing shared roles and pricing tiers are preserved.

## Krishna River Kitchen

Vijayawada, Andhra Pradesh. Coordinates: 16.5062, 80.648.

Owner: Vijayawada Demo Owner. Username: `seed_vijayawada_owner`. Email: `seed.vijayawada@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000001`. Address: Demo address 1, Vijayawada, Andhra Pradesh, India. Phone: 0000000001.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Pesarattu | ₹120 | Yes | OTHER | ALL_DAY |
| Gongura Chicken | ₹280 | No | OTHER | ALL_DAY |
| Andhra Fish Curry | ₹290 | No | OTHER | ALL_DAY |
| Pulihora | ₹140 | Yes | OTHER | ALL_DAY |
| Gutti Vankaya | ₹180 | Yes | OTHER | ALL_DAY |
| Punugulu | ₹90 | Yes | OTHER | ALL_DAY |
| Kodi Vepudu | ₹260 | No | OTHER | ALL_DAY |
| Ulavacharu | ₹160 | Yes | OTHER | ALL_DAY |
| Bobbatlu | ₹100 | Yes | OTHER | ALL_DAY |
| Royyala Iguru | ₹320 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Siang Valley Table

Itanagar, Arunachal Pradesh. Coordinates: 27.0844, 93.6053.

Owner: Itanagar Demo Owner. Username: `seed_itanagar_owner`. Email: `seed.itanagar@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000002`. Address: Demo address 2, Itanagar, Arunachal Pradesh, India. Phone: 0000000002.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Vegetable Thukpa | ₹160 | Yes | OTHER | ALL_DAY |
| Chicken Thukpa | ₹210 | No | OTHER | ALL_DAY |
| Vegetable Momos | ₹140 | Yes | MOMOS | ALL_DAY |
| Chicken Momos | ₹180 | No | MOMOS | ALL_DAY |
| Bamboo Shoot Pork | ₹280 | No | OTHER | ALL_DAY |
| Khura | ₹110 | Yes | OTHER | ALL_DAY |
| Zan with Vegetables | ₹160 | Yes | OTHER | ALL_DAY |
| Pehak with Rice | ₹150 | Yes | OTHER | ALL_DAY |
| Steamed River Fish | ₹260 | No | OTHER | ALL_DAY |
| Bamboo Shoot Vegetables | ₹170 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Brahmaputra Bowl

Guwahati, Assam. Coordinates: 26.1445, 91.7362.

Owner: Guwahati Demo Owner. Username: `seed_guwahati_owner`. Email: `seed.guwahati@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000003`. Address: Demo address 3, Guwahati, Assam, India. Phone: 0000000003.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Masor Tenga | ₹240 | No | OTHER | ALL_DAY |
| Aloo Pitika | ₹110 | Yes | OTHER | ALL_DAY |
| Khar with Papaya | ₹140 | Yes | OTHER | ALL_DAY |
| Duck with Ash Gourd | ₹320 | No | OTHER | ALL_DAY |
| Xaak Bhaji | ₹130 | Yes | OTHER | ALL_DAY |
| Bamboo Shoot Chicken | ₹250 | No | OTHER | ALL_DAY |
| Til Pitha | ₹90 | Yes | OTHER | ALL_DAY |
| Narikol Laru | ₹80 | Yes | OTHER | ALL_DAY |
| Kumol Saul with Curd | ₹120 | Yes | OTHER | ALL_DAY |
| Black Sesame Pork | ₹290 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Magadh Lunch House

Patna, Bihar. Coordinates: 25.5941, 85.1376.

Owner: Patna Demo Owner. Username: `seed_patna_owner`. Email: `seed.patna@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000004`. Address: Demo address 4, Patna, Bihar, India. Phone: 0000000004.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Litti Chokha | ₹160 | Yes | OTHER | ALL_DAY |
| Sattu Paratha | ₹120 | Yes | OTHER | ALL_DAY |
| Dal Pitha | ₹140 | Yes | OTHER | ALL_DAY |
| Chana Ghugni | ₹110 | Yes | OTHER | ALL_DAY |
| Bihari Chicken Curry | ₹250 | No | OTHER | ALL_DAY |
| Fish Curry with Rice | ₹260 | No | OTHER | ALL_DAY |
| Thekua | ₹80 | Yes | OTHER | ALL_DAY |
| Khaja | ₹90 | Yes | OTHER | ALL_DAY |
| Dahi Chura | ₹100 | Yes | OTHER | ALL_DAY |
| Aloo Chokha | ₹90 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Chhattisgarh Chulha

Raipur, Chhattisgarh. Coordinates: 21.2514, 81.6296.

Owner: Raipur Demo Owner. Username: `seed_raipur_owner`. Email: `seed.raipur@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000005`. Address: Demo address 5, Raipur, Chhattisgarh, India. Phone: 0000000005.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Chila | ₹100 | Yes | OTHER | ALL_DAY |
| Fara | ₹120 | Yes | OTHER | ALL_DAY |
| Angakar Roti | ₹90 | Yes | OTHER | ALL_DAY |
| Dubki Kadhi | ₹160 | Yes | OTHER | ALL_DAY |
| Bafauri | ₹110 | Yes | OTHER | ALL_DAY |
| Chousela | ₹100 | Yes | OTHER | ALL_DAY |
| Muthiya | ₹120 | Yes | OTHER | ALL_DAY |
| Bore Baasi | ₹100 | Yes | OTHER | ALL_DAY |
| Dehrori | ₹90 | Yes | OTHER | ALL_DAY |
| Aamat | ₹170 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Mandovi Spice House

Panaji, Goa. Coordinates: 15.4909, 73.8278.

Owner: Panaji Demo Owner. Username: `seed_panaji_owner`. Email: `seed.panaji@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000006`. Address: Demo address 6, Panaji, Goa, India. Phone: 0000000006.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Goan Fish Curry | ₹280 | No | OTHER | ALL_DAY |
| Chicken Xacuti | ₹270 | No | OTHER | ALL_DAY |
| Pork Vindaloo | ₹300 | No | OTHER | ALL_DAY |
| Mushroom Xacuti | ₹220 | Yes | OTHER | ALL_DAY |
| Prawn Balchao | ₹340 | No | OTHER | ALL_DAY |
| Goan Vegetable Caldin | ₹210 | Yes | OTHER | ALL_DAY |
| Chicken Cafreal | ₹280 | No | OTHER | ALL_DAY |
| Bebinca | ₹140 | No | OTHER | ALL_DAY |
| Goan Poi with Bhaji | ₹110 | Yes | OTHER | ALL_DAY |
| Rava Fried Fish | ₹260 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Sabarmati Thali

Ahmedabad, Gujarat. Coordinates: 23.0225, 72.5714.

Owner: Ahmedabad Demo Owner. Username: `seed_ahmedabad_owner`. Email: `seed.ahmedabad@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000007`. Address: Demo address 7, Ahmedabad, Gujarat, India. Phone: 0000000007.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Khaman | ₹100 | Yes | OTHER | ALL_DAY |
| Khandvi | ₹110 | Yes | OTHER | ALL_DAY |
| Undhiyu | ₹220 | Yes | OTHER | ALL_DAY |
| Thepla with Curd | ₹120 | Yes | OTHER | ALL_DAY |
| Gujarati Dal | ₹130 | Yes | OTHER | ALL_DAY |
| Sev Tameta | ₹150 | Yes | OTHER | ALL_DAY |
| Handvo | ₹140 | Yes | OTHER | ALL_DAY |
| Dabeli | ₹80 | Yes | OTHER | ALL_DAY |
| Patra | ₹110 | Yes | OTHER | ALL_DAY |
| Mohanthal | ₹100 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Haryana Hearth

Rohtak, Haryana. Coordinates: 28.8955, 76.6066.

Owner: Rohtak Demo Owner. Username: `seed_rohtak_owner`. Email: `seed.rohtak@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000008`. Address: Demo address 8, Rohtak, Haryana, India. Phone: 0000000008.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Bajra Khichdi | ₹150 | Yes | OTHER | ALL_DAY |
| Bajra Roti with Ghee | ₹90 | Yes | OTHER | ALL_DAY |
| Kachri Chutney | ₹60 | Yes | OTHER | ALL_DAY |
| Hara Cholia | ₹170 | Yes | OTHER | ALL_DAY |
| Bathua Raita | ₹100 | Yes | OTHER | ALL_DAY |
| Kadhi Pakora | ₹160 | Yes | OTHER | ALL_DAY |
| Besan Masala Roti | ₹100 | Yes | OTHER | ALL_DAY |
| Mixed Dal | ₹140 | Yes | OTHER | ALL_DAY |
| Churma | ₹110 | Yes | OTHER | ALL_DAY |
| Meethe Chawal | ₹120 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Pahadi Dham Kitchen

Shimla, Himachal Pradesh. Coordinates: 31.1048, 77.1734.

Owner: Shimla Demo Owner. Username: `seed_shimla_owner`. Email: `seed.shimla@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000009`. Address: Demo address 9, Shimla, Himachal Pradesh, India. Phone: 0000000009.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Madra | ₹190 | Yes | OTHER | ALL_DAY |
| Dham Thali | ₹300 | Yes | OTHER | ALL_DAY |
| Siddu | ₹150 | Yes | OTHER | ALL_DAY |
| Chha Gosht | ₹320 | No | OTHER | ALL_DAY |
| Babru | ₹120 | Yes | OTHER | ALL_DAY |
| Tudkiya Bhath | ₹180 | Yes | OTHER | ALL_DAY |
| Bhey | ₹170 | Yes | OTHER | ALL_DAY |
| Aktori | ₹130 | Yes | OTHER | ALL_DAY |
| Mittha | ₹110 | Yes | OTHER | ALL_DAY |
| Sepu Vadi | ₹200 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Palash Kitchen

Ranchi, Jharkhand. Coordinates: 23.3441, 85.3096.

Owner: Ranchi Demo Owner. Username: `seed_ranchi_owner`. Email: `seed.ranchi@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000010`. Address: Demo address 10, Ranchi, Jharkhand, India. Phone: 0000000010.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Dhuska | ₹100 | Yes | OTHER | ALL_DAY |
| Rugra Curry | ₹200 | Yes | OTHER | ALL_DAY |
| Chilka Roti | ₹100 | Yes | OTHER | ALL_DAY |
| Jharkhand Rice Thali | ₹180 | Yes | OTHER | ALL_DAY |
| Bamboo Shoot Curry | ₹170 | Yes | OTHER | ALL_DAY |
| Aloo Chokha with Roti | ₹130 | Yes | OTHER | ALL_DAY |
| Arsa | ₹90 | Yes | OTHER | ALL_DAY |
| Thekua | ₹80 | Yes | OTHER | ALL_DAY |
| Dal Pitha | ₹130 | Yes | OTHER | ALL_DAY |
| Chicken Curry with Rice | ₹240 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Bengaluru Oota

Bengaluru, Karnataka. Coordinates: 12.9716, 77.5946.

Owner: Bengaluru Demo Owner. Username: `seed_bengaluru_owner`. Email: `seed.bengaluru@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000011`. Address: Demo address 11, Bengaluru, Karnataka, India. Phone: 0000000011.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Bisi Bele Bath | ₹160 | Yes | OTHER | ALL_DAY |
| Ragi Mudde with Sambar | ₹140 | Yes | OTHER | ALL_DAY |
| Mysore Masala Dosa | ₹140 | Yes | OTHER | ALL_DAY |
| Neer Dosa | ₹120 | Yes | OTHER | ALL_DAY |
| Akki Roti | ₹130 | Yes | OTHER | ALL_DAY |
| Mangalore Buns | ₹100 | Yes | OTHER | ALL_DAY |
| Chicken Ghee Roast | ₹290 | No | OTHER | ALL_DAY |
| Kori Gassi | ₹270 | No | OTHER | ALL_DAY |
| Mysore Pak | ₹100 | Yes | OTHER | ALL_DAY |
| Vegetable Puliogare | ₹130 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Malabar Coconut Kitchen

Kochi, Kerala. Coordinates: 9.9312, 76.2673.

Owner: Kochi Demo Owner. Username: `seed_kochi_owner`. Email: `seed.kochi@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000012`. Address: Demo address 12, Kochi, Kerala, India. Phone: 0000000012.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Appam with Vegetable Stew | ₹170 | Yes | OTHER | ALL_DAY |
| Puttu with Kadala Curry | ₹160 | Yes | OTHER | ALL_DAY |
| Kerala Fish Curry | ₹280 | No | OTHER | ALL_DAY |
| Malabar Chicken Biryani | ₹260 | No | BIRYANI | ALL_DAY |
| Avial | ₹170 | Yes | OTHER | ALL_DAY |
| Idiyappam with Egg Curry | ₹180 | No | OTHER | ALL_DAY |
| Beef Ularthiyathu | ₹290 | No | OTHER | ALL_DAY |
| Pazham Pori | ₹90 | Yes | OTHER | ALL_DAY |
| Ada Pradhaman | ₹120 | Yes | OTHER | ALL_DAY |
| Kappa with Fish Curry | ₹240 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Malwa Rasoi

Indore, Madhya Pradesh. Coordinates: 22.7196, 75.8577.

Owner: Indore Demo Owner. Username: `seed_indore_owner`. Email: `seed.indore@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000013`. Address: Demo address 13, Indore, Madhya Pradesh, India. Phone: 0000000013.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Indori Poha | ₹90 | Yes | OTHER | ALL_DAY |
| Bhutte Ka Kees | ₹120 | Yes | OTHER | ALL_DAY |
| Dal Bafla | ₹220 | Yes | OTHER | ALL_DAY |
| Sabudana Khichdi | ₹130 | Yes | OTHER | ALL_DAY |
| Garadu | ₹110 | Yes | OTHER | ALL_DAY |
| Mawa Bati | ₹110 | Yes | OTHER | ALL_DAY |
| Bhopali Chicken Rezala | ₹280 | No | OTHER | ALL_DAY |
| Chakki Ki Shaak | ₹180 | Yes | OTHER | ALL_DAY |
| Aloo Kachori | ₹90 | Yes | OTHER | ALL_DAY |
| Malpua | ₹100 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Sahyadri Tiffin House

Pune, Maharashtra. Coordinates: 18.5204, 73.8567.

Owner: Pune Demo Owner. Username: `seed_pune_owner`. Email: `seed.pune@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000014`. Address: Demo address 14, Pune, Maharashtra, India. Phone: 0000000014.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Misal Pav | ₹140 | Yes | OTHER | ALL_DAY |
| Vada Pav | ₹70 | Yes | OTHER | ALL_DAY |
| Puran Poli | ₹120 | Yes | OTHER | ALL_DAY |
| Pithla Bhakri | ₹170 | Yes | OTHER | ALL_DAY |
| Bharli Vangi | ₹180 | Yes | OTHER | ALL_DAY |
| Kolhapuri Chicken | ₹270 | No | OTHER | ALL_DAY |
| Sabudana Vada | ₹110 | Yes | OTHER | ALL_DAY |
| Thalipeeth | ₹130 | Yes | OTHER | ALL_DAY |
| Modak | ₹120 | Yes | OTHER | ALL_DAY |
| Kothimbir Vadi | ₹110 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Loktak Table

Imphal, Manipur. Coordinates: 24.817, 93.9368.

Owner: Imphal Demo Owner. Username: `seed_imphal_owner`. Email: `seed.imphal@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000015`. Address: Demo address 15, Imphal, Manipur, India. Phone: 0000000015.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Eromba with Fish | ₹180 | No | OTHER | ALL_DAY |
| Singju with Fermented Fish | ₹140 | No | OTHER | ALL_DAY |
| Chamthong Vegetable Stew | ₹160 | Yes | OTHER | ALL_DAY |
| Nga Thongba | ₹250 | No | OTHER | ALL_DAY |
| Ooti | ₹150 | Yes | OTHER | ALL_DAY |
| Chak Hao Kheer | ₹130 | Yes | OTHER | ALL_DAY |
| Kanghou Vegetables | ₹150 | Yes | OTHER | ALL_DAY |
| Paknam with Fish | ₹170 | No | OTHER | ALL_DAY |
| Morok Metpa with Fish | ₹80 | No | OTHER | ALL_DAY |
| Chicken with Bamboo Shoots | ₹250 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Khasi Hills Kitchen

Shillong, Meghalaya. Coordinates: 25.5788, 91.8933.

Owner: Shillong Demo Owner. Username: `seed_shillong_owner`. Email: `seed.shillong@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000016`. Address: Demo address 16, Shillong, Meghalaya, India. Phone: 0000000016.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Jadoh with Pork | ₹230 | No | OTHER | ALL_DAY |
| Dohneiiong | ₹290 | No | OTHER | ALL_DAY |
| Dohkhlieh | ₹240 | No | OTHER | ALL_DAY |
| Tungrymbai | ₹170 | Yes | OTHER | ALL_DAY |
| Pumaloi | ₹120 | Yes | OTHER | ALL_DAY |
| Pukhlein | ₹100 | Yes | OTHER | ALL_DAY |
| Nakham Bitchi | ₹190 | No | OTHER | ALL_DAY |
| Pudoh with Pork | ₹180 | No | OTHER | ALL_DAY |
| Steamed Hill Vegetables | ₹130 | Yes | OTHER | ALL_DAY |
| Black Sesame Chicken | ₹250 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Aizawl Bamboo Bowl

Aizawl, Mizoram. Coordinates: 23.7271, 92.7176.

Owner: Aizawl Demo Owner. Username: `seed_aizawl_owner`. Email: `seed.aizawl@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000017`. Address: Demo address 17, Aizawl, Mizoram, India. Phone: 0000000017.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Vegetable Bai | ₹160 | Yes | OTHER | ALL_DAY |
| Sawhchiar with Chicken | ₹210 | No | OTHER | ALL_DAY |
| Vawksa Rep | ₹280 | No | OTHER | ALL_DAY |
| Bamboo Shoot Fry | ₹150 | Yes | OTHER | ALL_DAY |
| Misa Mach Poora | ₹320 | No | OTHER | ALL_DAY |
| Bekang Curry | ₹160 | Yes | OTHER | ALL_DAY |
| Pumpkin Leaf Stew | ₹140 | Yes | OTHER | ALL_DAY |
| Rice with Smoked Pork | ₹260 | No | OTHER | ALL_DAY |
| Chhum Han | ₹130 | Yes | OTHER | ALL_DAY |
| Chicken with Mustard Greens | ₹240 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Kohima Smoke Kitchen

Kohima, Nagaland. Coordinates: 25.6751, 94.1086.

Owner: Kohima Demo Owner. Username: `seed_kohima_owner`. Email: `seed.kohima@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000018`. Address: Demo address 18, Kohima, Nagaland, India. Phone: 0000000018.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Smoked Pork with Bamboo Shoots | ₹300 | No | OTHER | ALL_DAY |
| Axone Vegetable Curry | ₹180 | Yes | OTHER | ALL_DAY |
| Anishi with Pork | ₹290 | No | OTHER | ALL_DAY |
| Galho with Vegetables | ₹160 | Yes | OTHER | ALL_DAY |
| Naga Chicken Curry | ₹260 | No | OTHER | ALL_DAY |
| Steamed Mustard Greens | ₹130 | Yes | OTHER | ALL_DAY |
| Dry Fish Chutney | ₹110 | No | OTHER | ALL_DAY |
| Sticky Rice with Pork | ₹250 | No | OTHER | ALL_DAY |
| Bamboo Shoot Soup | ₹140 | Yes | OTHER | ALL_DAY |
| Black Sesame Vegetables | ₹170 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Utkal Home Kitchen

Bhubaneswar, Odisha. Coordinates: 20.2961, 85.8245.

Owner: Bhubaneswar Demo Owner. Username: `seed_bhubaneswar_owner`. Email: `seed.bhubaneswar@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000019`. Address: Demo address 19, Bhubaneswar, Odisha, India. Phone: 0000000019.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Dalma | ₹160 | Yes | OTHER | ALL_DAY |
| Pakhala with Sides | ₹190 | Yes | OTHER | ALL_DAY |
| Chhena Poda | ₹120 | Yes | OTHER | ALL_DAY |
| Dahi Bara Aloo Dum | ₹130 | Yes | OTHER | ALL_DAY |
| Santula | ₹140 | Yes | OTHER | ALL_DAY |
| Chingudi Jhola | ₹300 | No | OTHER | ALL_DAY |
| Macha Besara | ₹250 | No | OTHER | ALL_DAY |
| Chakuli Pitha | ₹110 | Yes | OTHER | ALL_DAY |
| Kakara Pitha | ₹100 | Yes | OTHER | ALL_DAY |
| Kanika | ₹150 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Majha Tandoor

Amritsar, Punjab. Coordinates: 31.634, 74.8723.

Owner: Amritsar Demo Owner. Username: `seed_amritsar_owner`. Email: `seed.amritsar@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000020`. Address: Demo address 20, Amritsar, Punjab, India. Phone: 0000000020.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Amritsari Kulcha | ₹150 | Yes | OTHER | ALL_DAY |
| Sarson Ka Saag | ₹190 | Yes | OTHER | ALL_DAY |
| Makki Ki Roti | ₹90 | Yes | OTHER | ALL_DAY |
| Chole Bhature | ₹180 | Yes | OTHER | ALL_DAY |
| Dal Makhani | ₹210 | Yes | OTHER | ALL_DAY |
| Butter Chicken | ₹290 | No | OTHER | ALL_DAY |
| Amritsari Fish | ₹280 | No | OTHER | ALL_DAY |
| Paneer Tikka | ₹240 | Yes | OTHER | ALL_DAY |
| Rajma Chawal | ₹170 | Yes | OTHER | ALL_DAY |
| Pinni | ₹100 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Pink City Rasoi

Jaipur, Rajasthan. Coordinates: 26.9124, 75.7873.

Owner: Jaipur Demo Owner. Username: `seed_jaipur_owner`. Email: `seed.jaipur@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000021`. Address: Demo address 21, Jaipur, Rajasthan, India. Phone: 0000000021.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Dal Baati Churma | ₹240 | Yes | OTHER | ALL_DAY |
| Gatte Ki Sabzi | ₹180 | Yes | OTHER | ALL_DAY |
| Ker Sangri | ₹200 | Yes | OTHER | ALL_DAY |
| Laal Maas | ₹340 | No | OTHER | ALL_DAY |
| Pyaaz Kachori | ₹100 | Yes | OTHER | ALL_DAY |
| Mirchi Vada | ₹90 | Yes | OTHER | ALL_DAY |
| Papad Ki Sabzi | ₹150 | Yes | OTHER | ALL_DAY |
| Bajra Roti | ₹80 | Yes | OTHER | ALL_DAY |
| Ghevar | ₹140 | Yes | OTHER | ALL_DAY |
| Mohan Maas | ₹330 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Teesta Dumpling House

Gangtok, Sikkim. Coordinates: 27.3389, 88.6065.

Owner: Gangtok Demo Owner. Username: `seed_gangtok_owner`. Email: `seed.gangtok@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000022`. Address: Demo address 22, Gangtok, Sikkim, India. Phone: 0000000022.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Vegetable Momos | ₹150 | Yes | MOMOS | ALL_DAY |
| Chicken Momos | ₹190 | No | MOMOS | ALL_DAY |
| Vegetable Thukpa | ₹170 | Yes | OTHER | ALL_DAY |
| Phagshapa | ₹280 | No | OTHER | ALL_DAY |
| Gundruk Soup | ₹140 | Yes | OTHER | ALL_DAY |
| Kinema Curry | ₹180 | Yes | OTHER | ALL_DAY |
| Chhurpi Soup | ₹160 | Yes | OTHER | ALL_DAY |
| Sha Phaley | ₹190 | No | OTHER | ALL_DAY |
| Sel Roti | ₹100 | Yes | OTHER | ALL_DAY |
| Chicken Thenthuk | ₹220 | No | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Marina Tiffin Room

Chennai, Tamil Nadu. Coordinates: 13.0827, 80.2707.

Owner: Chennai Demo Owner. Username: `seed_chennai_owner`. Email: `seed.chennai@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000023`. Address: Demo address 23, Chennai, Tamil Nadu, India. Phone: 0000000023.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Idli with Sambar | ₹90 | Yes | OTHER | ALL_DAY |
| Ghee Pongal | ₹130 | Yes | OTHER | ALL_DAY |
| Masala Dosa | ₹140 | Yes | OTHER | ALL_DAY |
| Kothu Parotta with Egg | ₹180 | No | OTHER | ALL_DAY |
| Chettinad Chicken | ₹270 | No | OTHER | ALL_DAY |
| Vegetable Kurma | ₹170 | Yes | OTHER | ALL_DAY |
| Medu Vada | ₹90 | Yes | OTHER | ALL_DAY |
| Tamarind Rice | ₹120 | Yes | OTHER | ALL_DAY |
| Kuzhi Paniyaram | ₹110 | Yes | OTHER | ALL_DAY |
| Sakkarai Pongal | ₹110 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Deccan Dum Kitchen

Hyderabad, Telangana. Coordinates: 17.385, 78.4867.

Owner: Hyderabad Demo Owner. Username: `seed_hyderabad_owner`. Email: `seed.hyderabad@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000024`. Address: Demo address 24, Hyderabad, Telangana, India. Phone: 0000000024.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Hyderabadi Chicken Biryani | ₹260 | No | BIRYANI | ALL_DAY |
| Mutton Biryani | ₹330 | No | BIRYANI | ALL_DAY |
| Bagara Baingan | ₹180 | Yes | OTHER | ALL_DAY |
| Mirchi Ka Salan | ₹160 | Yes | OTHER | ALL_DAY |
| Sarva Pindi | ₹120 | Yes | OTHER | ALL_DAY |
| Sakinalu | ₹90 | Yes | OTHER | ALL_DAY |
| Haleem with Mutton | ₹290 | No | OTHER | ALL_DAY |
| Double Ka Meetha | ₹120 | Yes | OTHER | ALL_DAY |
| Qubani Ka Meetha | ₹130 | Yes | OTHER | ALL_DAY |
| Jonna Roti with Dal | ₹150 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Gomati Kitchen

Agartala, Tripura. Coordinates: 23.8315, 91.2868.

Owner: Agartala Demo Owner. Username: `seed_agartala_owner`. Email: `seed.agartala@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000025`. Address: Demo address 25, Agartala, Tripura, India. Phone: 0000000025.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Chakhwi with Pork | ₹240 | No | OTHER | ALL_DAY |
| Mui Borok Vegetable Plate | ₹180 | Yes | OTHER | ALL_DAY |
| Mosdeng Serma with Fish | ₹100 | No | OTHER | ALL_DAY |
| Gudok with Fish | ₹220 | No | OTHER | ALL_DAY |
| Wahan Mosdeng | ₹260 | No | OTHER | ALL_DAY |
| Bamboo Shoot Curry | ₹160 | Yes | OTHER | ALL_DAY |
| Berma Vegetable Stew | ₹180 | No | OTHER | ALL_DAY |
| Steamed Fish in Banana Leaf | ₹250 | No | OTHER | ALL_DAY |
| Pumpkin Curry | ₹140 | Yes | OTHER | ALL_DAY |
| Rice Flour Pitha | ₹100 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Gomti Nawabi Kitchen

Lucknow, Uttar Pradesh. Coordinates: 26.8467, 80.9462.

Owner: Lucknow Demo Owner. Username: `seed_lucknow_owner`. Email: `seed.lucknow@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000026`. Address: Demo address 26, Lucknow, Uttar Pradesh, India. Phone: 0000000026.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Galouti Kebab | ₹290 | No | OTHER | ALL_DAY |
| Awadhi Chicken Biryani | ₹260 | No | BIRYANI | ALL_DAY |
| Bedmi Puri | ₹130 | Yes | OTHER | ALL_DAY |
| Aloo Sabzi with Kachori | ₹120 | Yes | OTHER | ALL_DAY |
| Basket Chaat | ₹150 | Yes | OTHER | ALL_DAY |
| Nihari with Kulcha | ₹320 | No | OTHER | ALL_DAY |
| Tehri | ₹160 | Yes | OTHER | ALL_DAY |
| Matar Chaat | ₹110 | Yes | OTHER | ALL_DAY |
| Shahi Tukda | ₹130 | Yes | OTHER | ALL_DAY |
| Malai Makhan | ₹140 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Garhwal Mountain Kitchen

Dehradun, Uttarakhand. Coordinates: 30.3165, 78.0322.

Owner: Dehradun Demo Owner. Username: `seed_dehradun_owner`. Email: `seed.dehradun@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000027`. Address: Demo address 27, Dehradun, Uttarakhand, India. Phone: 0000000027.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Kafuli | ₹180 | Yes | OTHER | ALL_DAY |
| Chainsoo | ₹170 | Yes | OTHER | ALL_DAY |
| Aloo Ke Gutke | ₹130 | Yes | OTHER | ALL_DAY |
| Phaanu | ₹180 | Yes | OTHER | ALL_DAY |
| Jhangora Kheer | ₹120 | Yes | OTHER | ALL_DAY |
| Mandua Roti | ₹90 | Yes | OTHER | ALL_DAY |
| Bhat Ki Churkani | ₹170 | Yes | OTHER | ALL_DAY |
| Dubuk | ₹160 | Yes | OTHER | ALL_DAY |
| Bal Mithai | ₹110 | Yes | OTHER | ALL_DAY |
| Gahat Dal | ₹150 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Hooghly Lunch Room

Kolkata, West Bengal. Coordinates: 22.5726, 88.3639.

Owner: Kolkata Demo Owner. Username: `seed_kolkata_owner`. Email: `seed.kolkata@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000028`. Address: Demo address 28, Kolkata, West Bengal, India. Phone: 0000000028.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Shorshe Ilish | ₹390 | No | OTHER | ALL_DAY |
| Kosha Mangsho | ₹330 | No | OTHER | ALL_DAY |
| Shukto | ₹180 | Yes | OTHER | ALL_DAY |
| Aloo Posto | ₹170 | Yes | OTHER | ALL_DAY |
| Luchi with Cholar Dal | ₹150 | Yes | OTHER | ALL_DAY |
| Chingri Malai Curry | ₹340 | No | OTHER | ALL_DAY |
| Vegetable Chop | ₹100 | Yes | OTHER | ALL_DAY |
| Macher Jhol | ₹240 | No | OTHER | ALL_DAY |
| Mishti Doi | ₹100 | Yes | OTHER | ALL_DAY |
| Sandesh | ₹110 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |

## Dilli Gali Kitchen

New Delhi, Delhi. Coordinates: 28.6139, 77.209.

Owner: New Delhi Demo Owner. Username: `seed_delhi_owner`. Email: `seed.delhi@example.test`.

Restaurant ID: `f00d1029-0000-4000-8000-000000000029`. Address: Demo address 29, New Delhi, Delhi, India. Phone: 0000000029.

| Dish | Price | Vegetarian | Food type | Serving time |
| --- | ---: | --- | --- | --- |
| Chole Kulche | ₹130 | Yes | OTHER | ALL_DAY |
| Aloo Tikki Chaat | ₹120 | Yes | OTHER | ALL_DAY |
| Rajma Chawal | ₹160 | Yes | OTHER | ALL_DAY |
| Butter Chicken | ₹290 | No | OTHER | ALL_DAY |
| Paneer Butter Masala | ₹230 | Yes | OTHER | ALL_DAY |
| Chicken Seekh Kebab | ₹250 | No | OTHER | ALL_DAY |
| Stuffed Aloo Paratha | ₹120 | Yes | OTHER | ALL_DAY |
| Dahi Bhalla | ₹120 | Yes | OTHER | ALL_DAY |
| Daulat Ki Chaat | ₹150 | Yes | OTHER | ALL_DAY |
| Chole Bhature | ₹180 | Yes | OTHER | ALL_DAY |
| Steamed Rice | ₹80 | Yes | OTHER | ALL_DAY |
| Jeera Rice | ₹110 | Yes | OTHER | LUNCH |
| Plain Curd | ₹60 | Yes | OTHER | ALL_DAY |
| Cucumber Raita | ₹80 | Yes | OTHER | ALL_DAY |
| Seasonal Salad | ₹90 | Yes | SALAD | ALL_DAY |
| Fresh Lime Water | ₹60 | Yes | DRINKS | ALL_DAY |
| Masala Chai | ₹40 | Yes | DRINKS | ALL_DAY |
| Sweet Lassi | ₹90 | Yes | DRINKS | ALL_DAY |
| Rice Kheer | ₹100 | Yes | DESSERT | ALL_DAY |
| Seasonal Fruit Bowl | ₹110 | Yes | DESSERT | ALL_DAY |
