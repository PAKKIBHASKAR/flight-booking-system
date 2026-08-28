# ✈️ SkyWay Flight Booking System - Full-Stack Deployment Guide

This guide explains how to run the application locally and deploy both the **Frontend** (to Netlify/Vercel) and **Backend API & Database** (to Render/Railway/Supabase).

---

## 1. Local Development Setup

### Step A: Start Backend API & Database
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server (runs on http://localhost:5000)
npm start
```
> **Note**: The backend automatically initializes an SQLite database (`flights.db`) and seeds initial flight schedules across global hubs (JFK, LHR, HND, DXB, SFO, CDG, SIN, DEL, SYD) and a demo account (`demo@skyway.com` / `password123`).

### Step B: Start Frontend Application
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:3000)
npm run dev
```

---

## 2. Deploying Backend API to Render

1. Sign up or log into [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub / GitLab repository containing the `flight-booking-system` code.
4. Set the configuration details:
   - **Name**: `skyway-flight-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add **Environment Variables** under the *Environment* tab:
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_super_secret_jwt_key_here`
   - `NODE_ENV` = `production`
6. Click **Create Web Service**. Once deployed, Render will provide your backend URL (e.g. `https://skyway-flight-backend.onrender.com`).

---

## 3. Deploying Frontend to Netlify

1. Sign up or log into [Netlify.com](https://netlify.com).
2. Click **Add new site** -> **Import an existing project**.
3. Connect your Git repository.
4. Set the site settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://skyway-flight-backend.onrender.com/api` (your Render backend URL + `/api`)
6. Click **Deploy Site**. Netlify will build and publish your live flight booking website!

---

## 4. Database Setup & Production Storage Options

### Option 1: Embedded SQLite (Default & Simplest)
- The application uses `sqlite3` which stores all user registrations, flight schedules, and booked tickets in `backend/flights.db`.
- On Render, to ensure data persists across server restarts, attach a **Persistent Disk** to `/backend/flights.db`.

### Option 2: Render PostgreSQL / Supabase Migration
- If you prefer PostgreSQL in production, update `backend/db.js` to connect to `process.env.DATABASE_URL` using `pg` (PostgreSQL client). The SQL table schema is standard ANSI SQL and is fully compatible with Postgres.

---

## 5. Summary of API Endpoints

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/api/auth/signup` | `POST` | Register a new user account | No |
| `/api/auth/login` | `POST` | Authenticate user & get JWT token | No |
| `/api/auth/me` | `GET` | Get logged-in user profile | Yes (JWT) |
| `/api/flights` | `GET` | Search & filter flights | No |
| `/api/flights/:id` | `GET` | Get flight details & reserved seats | No |
| `/api/bookings` | `POST` | Create booking with seat assignment | Yes (JWT) |
| `/api/bookings/my-bookings` | `GET` | Fetch current user's booked tickets | Yes (JWT) |
| `/api/bookings/:id/cancel` | `PUT` | Cancel a reservation | Yes (JWT) |
