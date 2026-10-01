# Watch Shelf — Frontend

A movie and TV database built with **Next.js and React**, powered by TMDB and connected to a custom Express/PostgreSQL backend.

The frontend provides the catalogue experience, authenticated user interface, personal media collections, reviews, ratings, watch history, and profile management.

## Features

- 🎬 Movie and TV catalogue
- 🔥 Trending movies and TV shows
- 🔎 Media search and browsing
- 🎞️ Movie and TV detail pages
- ▶️ Trailer player with YouTube
- ❤️ Favorites
- ⭐ Personal ratings
- 💬 Reviews
- 🕐 Watch history
- 👤 User profile
- 🖼️ Avatar management
- 🔐 Login, registration, logout and session handling
- ✏️ Username and password management
- 📱 Responsive interface
- ⚡ Server-side data fetching and React Query hydration
- 🔄 Infinite scrolling for user collections

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- TanStack Query
- Zustand
- CSS Modules
- Axios
- iziToast
- OverlayScrollbars
- React YouTube

### Backend

The frontend communicates with a separate Express API responsible for:

- Authentication and sessions
- PostgreSQL user data
- Favorites
- Ratings
- Reviews
- Watch history
- User profiles
- TMDB integration
- Cloudinary avatar storage

See the backend repository for the API implementation.

## Architecture

```text
Browser
   │
   ▼
Next.js / React
   │
   ▼
Next.js BFF
   │
   ▼
Express API
   │
   ├── PostgreSQL
   ├── TMDB
   └── Cloudinary
```

The Next.js application acts as the frontend and BFF layer.

Browser requests can go through Next.js route handlers, which forward requests to the Express API.

Authentication cookies are managed by the backend. The BFF forwards incoming cookies to Express and passes `Set-Cookie` headers back to the browser without recreating the authentication logic.

## Data Fetching

The application uses **TanStack Query** for client-side server state.

For pages where the initial data is known ahead of time, the Next.js server can prefetch the data and hydrate the React Query cache.

For example:

```text
Next.js Server
      │
      │ prefetch
      ▼
Express API
      │
      ▼
React Query Cache
      │
      │ dehydrate
      ▼
Browser
      │
      ▼
useQuery / useInfiniteQuery
```

This allows the initial page to render with data already available in the client cache instead of immediately making the same request again from the browser.

Examples include:

- Trending media
- Favorites
- Reviews
- Watch history
- Public media details

User-specific interactive features such as ratings, reviews, favorites, and trailer/watch-history interactions remain client-driven where appropriate.

## Authentication

Authentication is handled by the Express backend using database-backed sessions.

The frontend does not implement the session system itself.

The backend sets HTTP-only cookies containing:

- Access token
- Refresh token
- Session ID

The Next.js BFF forwards these cookies between the browser and Express API.

The frontend uses a small Zustand store for client-side authentication/user state.

## User Features

### Favorites

Users can add and remove movies or TV shows from their personal favorites.

### Ratings

Users can rate media from 1–10.

### Reviews

Users can create and update reviews for movies and TV shows.

### Watch History

The application tracks watched media and playback progress.

Trailer playback can update watch history during playback.

### Profile

Users can:

- View their profile
- Change their username
- Change their password
- Upload an avatar
- View their personal activity

## UI and UX

The interface uses CSS Modules and a custom dark visual style.

The application includes dedicated states for:

- Loading
- Empty results
- Fetch errors
- Retry actions
- Authentication-dependent content
- Responsive layouts

Native textarea scrolling and OverlayScrollbars are used where appropriate.

Animations include reduced-motion support.

## Environment Variables

Create a `.env.local` file:

```env
PORT=
NODE_ENV=development

NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_API_URL=

TMDB_ACCESS_TOKEN=
TMDB_API_KEY=
```

Do not commit environment files or API credentials to the repository.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available through the Next.js development server.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Related Repository

The Express API and PostgreSQL integration are maintained separately.

**Backend:** `<backend-repository-url>`

## Project Status

This project is a portfolio application and is currently under development.

The application is not currently deployed.

## Why I Built It

I built Watch Shelf to practice building a full-stack application around a real external API while implementing my own authentication, user data management, server/client data fetching, and persistent user features.

The project focuses on understanding how the frontend, BFF, backend API, database, and external services work together in a complete application.
