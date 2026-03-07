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
| Register a new user | **POST** `/api/v1/auth/register` | No auth. Body (JSON): `name`, `email` (must end with `@gmail.com`), `nrc`, `password`, `confirmPassword`; optional: `phone` (must start with `09`), `dateOfBirth`, `userRole` (`"Admin"` or `"Client"`). Rate limited. Returns user + tokens. |
| Login | **POST** `/api/v1/auth/login` | No auth. Body (JSON): `email`, `password`. Returns access token (and refresh token). Use access token in `Authorization: Bearer <token>` for protected routes. |
| Refresh access token | **POST** `/api/v1/auth/refresh-token` | No auth. Body (JSON): refresh token payload as your app expects. Returns new access token. |
| Logout | **POST** `/api/v1/auth/logout` | Bearer required. No body. Invalidates/clears session or refresh token. |
| List all users | **GET** `/api/v1/auth/users` | Bearer required. No query/body. Returns list of users (e.g. for admin). |
| Get one user by ID | **GET** `/api/v1/auth/users/:id` | Bearer required. Params: `id` = user MongoDB ObjectId. Returns single user. |

---

## Cities (source for “From” in bus/ticket flows)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all cities | **GET** `/api/v1/cities` | Bearer required. Use response `data[].cityName` (and `_id`) for “From” dropdown (e.g. Yangon). |
| Create a city | **POST** `/api/v1/cities` | Bearer required. Body (JSON): `{ "cityName": "Yangon" }`. |

---

## Beaches & Regions (destination for “To” in bus/ticket flows)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all beaches | **GET** `/api/v1/beaches` | Bearer required. Use response `data[].beachName` (and `_id`) for “To” dropdown (e.g. Ngapali, Chaung Tha). Each item may include populated `region`. |
| Create a region | **POST** `/api/v1/beaches/regions` | Bearer required. Body (JSON): `{ "regionName": "Tanintharyi" }`. |
| Create a beach | **POST** `/api/v1/beaches` | Bearer required. Body (JSON): `beachName`, `region` (ObjectId), `currentSafe` (boolean), `imageUrl` (array of URL strings). |
| Upload beach images | **POST** `/api/v1/beaches/upload-image` | Bearer required. Body: **form-data**, key `image` (file); max 5 files. Returns array of image URLs. |

---

## Travel Routes (city ↔ beach)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all routes | **GET** `/api/v1/routes` | Bearer required. Returns routes with populated `source` (city) and `destination` (beach). Use for route selection or bus/ticket context. |
| Create a route | **POST** `/api/v1/routes` | Bearer required. Body (JSON): `source` (city ObjectId), `destination` (beach ObjectId), `duration` (minutes), `distance` (number). |

---

## Buses

| Data | Endpoint | Notes |
|------|----------|--------|
| List all buses | **GET** `/api/v1/buses` | Bearer required. Returns buses with populated `route` (source/destination). Use to show available buses. |
| Filter buses by departure time & availability | **GET** `/api/v1/buses/filter/op1?departureTime=...&isAvailable=true` | Bearer required. Query: `departureTime` (string), `isAvailable` (`"true"` or `"false"`). Use when user filters by time/availability. |
| Filter buses by source city and destination beach | **GET** `/api/v1/buses/filter/op2?source=Yangon&destination=Ngapali` | Bearer required. Query: `source` (city name), `destination` (beach name). Use for “From (city) → To (beach)” bus list. |
| Create a bus | **POST** `/api/v1/buses` | Bearer required. Body (JSON): `route` (ObjectId), `noOfSeats`, `departureTime`, `isAvailable` (boolean). |

---

## Tickets (bus ticket search & booking)

