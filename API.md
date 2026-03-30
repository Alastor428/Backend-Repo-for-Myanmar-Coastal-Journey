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

| Data | Endpoint | Notes |
|------|----------|--------|
| Get bus show by ID (seat layout & availability) | **GET** `/api/v1/bus-seats/:id` | Bearer required. Params: `id` = bus show ObjectId. Returns show with `seatLayout`. |
| Create a bus show | **POST** `/api/v1/bus-seats` | Bearer required. Body (JSON): `ticket` (ObjectId), `busId` (ObjectId), `departureTime` (optional). |
| Update bus show | **PUT** `/api/v1/bus-seats/:id` | Bearer required. Body: `{ "departureTime": "..." }`. |
| Delete bus show | **DELETE** `/api/v1/bus-seats/:id` | Bearer required. |
| Update seat status (select/release seat) | **PUT** `/api/v1/bus-seats/:showId/seat?row=A&seatNumber=1&status=Selected` | Bearer required. **Age requirement:** User must be at least 12 years old to book. Params: `showId` = bus show ObjectId. Query: `row`, `seatNumber`, `status` (`"Available"` \| `"Selected"` \| `"Unavailable"`). Returns 403 if user is under 12 or has no `dateOfBirth`. |

---

## Hotels

| Data | Endpoint | Notes |
|------|----------|--------|
| List hotels | **GET** `/api/v1/hotels` | Bearer required. Query: `page`, `limit`, optional `sortBy`, `sortOrder`. |
| Filter hotels by beach | **GET** `/api/v1/hotels/filter/beach?beachId=<beachObjectId>` | Bearer required. Query: `beachId`, plus pagination (`page`, `limit`, `sortBy`, `sortOrder`). |
| Get hotel by ID | **GET** `/api/v1/hotels/:id` | Bearer required. Params: `id` = hotel ObjectId. |
| Create hotel | **POST** `/api/v1/hotels` | Bearer required. Body (JSON): `hotelName`, `beach` (ObjectId), `hotelRating` (0–5). |
| Update hotel | **PUT** `/api/v1/hotels/:id` | Bearer required. Params: `id`. Body: partial `hotelName`, `beach`, `hotelRating` (at least one). |
| Delete hotel | **DELETE** `/api/v1/hotels/:id` | Bearer required. Params: `id`. |

---

## Rooms

| Data | Endpoint | Notes |
|------|----------|--------|
| List rooms | **GET** `/api/v1/rooms` | Bearer required. Query: `page`, `limit`, optional `sortBy`, `sortOrder`. |
| Filter rooms by room type | **GET** `/api/v1/rooms/filter/room-type?roomType=Standard%20double%20or%20twin%20room` | Bearer required. Query: `roomType` plus pagination (`page`, `limit`, `sortBy`, `sortOrder`). |
| Get room by ID | **GET** `/api/v1/rooms/:id` | Bearer required. Params: `id` = room ObjectId. |
| Create room | **POST** `/api/v1/rooms` | Bearer required. Body (JSON): `hotel` (ObjectId), `roomType`, `roomPricePerNight`, `roomCapacity`, `roomDescription`. |
| Update room | **PUT** `/api/v1/rooms/:id` | Bearer required. Params: `id`. Body: partial `hotel`, `roomType`, `roomPricePerNight`, `roomCapacity`, `roomDescription` (at least one). |
| Delete room | **DELETE** `/api/v1/rooms/:id` | Bearer required. Params: `id`. |

---

## Hotel bookings

| Data | Endpoint | Notes |
|------|----------|--------|
| Create hotel booking | **POST** `/api/v1/hotel-bookings` | Bearer required. Body: `hotel` (ObjectId), `guestName`, optional `taxIncluded`, optional `currency`, `lineItems[]` with `room`, `checkInDate`, `checkOutDate`, optional notes, `numberOfRooms`, `numberOfAdults`. Backend calculates nights + totals. |
| List my hotel bookings | **GET** `/api/v1/hotel-bookings` | Bearer required. Query: `page`, `limit`, optional `sortBy`, `sortOrder`. |
| Get my hotel booking by ID | **GET** `/api/v1/hotel-bookings/:id` | Bearer required. Params: `id` = booking ObjectId. |
| Update my hotel booking | **PUT** `/api/v1/hotel-bookings/:id` | Bearer required. Params: `id`. Body: partial `guestName`, `taxIncluded`, `lineItems` (at least one). Recalculates totals when line items provided. |
| **Confirm my hotel booking** | **PUT** `/api/v1/hotel-bookings/:id/confirm` | Bearer required. Params: `id`. Marks booking as confirmed and sets `confirmedAt`. |
| Delete my hotel booking | **DELETE** `/api/v1/hotel-bookings/:id` | Bearer required. Params: `id`. |

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
4. **Seat selection:** **GET** `/api/v1/bus-seats/:id` for seat map; **PUT** `/api/v1/bus-seats/:showId/seat?row=...&seatNumber=...&status=Selected` when user picks a seat. **Note:** User must be at least 12 years old to book.
