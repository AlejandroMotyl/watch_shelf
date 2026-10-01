# Watch Shelf

Watch Shelf is a movie and TV tracking application built around the [TMDB](https://www.themoviedb.org/) API.

The project combines a Next.js frontend with an Express API and PostgreSQL database. It includes custom authentication, persistent user sessions, personal movie data, watch history, favorites, ratings, reviews, and profile management.

The goal of the project is to build a complete full-stack application where both the frontend and backend are responsible for real application logic rather than relying entirely on third-party services.

---

## Features

- User registration and login
- Custom session-based authentication
- Access and refresh tokens
- HTTP-only authentication cookies
- Session rotation on refresh
- Movie and TV catalogue
- Trending media
- Media details and trailers
- Favorites
- Personal ratings
- Personal reviews
- Watch history with playback progress
- Continue Watching section
- Profile management
- Username changes
- Password changes
- Avatar upload and processing
- PostgreSQL persistence for user data

---

## Architecture

The application is split into a Next.js frontend/BFF layer and an Express backend.

```text
┌─────────────────────┐
│      Browser        │
│   Next.js / React   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Next.js        │
│     BFF / API       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Express API    │
│     TypeScript      │
└───────┬────────┬────┘
        │        │
        │        └──────────────► TMDB API
        │
        ▼
┌─────────────────────┐
│     PostgreSQL      │
│ Users / Sessions /  │
│ Favorites / Ratings │
│ Reviews / History   │
└─────────────────────┘

Express ─────────────► Cloudinary
                         │
                         ▼
                    User avatars
```

The Next.js layer acts as a BFF between the browser and Express. Authentication cookies are created and managed by the Express backend and forwarded through the BFF.

---

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

- Node.js
- Express
- TypeScript
- PostgreSQL
- `pg`
- Argon2
- Joi / Celebrate
- Pino
- Axios
- Multer
- Sharp
- file-type
- Cloudinary

### External Services

- TMDB — movie and TV metadata, ratings, trailers and reviews
- Cloudinary — user avatar storage

---

## Authentication

Watch Shelf uses custom authentication instead of relying on a third-party authentication provider.

Authentication is based on database-backed sessions containing:

- Access token
- Refresh token
- Session ID
- Expiration timestamps

Authentication credentials are stored in HTTP-only cookies.

### Session flow

```text
Login / Register
      │
      ▼
Express verifies credentials
      │
      ▼
Create database session
      │
      ├── Access token
      ├── Refresh token
      └── Session ID
      │
      ▼
Set HTTP-only cookies
```

When an access token expires, the backend can refresh the session using the refresh token.

Refresh operations rotate the session by replacing the previous session with a new one.

Logging out removes the database session and clears the authentication cookies.

Password changes also invalidate existing sessions and create a new session after the password has been updated.

Passwords are hashed using Argon2 and are never stored in plaintext.

---

## User Data

PostgreSQL stores application-specific user data independently from TMDB.

The project currently uses tables representing relationships between a user and a media item, including:

- `users`
- `sessions`
- `favorites`
- `ratings`
- `reviews`
- `watch_history`

User/media relationships are identified using:

```text
(user_id, tmdb_id, media_type)
```

This allows favorites, ratings, reviews and watch history to remain independent features while still referring to the same movie or TV title.

For example:

```text
User 12
   │
   ├── Favorite ─────► Movie 550
   ├── Rating ───────► Movie 550
   ├── Review ───────► Movie 550
   └── History ──────► Movie 550
```

PostgreSQL constraints are used together with application-level validation to protect data integrity.

---

## Media Data

TMDB is the source of movie and TV metadata.

The Express backend communicates with TMDB rather than exposing the TMDB integration directly to application components.

Examples include:

```text
GET /trending/:media_type
GET /reviews/:media_type
GET /:media_type/:tmdbId
GET /:media_type/:tmdbId/trailer
```

The backend also enriches some responses with application-specific data before returning them to the frontend.

---

## User Features

### Favorites

Authenticated users can add and remove movies and TV shows from their personal favorites.

Favorite records contain cached media information such as:

- TMDB ID
- Media type
- Title
- Poster path
- Release date
- Genres

This allows the user's collection pages to be rendered from PostgreSQL without needing to request every title from TMDB again.

### Ratings

Users can save a rating from 1 to 10 for a movie or TV show.

Ratings use an upsert-style workflow so a user can change an existing rating instead of creating duplicate records.

### Reviews

Users can create or update their own review for a title.

Reviews are associated with the same user/media identity:

```text
(user_id, tmdb_id, media_type)
```

The reviews endpoint also joins the user's rating and checks whether the title is currently in their favorites.

### Watch History

Watch history stores playback progress and duration.

The data is updated when a user watches a trailer and can be used to build the Continue Watching section.

The history record is updated rather than duplicated for the same:

```text
(user_id, tmdb_id, media_type)
```

### Profile

Users can:

- View their profile
- Change their username
- Change their password
- Upload a new avatar

Avatar uploads are validated and processed on the backend before being uploaded to Cloudinary.

---

## Avatar Processing

Avatar uploads are handled by the Express backend.

The upload flow includes:

1. Receive the file using Multer
2. Detect the actual file type with `file-type`
3. Validate image dimensions
4. Decode and rotate the image with Sharp
5. Resize it to a maximum avatar size
6. Convert it to WebP
7. Upload it to Cloudinary
8. Store the Cloudinary URL and public ID in PostgreSQL
9. Remove the previous avatar when applicable

The backend therefore does not rely only on the uploaded file's extension or MIME type.

---

## Frontend Data Handling

TanStack Query is used for server data and client-side caching.

Examples include:

```text
["media", type, id]
["trending", filter]
["favorites", ...]
["reviews", filter]
["history", ...]
["rating", type, id]
["review", type, id]
```

Infinite queries are used for collection pages such as favorites, reviews and watch history.

The initial page can be prefetched on the Next.js server and hydrated into the client-side React Query cache.

This allows the first page to be available immediately to the client while subsequent pages can still be fetched with normal client-side pagination.

Zustand is used for client-side application state such as:

- Authentication state
- Media filters

---

## Validation

Request validation is handled at the Express boundary using Joi and Celebrate.

Examples include:

- Registration
- Login
- Username updates
- Password updates
- Favorite media parameters
- Rating requests
- Review requests
- Watch history requests

Database constraints provide an additional layer of protection for persistent data integrity.

---

## Logging

The backend uses Pino and `pino-http` for structured HTTP logging.

Development logs use `pino-pretty` to keep request information readable during development.

---

## API Overview

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
```

### Media

```text
GET /trending/:media_type
GET /reviews/:media_type
GET /:media_type/:tmdbId
GET /:media_type/:tmdbId/trailer
```

### Favorites

```text
GET    /profile/favorites
POST   /profile/favorites/:media_type/:tmdbId
DELETE /profile/favorites/:media_type/:tmdbId
```

### Watch History

```text
GET  /profile/history
GET  /profile/history/:media_type/:tmdbId
POST /profile/history
```

### Ratings

```text
GET  /profile/ratings/:media_type/:tmdbId
POST /profile/ratings
```

### Reviews

```text
GET  /profile/reviews
GET  /profile/reviews/:media_type/:tmdbId
POST /profile/reviews
```

### Profile

```text
GET   /profile
PATCH /profile
PATCH /profile/username
PATCH /profile/password
```

---

## Environment Variables

### Frontend

Create a frontend environment file containing the required variables for the Next.js application.

```env
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_API_URL=
TMDB_ACCESS_TOKEN=
TMDB_API_KEY=
```

### Backend

```env
PORT=6000
NODE_ENV=development

TMDB_ACCESS_TOKEN=
TMDB_API_KEY=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Do not commit real credentials or tokens to the repository.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd watch-shelf
```

### 2. Install dependencies

Install dependencies separately for the frontend and backend.

```bash
npm install
```

### 3. Configure environment variables

Create the required environment files for the frontend and backend and provide your TMDB, PostgreSQL and Cloudinary credentials.

### 4. Start the backend

```bash
npm run dev
```

The backend runs on port `6000` by default in development.

### 5. Start the frontend

```bash
npm run dev
```

The Next.js application can then be opened in the browser using the local development URL provided by Next.js.

### Database

Watch Shelf uses PostgreSQL for persistent application data.

The database needs to contain the tables required by the backend, including:

```text
users
sessions
favorites
ratings
reviews
watch_history
```

The current project does not yet document an automated database migration workflow, so database schema setup is currently a separate development step.

---

## Backend Scripts

```text
npm run dev        Start development server with nodemon
npm run build      Compile TypeScript
npm run start      Start compiled backend
npm run typecheck  Run TypeScript checks
npm run lint       Run ESLint
```

## Frontend Scripts

```text
npm run dev        Start Next.js development server
npm run build      Build the production application
npm run start      Start the production application
npm run lint       Run ESLint
```

---

## Project Status

Watch Shelf is currently a development/portfolio project and is not deployed yet.

The core application functionality is implemented, including authentication, media browsing, user collections, ratings, reviews, watch history and profile management.

Potential future improvements include:

- Production deployment
- Automated database migrations
- Automated tests
- Further performance optimization
- Additional UI polish and accessibility improvements

---

## Why I Built It

The project was built as a full-stack application to practice working across the entire request lifecycle:

```text
React
  ↓
Next.js
  ↓
BFF
  ↓
Express
  ↓
PostgreSQL
  ↓
External APIs / Cloudinary
```

Rather than treating authentication, user data and persistence as external services, Watch Shelf implements those parts directly.

This makes the project useful as a practical exercise in:

- Full-stack TypeScript
- API design
- Authentication and session management
- PostgreSQL data modeling
- Request validation
- Client-side caching
- Server/client data boundaries
- File processing
- External API integration

---

## Screenshots

Screenshots of the application can be added here:

### Home

![Watch Shelf Home](./docs/screenshots/home.png)

### Media Details

![Watch Shelf Media Details](./docs/screenshots/media-details.png)

### Favorites

![Watch Shelf Favorites](./docs/screenshots/favorites.png)

### Reviews

![Watch Shelf Reviews](./docs/screenshots/reviews.png)

### Profile

![Watch Shelf Profile](./docs/screenshots/profile.png)

---

## License

This project is currently intended as a personal portfolio project.
