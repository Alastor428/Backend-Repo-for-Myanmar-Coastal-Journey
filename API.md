# API Endpoints Reference

Base URL: `http://localhost:3000` (or your `PORT` from `.env`).  
All API routes are under the prefix: **`/api/v1`**.

Protected endpoints require the header: **`Authorization: Bearer <access_token>`** (from login).

---

## General

| Data | Endpoint | Notes |
|------|----------|--------|
| API health check | **GET** `/` | No auth. Returns plain text: "API is running successfully!". Use to verify server is up. |

---

## Auth

| Data | Endpoint | Notes |
|------|----------|--------|
| Register a new user | **POST** `/api/v1/auth/register` | No auth. Body (JSON): `name`, `email` (must end with `@gmail.com`), `isForeigner` (boolean, default `false`), `password`, `confirmPassword`, `phone`, `dateOfBirth` (required, ISO date). **Local users** (`isForeigner: false`): `nrc` required (Myanmar NRC format, e.g. `12/ABC(N)123456`). **Foreign users** (`isForeigner: true`): `passport` required (6-20 alphanumeric). **Age requirement:** User must be at least 12 years old to register. Phone: local = `09` prefix; foreign = international format (e.g. `+1234567890`). Optional: `userRole`. Rate limited. |
| Login | **POST** `/api/v1/auth/login` | No auth. Body (JSON): `email`, `password`. Returns access token (and refresh token). Use access token in `Authorization: Bearer <token>` for protected routes. |
| Refresh access token | **POST** `/api/v1/auth/refresh-token` | No auth. Body (JSON): refresh token payload as your app expects. Returns new access token. |
| Logout | **POST** `/api/v1/auth/logout` | Bearer required. No body. Invalidates/clears session or refresh token. |
| List all users | **GET** `/api/v1/auth/users` | Bearer required. Query: `page`, `limit` (pagination). Returns list of users. |
| Get one user by ID | **GET** `/api/v1/auth/users/:id` | Bearer required. Params: `id` = user MongoDB ObjectId. Returns single user. |
| Update user | **PUT** `/api/v1/auth/users/:id` | Bearer required. Body: partial user fields (`name`, `email`, `password`, `dateOfBirth`, `userRole`, `phone`, `isAccountVerified`, `isForeigner`, `nrc`, `passport`). If updating `dateOfBirth`, user must remain at least 12 years old. |
| Delete user | **DELETE** `/api/v1/auth/users/:id` | Bearer required. Params: `id` = user ObjectId. |

---

## Cities (source for “From” in bus/ticket flows)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all cities | **GET** `/api/v1/cities` | Bearer required. Query: `page`, `limit` (pagination). Use response `data[].cityName` (and `_id`) for “From” dropdown (e.g. Yangon). |
| Get city by ID | **GET** `/api/v1/cities/:id` | Bearer required. Params: `id` = city ObjectId. |
| Create a city | **POST** `/api/v1/cities` | Bearer required. Body (JSON): `{ "cityName": "Yangon" }`. |
| Update city | **PUT** `/api/v1/cities/:id` | Bearer required. Params: `id` = city ObjectId. Body: `{ "cityName": "New name" }`. |
| Delete city | **DELETE** `/api/v1/cities/:id` | Bearer required. Params: `id` = city ObjectId. |

---

## Beaches & Regions (destination for “To” in bus/ticket flows)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all beaches | **GET** `/api/v1/beaches` | Bearer required. Query: `page`, `limit` (pagination). Use response `data[].beachName` (and `_id`) for “To” dropdown (e.g. Ngapali, Chaung Tha). Each item may include populated `region`. |
| Get beach by ID | **GET** `/api/v1/beaches/:id` | Bearer required. Params: `id` = beach ObjectId. |
| Create a region | **POST** `/api/v1/beaches/regions` | Bearer required. Body (JSON): `{ "regionName": "Tanintharyi" }`. |
| Update region | **PUT** `/api/v1/beaches/regions/:id` | Bearer required. Params: `id` = region ObjectId. Body: `{ "regionName": "New name" }`. |
| Delete region | **DELETE** `/api/v1/beaches/regions/:id` | Bearer required. Params: `id` = region ObjectId. |
| Create a beach | **POST** `/api/v1/beaches` | Bearer required. Body (JSON): `beachName`, `region` (ObjectId), `currentSafe` (boolean), `imageUrl` (array of URL strings). |
| Update beach | **PUT** `/api/v1/beaches/:id` | Bearer required. Params: `id` = beach ObjectId. Body: partial `beachName`, `region`, `currentSafe`, `imageUrl` (array of URLs). At least one field required. |
| Delete beach | **DELETE** `/api/v1/beaches/:id` | Bearer required. Params: `id` = beach ObjectId. |
| Upload beach images | **POST** `/api/v1/beaches/upload-image` | Bearer required. Body: **form-data**, key `image` (file); max 5 files. Returns array of image URLs. |

