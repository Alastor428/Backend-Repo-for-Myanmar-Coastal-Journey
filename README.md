# Backend-Repo-for-Myanmar-Coastal-Journey

a backend repository for the Myanmar Coastal Journey mobile app for special project of MIIT Students in 2025-2026 academic year

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
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
```

### 4. Run the app

Development mode:

```bash
npm run dev
```

## Development Status

- ✅ Project setup and configuration
- 🔁 Database schema design
- 🔁 Error handling infrastructure
- 🔁 Mongo Setup
- 🔁 Authentication system (JWT + bcrypt)
- 🔁 User management API (CRUD operations)
- 🔁 Validation schemas (Zod)
- 🔁 API documentation (Swagger)
- 🔁 Rate limiting (login attempts)

## License

This project is licensed under the ISC License.
