# Cine-Stellar | Premium OTT Streaming Platform

Cine-Stellar is a production-grade, highly optimized OTT streaming platform comparable to Netflix, Disney+, Prime Video, and Apple TV+. It is built using **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **TailwindCSS**, **Framer Motion**, **Zustand**, and **Prisma ORM**.

---

## Features

- 🍿 **Cinematic Dark Design**: Deep backdrop styling featuring glowing borders, smooth spring transitions, glassmorphic panels, and animated cards.
- ⚡ **Real TMDB API Integration**: Dynamically loads live movies, trending titles, TV details, casts, trailers, and reviews.
- 📺 **Netflix-Style Video Player**: Custom HTML5 media player embedding VidKing stream URLs, featuring Play/Pause, timeline seeks, custom volume panels, speed controllers, subtitle lists, skip intro triggers, and episode drawers.
- 🔒 **Secure Custom Session Management**: Password encryption with bcrypt, JWT token creation, and Edge middleware route protection.
- 📂 **Dynamic Discovery & Instant Search**: Sidebar filter controls by genre, release year, language, country, and sort parameters. Expanded search logs recent queries.
- ⚙️ **Prisma DB Sync**: Pre-configured database schema (User, Watchlist, Favorite, WatchHistory, Rating) synced locally via SQLite and ready to migrate to PostgreSQL.
- 📊 **Admin Panel**: Monitor users, active streams, diagnostics logs, update hero banners, and moderate comments.

---

## Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Runtime**: React 19
- **Style**: TailwindCSS (v4) & CSS Variables
- **Animations**: Framer Motion
- **Database**: Prisma ORM with Better-SQLite3 local adapter (PostgreSQL-compatible)
- **State Manager**: Zustand
- **Query Caching**: TanStack React Query

---

## Installation & Setup

### 1. Clone & Install Dependencies
Navigate into the workspace and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
# TMDB API Configuration (Live Media Metadata)
TMDB_API_KEY=8088221e5df33c3fa7b69dc0c2219d36
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Database Configuration (Defaults to SQLite for local zero-config, PostgreSQL-ready)
DATABASE_URL="file:./dev.db"

# Authentication Security Secrets
JWT_SECRET="cine_stellar_jwt_secret_key_ultra_premium_2026"
JWT_EXPIRES_IN="7d"

# App Deployment URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Sync Database Schema
Sync the Prisma schema to build the local SQLite database cache (`dev.db`):
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the platform!

---

## Production Build & Vercel Deployment

To verify compilation and test optimization bounds locally:
```bash
npm run build
npm run start
```

### Deploying to Vercel
Cine-Stellar is optimized for Vercel deployment with edge rendering assets:

1. Connect your git repository to Vercel.
2. Select **Next.js** as the framework preset.
3. Configure the environment variables (`TMDB_API_KEY`, `JWT_SECRET`, `DATABASE_URL`) in the Vercel dashboard.
   - For production, swap your SQLite connection to PostgreSQL (Neon/Supabase) by modifying the provider in `prisma/schema.prisma` to `postgresql` and changing `DATABASE_URL` to your production URL.
4. Click **Deploy**.

---

## Database Schemas & Models

Defined in [prisma/schema.prisma](prisma/schema.prisma):
- **User**: Name, email, password, role (USER/ADMIN), avatar preset, preferred language, theme.
- **WatchHistory**: Playback progress tracks in seconds, durations, seasons, episodes, and timestamp markers.
- **Watchlist**: Adds items to a user's playlist.
- **Favorite**: Keeps track of Liked content.
- **Rating**: Stores movie feedback ratings (1-10 stars).