---

## Travel Routes (city ↔ beach)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all routes | **GET** `/api/v1/routes` | Bearer required. Query: `page`, `limit`. Returns routes with populated `source` and `destination`. |
| Create a route | **POST** `/api/v1/routes` | Bearer required. Body (JSON): `source` (city ObjectId), `destination` (beach ObjectId), `duration` (minutes), `distance` (number). |
| Get route by ID | **GET** `/api/v1/routes/:id` | Bearer required. |
| Update route | **PUT** `/api/v1/routes/:id` | Bearer required. Body: partial `source`, `destination`, `duration`, `distance`. |
| Delete route | **DELETE** `/api/v1/routes/:id` | Bearer required. |

---

## Buses

| Data | Endpoint | Notes |
|------|----------|--------|
| List all buses | **GET** `/api/v1/buses` | Bearer required. Query: `page`, `limit` (pagination). Returns buses with populated `route` (source/destination). Use to show available buses. |
| Filter buses by departure time & availability | **GET** `/api/v1/buses/filter/op1?departureTime=...&isAvailable=true` | Bearer required. Query: `departureTime` (string), `isAvailable` (`"true"` or `"false"`), `page`, `limit`. Use when user filters by time/availability. |
| Filter buses by source city and destination beach | **GET** `/api/v1/buses/filter/op2?source=Yangon&destination=Ngapali` | Bearer required. Query: `source` (city name), `destination` (beach name), `page`, `limit`. Use for “From (city) → To (beach)” bus list. |
| Get bus by ID | **GET** `/api/v1/buses/:id` | Bearer required. Params: `id` = bus ObjectId. |
| Create a bus | **POST** `/api/v1/buses` | Bearer required. Body (JSON): `route` (ObjectId), `noOfSeats`, `departureTime`, `isAvailable` (boolean). |
| Update bus | **PUT** `/api/v1/buses/:id` | Bearer required. Params: `id` = bus ObjectId. Body: partial `route`, `noOfSeats`, `departureTime`, `isAvailable`. At least one field required. |
| Delete bus | **DELETE** `/api/v1/buses/:id` | Bearer required. Params: `id` = bus ObjectId. |

---

## Tickets (bus ticket search & booking)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all tickets | **GET** `/api/v1/tickets` | Bearer required. Query: `page`, `limit` (pagination). Returns tickets; use for admin or full list. |
| Search tickets by source & destination (bus ticket search) | **GET** `/api/v1/tickets/filter/op1?source=Yangon&destination=Ngapali` | Bearer required. Query: `source` (city name), `destination` (beach name), `page`, `limit`. Use for ticket search form: “From” (city) + “To” (beach). Response includes `departureDate`, `noOfPassenger`, `isForeigner` (Local = false, Foreigner = true), and populated `busId`. |
| Get one ticket by ID | **GET** `/api/v1/tickets/:id` | Bearer required. Params: `id` = ticket ObjectId. Use before payment or booking details. |
| Create a ticket | **POST** `/api/v1/tickets` | Bearer required. Body (JSON): `ticketName` (optional), `busId` (ObjectId), `source`, `destination`, `departureDate` (ISO date), `ticketPrice`, `noOfPassenger` (default 1), `isForeigner` (default false). |
| Update ticket | **PUT** `/api/v1/tickets/:id` | Bearer required. Params: `id` = ticket ObjectId. Body: partial `ticketName`, `busId`, `source`, `destination`, `departureDate`, `ticketPrice`, `noOfPassenger`, `isForeigner`. At least one field required. |
| Delete ticket | **DELETE** `/api/v1/tickets/:id` | Bearer required. Params: `id` = ticket ObjectId. |