| Data | Endpoint | Notes |
|------|----------|--------|
| List all tickets | **GET** `/api/v1/tickets` | Bearer required. Returns all tickets. Use for admin or full list. |
| Search tickets by source & destination (bus ticket search) | **GET** `/api/v1/tickets/filter/op1?source=Yangon&destination=Ngapali` | Bearer required. Query: `source` (city name), `destination` (beach name). Use for ticket search form: “From” (city) + “To” (beach). Response includes `departureDate`, `noOfPassenger`, `isForeigner` (Local = false, Foreigner = true), and populated `busId`. |
| Get one ticket by ID | **GET** `/api/v1/tickets/:id` | Bearer required. Params: `id` = ticket ObjectId. Use before payment or booking details. |
| Create a ticket | **POST** `/api/v1/tickets` | Bearer required. Body (JSON): `ticketName` (optional), `busId` (ObjectId), `source`, `destination`, `departureDate` (ISO date), `ticketPrice`, `noOfPassenger` (default 1), `isForeigner` (default false). |

---

## Bus seat shows (availability & seat selection)

| Data | Endpoint | Notes |
|------|----------|--------|
| Get bus show by ID (seat layout & availability) | **GET** `/api/v1/bus-seats/:id` | Bearer required. Params: `id` = bus show ObjectId. Returns show with `seatLayout` (rows, seat numbers, status: Available/Selected/Unavailable). Use for seat map after user picks a ticket/bus. |
| Create a bus show | **POST** `/api/v1/bus-seats` | Bearer required. Body (JSON): `ticket` (ObjectId), `busId` (ObjectId), `departureTime`. Admin use to create a show. |
| Update seat status (select/release seat) | **PUT** `/api/v1/bus-seats/:showId?row=A&seatNumber=1&status=Selected` | Bearer required. Params: `showId` = bus show ObjectId. Query: `row` (e.g. "A"), `seatNumber` (e.g. "1"), `status` (`"Available"` \| `"Selected"` \| `"Unavailable"`). Use when user selects or deselects a seat. |

---

## Restaurants

| Data | Endpoint | Notes |
|------|----------|--------|
| List all restaurants | **GET** `/api/v1/restaurants` | Bearer required. Returns restaurants with populated `region` and `beach`. Use for restaurant listing by region/beach. |
| Get one restaurant by ID | **GET** `/api/v1/restaurants/:id` | Bearer required. Params: `id` = restaurant ObjectId. Use for restaurant detail page. |
| Create a restaurant | **POST** `/api/v1/restaurants` | Bearer required. Body (JSON): `restaurantName`, `region` (ObjectId), `beach` (ObjectId), `phone`. |

---

## Foods

| Data | Endpoint | Notes |
|------|----------|--------|
| List foods by restaurant ID | **GET** `/api/v1/foods/:id` | Bearer required. Params: `id` = **restaurant** ObjectId (not food id). Returns foods for that restaurant. Use on restaurant detail to show menu. |
| Filter foods by restaurant name | **GET** `/api/v1/foods/filter/op1?restaurantName=...` | Bearer required. Query: `restaurantName` (string). Returns foods for that restaurant. Use when search is by name. |
| Create a food item | **POST** `/api/v1/foods` | Bearer required. Body (JSON): `restaurant` (ObjectId), `foodName`, `foodPrice` (number). |

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

List endpoints may also include `count` (number of items). Validation errors return `400` with `errors` (field-level). Use the `message` and `errors` fields to show user-friendly messages on the frontend.

---

## Suggested frontend flow: Bus ticket search

1. **Load “From” dropdown:** **GET** `/api/v1/cities` → use `data[].cityName`.
2. **Load “To” dropdown:** **GET** `/api/v1/beaches` → use `data[].beachName`.
3. **Search tickets:** **GET** `/api/v1/tickets/filter/op1?source=<cityName>&destination=<beachName>` (e.g. Yangon, Ngapali). Filter or display by `departureDate`, `noOfPassenger`, `isForeigner` (Local/Foreigner) on the client, or request backend support for these filters later.
4. **Seat selection:** **GET** `/api/v1/bus-seats/:id` for seat map; **PUT** `/api/v1/bus-seats/:showId?row=...&seatNumber=...&status=Selected` when user picks a seat.
