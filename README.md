# Backend-Repo-for-Myanmar-Coastal-Journey

a backend repository for the Myanmar Coastal Journey mobile app for special project of MIIT Students in 2025-2026 academic year

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express (TypeScript)
- **Database:** MongoDB Atlas (Mongoose)

## Project Description

Myanmar Coastal Journey delivers a rich set of features that help users explore Myanmar’s beaches effectively. Each beach page includes location details, cultural background, scenic highlights, photo galleries, recommended activities, and travel tips. The food and souvenirs section highlights local dishes, snacks, specialties, handmade products, and shop information.
The platform lets users book bus, car, and flight tickets directly or through verified agents. A route planner displays travel paths, estimated travel time, transportation options, and cost breakdowns.
Hotels, resorts, and homestays can be easily browsed, compared, and booked. Users can choose ready-made travel packages or request custom tours.

## Requirements

Make sure you have the following installed before starting:

- **Node.js** >= 22.x

  ```bash
  node --version
  v22.14.0
  ```

- **npm** >= 10.x
  ```bash
  npm --version
  10.9.2
  ```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Alastor428/Backend-Repo-for-Myanmar-Coastal-Journey.git
cd Backend-Repo-for-Myanmar-Coastal-Journey
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy .env.example to .env and adjust if needed:

```bash
cp .env.example .env
```

Default environment variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Set `MONGO_URI` in `.env` to your MongoDB Atlas connection string.

### 4. Build and run

Development (watch mode with tsx):

```bash
npm run dev
```

Production (compile then run):

```bash
npm run build
npm start
```

### 5. Seed Installation

```env
    Database => MongoDB
    Adapter Package => schema-seed-adapter-mongodb
    Install Command => npm install -D schema-seed-adapter-mongodb
    Connection String Example => mongodb://localhost:27017/db
```

## Development Status

- ✅ Project setup and configuration
- ✅ Mongo Setup (MongoDB Atlas + Mongoose)
- ✅ TypeScript build and scripts (tsc, dev, start)
- ✅ User schema design (local + foreign support: NRC / Passport)
- ✅ Authentication system (JWT + bcrypt)
- ✅ User endpoints (register, login, logout, refresh-token, list users, get user by id, update, delete)
- ✅ User validation schemas (Zod)
- ✅ Local vs Foreign users (NRC for Myanmar citizens, Passport for foreigners)
- ✅ Age requirement: 12+ to register and book
- ✅ Rate limiting (login/register attempts)
- ✅ Region, beach, restaurant schema design and endpoints
- ✅ City schema and endpoints (list, create)
- ✅ Food schema and endpoints (list by restaurant, filter by restaurant name, create)
- ✅ Travel route schema and endpoints (list, create)
- ✅ Bus schema and endpoints (list, filter by departure time, filter by source/destination, create)
- ✅ Ticket schema and endpoints (list, filter by source/destination, get by id, create)
- ✅ Bus seat show schema and endpoints (get by id, create show, update seat status, update, delete)
- ✅ CRUD endpoints (update, delete) for all resources
- ✅ Validation middleware and Zod schemas for all data endpoints
- ✅ Services layer (beach, restaurant, city, food, route, bus, ticket, bus show)
- ✅ Image upload (beach images, multer)
- ✅ API documentation (API.md)
- 🔁 Role-based access (roleMiddleware present; not yet enforced on all routes)

### ✅ **Implemented Endpoints**

For full API reference (Data | Endpoint | Notes) for the frontend team, see **[API.md](API.md)**.

### User types

- **Local users** (`isForeigner: false`): NRC required (Myanmar format), phone must start with `09`
- **Foreign users** (`isForeigner: true`): Passport required (6-20 alphanumeric), international phone format
- **Age requirement:** Users must be at least 12 years old to register and to book seats

## License

This project is licensed under the ISC License.