---

## Bus seat shows (availability & seat selection)

Seat layout uses **row** `"1"`–`"11"` and seat **numbers** like **`1A`**, **`2B`**, … **`11D`** (columns **A–D**). Each seat has:

| `status` | Meaning |
|----------|--------|
| `Available` | Free; user can select it. |
| `Selected` | Held in DB for checkout; `selectedBy` is the user who selected it (only that user can deselect or confirm). |
| `Unavailable` | Sold / not bookable; other users see it as taken. |

**Recommended flow:** use **POST** `/seats/selection` while the user taps seats, then **POST** `/seats/confirm` after payment succeeds.

| Data | Endpoint | Notes |
|------|----------|--------|
| List all bus shows | **GET** `/api/v1/bus-seats` | Bearer required. No query params. Returns all shows (newest first) with populated `bus` and `ticket`, each including `seatLayout`. |
| Get bus show by ID (seat layout & availability) | **GET** `/api/v1/bus-seats/:id` | Bearer required. Params: `id` = bus show ObjectId. Returns show with `seatLayout` (each seat may include `selectedBy` when `status` is `Selected`). |
| Create a bus show | **POST** `/api/v1/bus-seats` | Bearer required. Body (JSON): `ticket` (ObjectId), `busId` (ObjectId), `departureTime` (optional). |
| Update bus show | **PUT** `/api/v1/bus-seats/:id` | Bearer required. Body: `{ "departureTime": "..." }`. |
| Delete bus show | **DELETE** `/api/v1/bus-seats/:id` | Bearer required. |
| **Toggle seat selection** (tap to select / deselect) | **POST** `/api/v1/bus-seats/:showId/seats/selection` | Bearer required (any authenticated user). **Body (JSON):** `{ "seatIds": ["1A", "3B"] }` — each id must be row **1–11** plus column **A–D** (e.g. `1A`, `11D`). **Behavior:** `Available` → `Selected` for the current user; `Selected` by the same user → `Available`; `Unavailable` or `Selected` by another user → error. **Response `data`:** `{ "show": { ... }, "booking": { ... } }` where `booking` is `{ "selectedSeatIds": string[], "quantity": number, "unitPrice": number, "totalPrice": number, "currency": "MMK" }` (`unitPrice` comes from the show’s `price`; `totalPrice` = `quantity × unitPrice`). Use `booking` for the UI summary (selected seats + total). |
| **Confirm seats after payment** | **POST** `/api/v1/bus-seats/:showId/seats/confirm` | Bearer required. **Age requirement:** same as booking — user must be at least 12 and have `dateOfBirth` on profile (`requireAgeForBooking`). **Body (JSON):** `{ "seatIds": ["1A", "3B"] }`. Each seat must be `Selected` with `selectedBy` equal to the current user. Sets those seats to `Unavailable`. **Response `data`:** `{ "show": { ... }, "booking": { ... } }` with receipt-style `booking` (confirmed seats, quantity, prices in MMK). |
| Update seat status (legacy / admin-style) | **PUT** `/api/v1/bus-seats/:showId/seat?row=1&seatNumber=1A&status=Selected` | Bearer required. **Age requirement:** User must be at least 12 years old to book. Params: `showId` = bus show ObjectId. Query: **`row`** = row key in DB (`"1"`–`"11"`), **`seatNumber`** = full seat id (e.g. `1A`, same as `seatLayout[].seats[].number`), **`status`** = `Available`, `Selected`, or `Unavailable`. When status is not `Selected`, `selectedBy` is cleared on that seat. Returns 403 if user is under 12 or has no `dateOfBirth`. |

---

## Restaurants

