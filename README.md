# Watch Shelf — Frontend

A movie and TV tracking application built with **Next.js, React, and TypeScript**, powered by TMDB and connected to a custom Express API.

Watch Shelf allows users to discover movies and TV shows, manage personal collections, write reviews, rate media, track watch history, and manage their profiles.

**Live Demo:** https://watch-shelf.vercel.app

## Features

- 🎬 Browse movies and TV shows
- 🔥 Explore trending media
- 🔎 Search and discover titles
- 🎞️ View movie and TV details
- ▶️ Watch trailers through YouTube
- ❤️ Add and remove favorites
- ⭐ Rate movies and TV shows
- 💬 Create and manage reviews
- 🕐 Track watch history and playback progress
- 👤 Manage user profiles
- 🖼️ Upload and update profile avatars
- 🔐 User registration, login, and logout
- 🔑 Change usernames and passwords
- ⚡ Server-side data fetching and React Query hydration
- 🔄 Infinite scrolling for user collections
- 🔔 Loading, empty, and error states with retry actions
- 🌙 Custom dark interface designed primarily for laptop and desktop screens

## Tech Stack

### Frontend

- **Next.js** — App Router, server rendering, and Backend for Frontend (BFF)
- **React** — UI components
- **TypeScript** — Type safety
- **TanStack Query** — Server-state management, caching, mutations, and hydration
- **Zustand** — Client-side authentication and user state
- **Axios** — HTTP requests
- **CSS Modules** — Component-level styling
- **iziToast** — Notifications
- **OverlayScrollbars** — Custom scrollbars
- **React YouTube** — Trailer playback

### Backend and Services

- **Express** — Custom REST API
- **PostgreSQL** — Persistent user data
- **Supabase** — Managed PostgreSQL hosting
- **TMDB** — Movie and TV metadata
- **Cloudinary** — Avatar storage

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
   ├── Supabase PostgreSQL
   ├── TMDB API
   └── Cloudinary
```

The application separates the user interface, frontend-facing API layer, and backend business logic.

### Next.js BFF

Next.js route handlers act as a Backend for Frontend layer between the browser and Express.

The BFF forwards requests to the Express API and passes authentication cookies between the browser and backend.

The Express API remains responsible for authentication, session management, request validation, and database operations.

### Backend

The Express API handles application logic, user data, authentication, media requests, and integrations with external services.

Supabase provides managed PostgreSQL hosting, while Cloudinary stores processed avatar images.

## Data Fetching and State Management

TanStack Query manages server state, including data fetching, caching, mutations, and query invalidation.

For pages where the initial data can be fetched on the server, Next.js prefetches the data and dehydrates the React Query cache. The resulting state is passed to the client through `HydrationBoundary`.

```text
Next.js Server
      │
      ▼
Prefetch API Data
      │
      ▼
React Query Cache
      │
      ▼
Dehydrate State
      │
      ▼
Browser Hydration
      │
      ▼
useQuery / useInfiniteQuery
```

This allows client components to reuse prefetched data rather than immediately issuing the same request again after hydration.

Server-side prefetching is used where appropriate for trending media, media details, and user collections.

Client-side queries and mutations handle interactive features such as favorites, ratings, reviews, and watch-history updates.

Zustand maintains client-side user state, while TanStack Query manages server data.

## Authentication

Authentication is implemented by the custom Express backend using database-backed sessions.

The backend manages:

- Registration and login
- Session creation and validation
- Access-token refresh
- Logout and session invalidation
- Password changes

Authentication cookies are issued by Express. The Next.js BFF forwards incoming cookies to the backend and passes `Set-Cookie` headers back to the browser without recreating the authentication logic.

Zustand provides client-side access to user information for rendering authenticated UI.

## User Features

### Favorites

Save and remove movies and TV shows from a personal collection.

### Ratings

Rate movies and TV shows on a scale of 1–10.

### Reviews

Create and manage reviews for individual titles.

### Watch History

Track watched media and playback progress. Trailer playback can update watch-history records.

### Profile Management

View profile information, update usernames and passwords, and upload profile avatars.

## UI and UX

The interface uses CSS Modules and a custom dark visual style, with a layout designed primarily for laptop and desktop screens.

The application includes dedicated states for:

- Loading and pending operations
- Empty collections and search results
- Fetch errors and retry actions
- Authentication-dependent content
- Reduced-motion preferences

## Deployment

Watch Shelf is deployed across the following services:

| Service                               | Purpose                     |
| ------------------------------------- | --------------------------- |
| [Vercel](https://vercel.com/)         | Next.js frontend and BFF    |
| [Render](https://render.com/)         | Express backend API         |
| [Supabase](https://supabase.com/)     | Managed PostgreSQL database |
| [Cloudinary](https://cloudinary.com/) | Avatar storage              |

- **Live Application:** https://watch-shelf.vercel.app
- **Backend API:** https://watchshelfbackend.onrender.com

TMDB supplies the external movie and TV metadata.

## Environment Variables

The frontend uses environment variables configured in Vercel.

For local development, create a `.env.local` file in the frontend project.

Example:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:6000/api
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Use the correct local URLs and API paths for your configuration. In Vercel, configure the corresponding variables with the appropriate production values.

`NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_API_URL` are public environment variables. Their values can be exposed to browser-side JavaScript, so they must not contain secrets.

TMDB credentials and Cloudinary secrets are configured on the backend and are not required by the frontend.

Do not commit environment files or credentials to the repository.

## Getting Started

### Prerequisites

- Node.js
- npm
- Access to a running Express backend

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create `.env.local` and configure the required URLs.

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Next.js, typically `http://localhost:3000`.

### Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server      |
| `npm run lint`  | Run ESLint                       |

## Related Repository

**Backend Repository:** [Add your Express backend repository URL]

## Project Status

Watch Shelf is a deployed portfolio project.

## Why I Built It

I built Watch Shelf to gain practical experience developing a full-stack application around a real external API while implementing authentication, persistent user data, and personalized features.

The project explores how Next.js server and client rendering, a Backend for Frontend layer, a custom Express API, PostgreSQL, and external services work together in a complete application.

It also gave me hands-on experience deploying and integrating a frontend, backend, database, and cloud-based file storage.
