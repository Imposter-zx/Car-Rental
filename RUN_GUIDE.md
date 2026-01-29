# How to Run Gamil Rent Car (Tested)

Your platform is now dynamic! However, it requires a running database to display and store information.

## 1. Requirement: MongoDB

The application expects a MongoDB database. If you don't have MongoDB installed locally, you can use a free cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

**If using a remote database:**
Update `server/.env` with your URI:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/car-rental
```

## 2. Launch Sequence

### Step A: Backend (Server)

1. Open a terminal.
2. `cd server`
3. `npm start`
   _Check for: `Connected to MongoDB` and `Server running on port 5000`_

### Step B: Database Seeding (First time only)

1. Open another terminal.
2. `cd server`
3. `npm run seed`
   _This creates the admin user and initial car fleet._

### Step C: Frontend (Vite)

1. Open a third terminal.
2. `npm run dev`
   _The app will be available at http://localhost:5173_

## 3. Admin Access

- **URL**: `http://localhost:5173/admin`
- **Email**: `admin@gamil.ma`
- **Password**: `admin123`

## Troubleshooting

- **"Server error" or "Timeout"**: This means the backend cannot talk to MongoDB. Check if your database is running and the URI in `.env` is correct.
- **"CORS error"**: The backend is configured to allow requests from any origin, but make sure the frontend is calling `http://localhost:5000`.