| Data | Endpoint | Notes |
|------|----------|--------|
| List all restaurants | **GET** `/api/v1/restaurants` | Bearer required. Query: `page`, `limit`. Returns restaurants with populated `region` and `beach`. |
| Get one restaurant by ID | **GET** `/api/v1/restaurants/:id` | Bearer required. Params: `id` = restaurant ObjectId. |
| Create a restaurant | **POST** `/api/v1/restaurants` | Bearer required. Body (JSON): `restaurantName`, `region` (ObjectId), `beach` (ObjectId), `phone`. |
| Update restaurant | **PUT** `/api/v1/restaurants/:id` | Bearer required. Body: partial `restaurantName`, `region`, `beach`, `phone`. |
| Delete restaurant | **DELETE** `/api/v1/restaurants/:id` | Bearer required. |

---

## Foods

| Data | Endpoint | Notes |
|------|----------|--------|
| List foods by restaurant ID | **GET** `/api/v1/foods/:id` | Bearer required. Params: `id` = **restaurant** ObjectId. Query: `page`, `limit`. Returns foods for that restaurant. |
| Filter foods by restaurant name | **GET** `/api/v1/foods/filter/op1?restaurantName=...` | Bearer required. Query: `restaurantName`, `page`, `limit`. |
| Get food by ID | **GET** `/api/v1/foods/item/:id` | Bearer required. Params: `id` = food ObjectId. |
| Create a food item | **POST** `/api/v1/foods` | Bearer required. Body (JSON): `restaurant` (ObjectId), `foodName`, `foodPrice` (number). |
| Update food | **PUT** `/api/v1/foods/item/:id` | Bearer required. Body: partial `foodName`, `foodPrice`. |
| Delete food | **DELETE** `/api/v1/foods/item/:id` | Bearer required. |

---

## Response shape

Success responses use a consistent shape:

```json
{
  "success": true,
  "status": 200,
  "message": "...",
  "data": { ... }   // or array for list endpoints
}
```

List endpoints may also include `count` (number of items). Validation errors return `422` with `errors` (field-level). Use the `message` and `errors` fields to show user-friendly messages on the frontend.

---

## User types: Local vs Foreign

The app supports both **local** (Myanmar) and **foreign** users:

| Field | Local (`isForeigner: false`) | Foreign (`isForeigner: true`) |
|-------|------------------------------|-------------------------------|
| Identity | `nrc` (Myanmar NRC, e.g. `12/ABC(N)123456`) | `passport` (6-20 alphanumeric) |
| Phone | Must start with `09` | International format (e.g. `+1234567890`) |

Both require `dateOfBirth` at registration. Users must be **at least 12 years old** to register and to book seats.

---

## Suggested frontend flow: Bus ticket search

1. **Load “From” dropdown:** **GET** `/api/v1/cities` → use `data[].cityName`.
2. **Load “To” dropdown:** **GET** `/api/v1/beaches` → use `data[].beachName`.
3. **Search tickets:** **GET** `/api/v1/tickets/filter/op1?source=<cityName>&destination=<beachName>` (e.g. Yangon, Ngapali). Filter or display by `departureDate`, `noOfPassenger`, `isForeigner` (Local/Foreigner) on the client, or request backend support for these filters later.
4. **List shows (optional):** **GET** `/api/v1/bus-seats` to list all shows, or **GET** `/api/v1/bus-seats/:id` for one show’s seat map.
5. **Seat selection (recommended):** **POST** `/api/v1/bus-seats/:showId/seats/selection` with body `{ "seatIds": ["1A"] }` each time the user toggles seats. Read `data.booking` for `selectedSeatIds`, `quantity`, `unitPrice`, `totalPrice`, and `currency` (MMK) for the checkout summary.
6. **After payment succeeds:** **POST** `/api/v1/bus-seats/:showId/seats/confirm` with the same `seatIds` to mark seats `Unavailable` for everyone else. **Note:** Confirm requires the user to be at least 12 years old with `dateOfBirth` set; selection toggling only requires a valid Bearer token.
7. **Legacy alternative:** **PUT** `/api/v1/bus-seats/:showId/seat?row=<row>&seatNumber=<seatId>&status=...` with `row` = `"1"`–`"11"` and `seatNumber` = e.g. `1A`. Still subject to age check for booking.
