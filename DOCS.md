# 🎬 IMDBClone — Complete Project Documentation

> **Who is this for?** Beginners and intermediate developers who want to understand how this project works, and how to run or deploy it. Every concept is explained simply.

---

## Table of Contents

1. [Latest Updates (Apr 2026)](#1-latest-updates-apr-2026)
2. [Project Overview](#2-project-overview)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [High-Level Architecture](#5-high-level-architecture)
6. [Routing](#6-routing)
7. [Pages Reference](#7-pages-reference)
8. [Components Reference](#8-components-reference)
9. [State Management (Contexts)](#9-state-management-contexts)
10. [Custom Hooks](#10-custom-hooks)
11. [Services Layer](#11-services-layer)
12. [TypeScript Key Concepts](#12-typescript-key-concepts)
13. [Low-Level Design](#13-low-level-design)
14. [Environment Variables](#14-environment-variables)
15. [Local Setup Guide](#15-local-setup-guide)
16. [Getting a TMDB API Key](#16-getting-a-tmdb-api-key)
17. [Test Accounts](#17-test-accounts)
18. [Available Scripts](#18-available-scripts)
19. [Cloud Deployment](#19-cloud-deployment)
20. [Common Errors & Fixes](#20-common-errors--fixes)

---

## 1. Latest Updates (Apr 2026)

- Live deployment: [https://kunalkachru.github.io/imdb-clone-typescript/](https://kunalkachru.github.io/imdb-clone-typescript/)
- Router is now `HashRouter` for GitHub Pages compatibility.
- Auth flow now only redirects on successful login/register.
- Watchlist persistence is now user-scoped (`watchlist:<userId>`).
- `tmdb.ts` now handles query strings safely and provides clearer API errors.
- Test stack added: Vitest + Testing Library (`npm run test:*` scripts).
- CI/CD added in one workflow: quality gate then optional local deploy then cloud deploy.
- Movie detail page now includes a local-only survey module with structured ratings and two freeform feedback fields.
- Movie detail page now shows a seeded Audience Snapshot aggregate plus recent comment highlights for community context.

### UI Snapshot Gallery

![Home](docs/screenshots/home-page.png)
![Search](docs/screenshots/search-results.png)
![Movie detail](docs/screenshots/movie-detail.png)
![Login](docs/screenshots/login-page.png)

---

## 2. Project Overview

**IMDBClone** is a movie discovery web app that lets users:

- 🔍 Browse and search movies using the real [TMDB API](https://www.themoviedb.org/)
- 🎬 View detailed info about any movie (poster, rating, genres, overview)
- ➕ Add/remove movies to a personal **Watchlist**
- 🔐 Register and login (mock authentication — no real backend)
- 💾 Persist watchlist and login state across page refreshes (via `localStorage`)

> **Learning Goal:** This project is designed as a TypeScript + React learning project. Every file contains `// TS LESSON:` comments explaining TypeScript concepts as you encounter them.

---

## 2. Technology Stack

| Technology       | Version | Purpose                                                          |
| ---------------- | ------- | ---------------------------------------------------------------- |
| **React**        | 19.x    | UI library — builds the component tree                           |
| **TypeScript**   | 5.9.x   | Adds static types to JavaScript — catches bugs at compile time   |
| **Vite**         | 7.x     | Build tool & dev server — extremely fast hot reload              |
| **Tailwind CSS** | 4.x     | Utility-first CSS — style with class names directly in JSX       |
| **React Router** | 7.x     | Client-side routing — navigate between pages without page reload |
| **TMDB API**     | v3      | External REST API — provides real movie data                     |

> **What is TypeScript?** It's JavaScript with types. Instead of `let name = "John"`, you write `let name: string = "John"`. TypeScript will warn you if you accidentally assign a number to `name`. This prevents entire categories of bugs.

> **What is Vite?** It's a development server and bundler. When you run `npm run dev`, Vite serves your app at `localhost:5173` and instantly reflects your code changes.

> **What is Tailwind?** Instead of writing separate CSS files, you apply pre-built classes directly: `className="bg-gray-900 text-white p-4"`. It generates only the CSS you actually use.

---

## 3. Project Structure

```
imdb-clone/
├── src/
│   ├── main.tsx             # 🚀 App entry point — mounts React into index.html
│   ├── App.tsx              # Route definitions — maps URLs to page components
│   ├── index.css            # Global CSS — just imports Tailwind
│   │
│   ├── pages/               # Full-page components (one per route)
│   │   ├── Home.tsx         # Browse & search movies
│   │   ├── MovieDetail.tsx  # Single movie info + watchlist button
│   │   ├── Watchlist.tsx    # User's saved movies (protected)
│   │   ├── Login.tsx        # Login form
│   │   └── Register.tsx     # Registration form
│   │
│   ├── components/          # Reusable UI pieces used across pages
│   │   ├── Navbar.tsx       # Top navigation bar with search
│   │   ├── SearchBar.tsx    # Input + search button
│   │   └── ProtectedRoute.tsx # Blocks unauthenticated users from private routes
│   │
│   ├── context/             # Global state — shared across the whole app
│   │   ├── AuthContext.tsx      # Auth state logic (reducer + provider)
│   │   ├── AuthContextDef.ts    # Auth context creation (separated to avoid circular imports)
│   │   ├── WatchlistContext.tsx # Watchlist state logic (reducer + provider)
│   │   └── WatchlistContextDef.ts # Watchlist context creation
│   │
│   ├── hooks/               # Custom React hooks — reusable stateful logic
│   │   ├── useFetch.ts      # Generic data fetching hook with loading/error state
│   │   ├── useAuth.ts       # Access auth context safely (throws if used outside provider)
│   │   └── useWatchlist.ts  # Access watchlist context safely
│   │
│   ├── services/            # External communication — API calls and auth logic
│   │   ├── tmdb.ts          # All TMDB API functions (trending, search, detail)
│   │   └── auth.ts          # Mock login/register logic (simulates a real backend)
│   │
│   ├── test/                # Centralized tests grouped by app layer
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   │
│   └── types/               # TypeScript type definitions — the "shape" of all data
│       ├── movie.ts         # Movie and MovieDetail interfaces
│       ├── auth.ts          # User, AuthState, AuthAction types
│       ├── watchlist.ts     # WatchlistAction, WatchlistContextType
│       └── env.d.ts         # Tells TypeScript what env variables exist
│
├── .env                     # Your secret API keys (NOT committed to git)
├── .env-example             # Template showing what env vars are needed
├── .gitignore               # Files git should ignore (.env, node_modules, etc.)
├── vite.config.ts           # Vite configuration (plugins: React + Tailwind)
├── tsconfig.json            # TypeScript project references
├── tsconfig.app.json        # TypeScript settings for source code
├── eslint.config.js         # Linting rules (code style enforcement)
└── package.json             # Project metadata + npm scripts + dependencies
```

---

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (User)                       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    REACT APP                             │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Pages     │  │  Components  │  │   Contexts    │  │
│  │  (routes)   │  │  (reusable)  │  │  (global      │  │
│  │             │  │              │  │   state)       │  │
│  │ Home        │  │ Navbar       │  │ AuthContext   │  │
│  │ MovieDetail │  │ SearchBar    │  │ WatchlistCtx  │  │
│  │ Watchlist   │  │ ProtectedRt  │  └───────────────┘  │
│  │ Login       │  └──────────────┘                      │
│  │ Register    │                                         │
│  └──────┬──────┘                                        │
│         │  uses                                          │
│  ┌──────▼──────────────────────────┐                   │
│  │         Custom Hooks             │                   │
│  │  useFetch  useAuth  useWatchlist │                   │
│  └──────────────┬──────────────────┘                   │
│                 │  calls                                 │
│  ┌──────────────▼──────────────────┐                   │
│  │          Services               │                   │
│  │   tmdb.ts        auth.ts        │                   │
│  └──────┬──────────────────────────┘                   │
└─────────┼───────────────────────────────────────────────┘
          │ HTTP fetch
┌─────────▼───────────────────────────────────────────────┐
│              EXTERNAL APIs                               │
│                                                          │
│   TMDB API (api.themoviedb.org)   Mock Auth (in-memory) │
└─────────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│              BROWSER STORAGE                             │
│         localStorage (watchlist + auth token)            │
└─────────────────────────────────────────────────────────┘
```

**Data flows one direction:** UI → Hooks → Services → API → back up through state updates.

---

## 5. Routing

Routing is handled by **React Router v7**. The app uses client-side routing — the page never truly reloads; React swaps out the component.

| URL          | Component     | Protected? | Description              |
| ------------ | ------------- | ---------- | ------------------------ |
| `/`          | `Home`        | No         | Trending movies + search |
| `/movie/:id` | `MovieDetail` | No         | Single movie details     |
| `/login`     | `Login`       | No         | Login form               |
| `/register`  | `Register`    | No         | Register form            |
| `/watchlist` | `Watchlist`   | **Yes**    | User's saved movies      |

> **What does "Protected" mean?** The `/watchlist` route is wrapped in `<ProtectedRoute>`. If you're not logged in, it redirects you to `/login` automatically.

**Route setup in `App.tsx`:**

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/movie/:id" element={<MovieDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route
    path="/watchlist"
    element={
      <ProtectedRoute>
        <Watchlist />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Provider wrapping in `main.tsx`:**

```tsx
<HashRouter>
  <AuthProvider>
    <WatchlistProvider>
      <App />
    </WatchlistProvider>
  </AuthProvider>
</HashRouter>
```

> The order matters: router must be outermost (enables routing), then providers wrap the app so all pages can access global state.

---

## 6. Pages Reference

### `Home.tsx`

- **Purpose:** Landing page — shows trending movies or search results
- **State:** `searchQuery` (input value), `activeSearch` (what was last searched), `hasSearched` (boolean flag)
- **Data:** Calls `getTrendingMovies()` on load; calls `searchMovies()` when user searches
- **Key behaviour:** Reads `?search=` from the URL so searches are shareable links
- **Uses:** `useFetch`, `Navbar`, TMDB service

### `MovieDetail.tsx`

- **Purpose:** Shows full details of a single movie
- **Data:** Fetches from TMDB using `id` from the URL (`useParams`)
- **Key behaviour:** Shows Add/Remove watchlist button; button text + colour changes based on whether movie is already in watchlist
- **Uses:** `useFetch`, `useWatchlist`, TMDB service

### `Watchlist.tsx`

- **Purpose:** Displays all movies the user has saved (protected route)
- **State:** Local `searchQuery` for filtering — no API call, filters in memory
- **Key behaviour:** Live search as you type; remove button appears on hover; "Clear All" button
- **Uses:** `useWatchlist`, `Navbar`

### `Login.tsx`

- **Purpose:** Login form — email + password
- **State:** `formData: LoginCredentials` — typed form state
- **Key behaviour:** Calls `login()` from auth context; redirects to `/` on success; shows error if credentials wrong
- **Uses:** `useAuth`, auth types

### `Register.tsx`

- **Purpose:** Registration form — name + email + password
- **State:** `formData: RegisterCredentials`
- **Key behaviour:** Calls `register()` from auth context; redirects to `/` on success; shows error if email taken
- **Uses:** `useAuth`, auth types

---

## 7. Components Reference

### `Navbar.tsx`

- **Props:** `searchQuery: string`, `onSearchChange: (value: string) => void`, `onSearch: () => void`
- **Purpose:** Sticky top bar with logo, search, nav links, login/logout
- **Key behaviour:** Shows username + logout button when logged in; shows Login link when logged out
- **Uses:** `useAuth`, `SearchBar`

### `SearchBar.tsx`

- **Props:** `value`, `onChange`, `onSearch`, `placeholder?` (optional)
- **Purpose:** Controlled text input + search button
- **Key behaviour:** Triggers search on Enter key press OR button click
- **TypeScript note:** Props typed with `interface SearchBarProps`; events typed as `React.ChangeEvent<HTMLInputElement>` and `React.KeyboardEvent<HTMLInputElement>`

### `ProtectedRoute.tsx`

- **Props:** `children: React.ReactNode`
- **Purpose:** Route guard — checks if user is logged in
- **Key behaviour:** If no user in auth context → redirect to `/login`; otherwise renders children
- **TypeScript note:** `React.ReactNode` is the type for anything React can render (JSX, strings, arrays, etc.)

### `MovieCard.tsx`

- Currently empty — placeholder for a future reusable card component. The movie card UI is currently inline in `Home.tsx` and `Watchlist.tsx`.

---

## 8. State Management (Contexts)

The app uses **React Context** with **`useReducer`** — a pattern similar to Redux but built into React. No external state library is needed.

### Why split Context into two files?

Each context is split into:

- `*ContextDef.ts` — creates the context object (`createContext(...)`)
- `*Context.tsx` — contains the Provider component with all logic

This prevents **circular import errors** when hooks and contexts both need to reference each other.

---

### Auth Context

**State shape:**

```ts
{
  user: AuthUser | null; // logged-in user (without password)
  token: string | null; // fake JWT token
  status: AuthStatus; // 'idle' | 'loading' | 'success' | 'error'
  error: string | null; // error message if login failed
}
```

**Actions (reducer):**
| Action | What it does |
|---|---|
| `AUTH_START` | Sets status to `loading`, clears error |
| `AUTH_SUCCESS` | Stores user + token, sets status to `success` |
| `AUTH_ERROR` | Stores error message, clears user + token |
| `AUTH_LOGOUT` | Resets everything to initial state |

**Persistence:** On login success, `user` and `token` are saved to `localStorage`. On app start, they're read back so you stay logged in after refresh.

---

### Watchlist Context

**State shape:** `Movie[]` — just an array of movie objects

**Actions (reducer):**
| Action | Payload | What it does |
|---|---|---|
| `ADD_MOVIE` | `Movie` object | Adds movie to array |
| `REMOVE_MOVIE` | `number` (movie id) | Filters out the movie with that id |
| `CLEAR` | none | Empties the array |

**Persistence:** A `useEffect` watches the `watchlist` array and saves it to `localStorage` on every change.

---

## 9. Custom Hooks

### `useFetch<T>`

```
Input:  fetchFn (async function), dependency (optional)
Output: { data: T | null, loading: boolean, error: string | null }
```

- Generic hook — works with any data type
- Re-fetches when `dependency` changes (e.g. search query or movie ID)
- Uses `useCallback` to memoize the fetch function (prevents unnecessary re-renders)
- Uses a `cancelled` flag to avoid setting state after component unmounts (prevents memory leaks)

### `useAuth`

```
Input:  none
Output: AuthContextType (user, token, status, error, login, register, logout)
```

- Reads from `AuthContext`
- **Throws an error** if used outside `<AuthProvider>` — this is intentional so you get a clear error message instead of a silent `null`

### `useWatchlist`

```
Input:  none
Output: WatchlistContextType (watchlist, dispatch, isInWatchlist)
```

- Same pattern as `useAuth` — reads context and throws if used outside provider

---

## 10. Services Layer

### `tmdb.ts` — TMDB API Service

Uses a single generic `fetchFromTMDB<T>()` function for all API calls:

```ts
async function fetchFromTMDB<T>(endpoint: string): Promise<T>;
```

This function handles: auth headers, base URL, error checking, and JSON parsing.

**Exported API functions:**
| Function | Endpoint | Returns |
|---|---|---|
| `getTrendingMovies()` | `/trending/movie/week` | `TMDBResponse<Movie>` |
| `getPopularMovies(page?)` | `/movie/popular` | `TMDBResponse<Movie>` |
| `searchMovies(query, page?)` | `/search/movie?query=...` | `TMDBResponse<Movie>` |
| `getMovieDetail(id)` | `/movie/:id` | `MovieDetail` |

**Auth:** Uses a Bearer token (`Authorization: Bearer <TOKEN>`) in all request headers.

---

### `auth.ts` — Mock Authentication Service

> **Important:** This is a **simulated** backend. There is no real server. Users are stored in a JavaScript array in memory. Passwords are stored as plain text. This is fine for learning — never do this in a real production app.

**Mock users pre-loaded:**

- `john@example.com` / `password123`
- `jane@example.com` / `password123`

**`loginUser(credentials)`** — finds matching user, generates a fake base64 token, strips the password before returning.

**`registerUser(credentials)`** — checks for duplicate email, adds new user to the array, returns user + token.

**`AuthError`** — a custom Error class that extends `Error` and adds a `statusCode` field (e.g. 401, 409).

---

## 11. TypeScript Key Concepts

This project is a TypeScript learning tool. Here's every TS concept used and where:

| Concept                                | Where Used                                           | What it Means                                                               |
| -------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------- |
| **`interface`**                        | `types/movie.ts`, `types/auth.ts`                    | Defines the shape of an object                                              |
| **`type`**                             | `types/auth.ts`, `types/watchlist.ts`                | Like interface but for unions, primitives, computed types                   |
| **`extends`**                          | `MovieDetail extends Movie`                          | Inherits all fields from parent + adds new ones                             |
| **Generics `<T>`**                     | `useFetch<T>`, `fetchFromTMDB<T>`, `TMDBResponse<T>` | Placeholder type — works with any type you pass in                          |
| **`Pick<T, Keys>`**                    | `LoginCredentials`                                   | Creates new type with only the listed keys from T                           |
| **`Omit<T, Keys>`**                    | `AuthUser`, `RegisterCredentials`                    | Creates new type without the listed keys                                    |
| **`Partial<T>`**                       | `UpdateUserData`                                     | Makes all fields optional                                                   |
| **Discriminated Union**                | `AuthAction`, `WatchlistAction`                      | Multiple types with a shared `type` field; TypeScript narrows automatically |
| **`as const`**                         | `AuthStatus`                                         | Makes object values literal types (e.g. `"idle"` not `string`)              |
| **Optional field `?`**                 | `MovieDetail.runtime?`, `tagline?`                   | Field may or may not exist                                                  |
| **Non-null assertion `!`**             | `getElementById("root")!`                            | "Trust me, this is not null"                                                |
| **Type narrowing**                     | `if (!movie) return null`                            | After this check, TS knows `movie` is not null                              |
| **Optional chaining `?.`**             | `movie.release_date?.split("-")`                     | Safely access a field that might be undefined                               |
| **Nullish coalescing `??`**            | `searchData?.results ?? []`                          | Use right side if left is null/undefined                                    |
| **`React.ReactNode`**                  | `ProtectedRoute`, provider `children` props          | Type for anything React can render                                          |
| **`React.ChangeEvent<T>`**             | Form input handlers                                  | Typed DOM event for input changes                                           |
| **`React.FormEvent<T>`**               | Form submit handlers                                 | Typed DOM event for form submit                                             |
| **`React.KeyboardEvent<T>`**           | SearchBar keydown                                    | Typed DOM event for key presses                                             |
| **Declaration file `.d.ts`**           | `types/env.d.ts`                                     | Teaches TypeScript about external types (env vars)                          |
| **`useReducer` with typed actions**    | `AuthContext`, `WatchlistContext`                    | Typed state + typed dispatch                                                |
| **`useContext` with null guard**       | `useAuth`, `useWatchlist`                            | Safe context access with informative error                                  |
| **`useCallback` dependency**           | `useFetch`                                           | Memoizes functions; prevents infinite re-render loops                       |
| **`async/await` with `Promise<void>`** | `login()`, `register()`                              | Typed async functions                                                       |
| **`err: unknown` catch**               | `AuthContext`, `useFetch`                            | Modern TS — catch block errors are `unknown`, not `any`                     |
| **`import type`**                      | Throughout                                           | Import only the type, not the runtime value (tree-shaking)                  |

---

## 12. Low-Level Design

### Data Flow: Movie Search

```
User types in SearchBar
        ↓
onSearchChange() updates searchQuery state in Home
        ↓
User clicks Search or presses Enter
        ↓
handleSearch() sets activeSearch = searchQuery, hasSearched = true
        ↓
useFetch re-runs because activeSearch (dependency) changed
        ↓
fetchFromTMDB('/search/movie?query=...') called
        ↓
TMDB API responds with { results: Movie[], ... }
        ↓
useFetch sets data = response, loading = false
        ↓
Home renders searchData.results as movie grid
```

### Data Flow: Add to Watchlist

```
User clicks "Add to Watchlist" on MovieDetail
        ↓
handleWatchlist() called
        ↓
dispatch({ type: 'ADD_MOVIE', payload: movie }) sent to WatchlistContext
        ↓
watchlistReducer receives action
        ↓
Returns new array: [...state, movie]
        ↓
WatchlistContext re-renders all consumers
        ↓
useEffect detects watchlist change → saves to localStorage
        ↓
isInWatchlist(movie.id) now returns true
        ↓
Button changes to "Remove from Watchlist" (red)
```

### Data Flow: Login

```
User fills form and submits
        ↓
handleSubmit() calls login(formData) from AuthContext
        ↓
dispatch({ type: 'AUTH_START' }) → status = 'loading', button disabled
        ↓
loginUser(credentials) called in auth.ts
        ↓
800ms simulated delay
        ↓
[Success] dispatch AUTH_SUCCESS → user + token stored in state + localStorage
[Failure] dispatch AUTH_ERROR → error message shown in form
        ↓
navigate('/') on success
```

### localStorage Strategy

| Key         | Value                       | Set when                 | Cleared when   |
| ----------- | --------------------------- | ------------------------ | -------------- |
| `token`     | fake JWT string             | Login / Register success | Logout         |
| `user`      | JSON stringified `AuthUser` | Login / Register success | Logout         |
| `watchlist` | JSON stringified `Movie[]`  | Any watchlist change     | `CLEAR` action |

On app start (`main.tsx`), both contexts read from `localStorage` in their initial state — this is how state survives a page refresh.

---

## 13. Environment Variables

Vite uses `.env` files for configuration. Variables must be prefixed with `VITE_` to be accessible in the browser code.

| Variable                   | Required | Description                                       |
| -------------------------- | -------- | ------------------------------------------------- |
| `VITE_TMDB_API_KEY`        | ✅ Yes   | Your TMDB API key (v3 auth)                       |
| `VITE_TMDB_TOKEN`          | ✅ Yes   | Your TMDB Bearer token (read access token)        |
| `VITE_TMDB_BASE_URL`       | ✅ Yes   | TMDB API base URL: `https://api.themoviedb.org/3` |
| `VITE_TMDB_IMAGE_BASE_URL` | Optional | Image CDN base: `https://image.tmdb.org/t/p`      |

**In code**, access them like:

```ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

> **Never commit your `.env` file!** It contains secret keys. The `.gitignore` already excludes it. Use `.env-example` as a template.

> **CI/CD nuance:** A developer's local `.env` is used only on that machine. GitHub-hosted Actions runners cannot read your machine's `.env`, so workflow builds must receive values from GitHub Secrets (or a generated env file created during the run).

---

## 14. Local Setup Guide

### What you need first (Prerequisites)

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org)
   - After installing, confirm: `node --version` should show `v18.x.x` or higher
2. **npm** — comes bundled with Node.js
   - Confirm: `npm --version`
3. **Git** — [Download here](https://git-scm.com)

### Step-by-Step Setup

**Step 1 — Clone the repository**

```bash
git clone <your-repo-url>
cd imdb-clone
```

**Step 2 — Install dependencies**

```bash
npm install
```

> This reads `package.json` and downloads all libraries into a `node_modules/` folder. Takes 30–60 seconds.

**Step 3 — Create your environment file**

```bash
cp .env-example .env
```

> This copies the template file. Now open `.env` in your editor and fill in your API keys (see Section 15 below).

**Step 4 — Fill in your `.env` file**

```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_TOKEN=your_bearer_token_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**Step 5 — Start the development server**

```bash
npm run dev
```

> Open your browser at **http://localhost:5173** — you should see the IMDBClone app!

**Step 6 — Try it out**

- Search for a movie on the home page
- Click a movie to see its details
- Login with: `john@example.com` / `password123`
- Add movies to your watchlist

### Local Deployment Preview (Production Build)

You do not need to copy files outside this project to preview locally.

Run from project root:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 8080
```

Open:

- [http://localhost:8080/](http://localhost:8080/)

---

## 15. Getting a TMDB API Key

TMDB (The Movie Database) is a free, community-maintained movie database. You need a free account to get API keys.

**Steps:**

1. Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup) and create a free account
2. Verify your email address
3. Go to your account Settings → **API** (left sidebar)
4. Click **"Create"** → choose **Developer** → accept terms
5. Fill in the form (describe it as a personal/learning project)
6. Once approved, you'll see:
   - **API Key (v3 auth)** → this goes in `VITE_TMDB_API_KEY`
   - **API Read Access Token** → this goes in `VITE_TMDB_TOKEN`

> API access is usually approved instantly for personal/learning projects.

---

## 16. Test Accounts

The auth system is mocked — no real backend. These accounts are pre-loaded:

| Name       | Email              | Password      |
| ---------- | ------------------ | ------------- |
| John Doe   | `john@example.com` | `password123` |
| Jane Smith | `jane@example.com` | `password123` |

You can also register new accounts via the `/register` page. Note: since there's no real database, new accounts disappear when you refresh the page (only the pre-loaded mock users persist across restarts).

---

## 18. Available Scripts

Run these commands from inside the `imdb-clone/` directory:

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Starts the dev server at `localhost:5173` with hot reload            |
| `npm run build`   | Type-checks with TypeScript then builds optimised files into `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally (test the production build)  |
| `npm run lint`    | Runs ESLint — checks for code style issues and TypeScript errors     |
| `npm run test`    | Runs tests in watch mode                                              |
| `npm run test:run`| Runs all tests once                                                   |
| `npm run test:coverage` | Runs tests and generates coverage reports                      |

> **Tip:** Always run `npm run build` before deploying to make sure there are no TypeScript errors.

---

## 19. Cloud Deployment

### Option A — GitHub Pages (Current Production)

This project is currently deployed with GitHub Actions to:
[https://kunalkachru.github.io/imdb-clone-typescript/](https://kunalkachru.github.io/imdb-clone-typescript/)

Key points in this repo:

- Router uses `HashRouter` (required for GitHub Pages route refresh behavior).
- `vite.config.ts` reads `VITE_BASE_URL` for subpath deployment.
- Deploy workflow: `.github/workflows/deploy.yml`
- Local deploy step runs only when:
  - an online self-hosted runner exists, and
  - `LOCAL_DEPLOY_PATH` repo secret is configured.

### CI/CD Pipeline Stages

1. `quality` job: lint -> test -> build
2. `detect-local-runner` job: checks whether self-hosted runner is available
3. `deploy-local` job (optional): copies `dist/` to local path on self-hosted runner
4. `deploy-cloud` job: publishes `dist/` to GitHub Pages

Required GitHub secrets:

- `VITE_TMDB_API_KEY`
- `VITE_TMDB_TOKEN`

### Option B — Vercel (Alternative)

Vercel is the easiest way to deploy a Vite app. It's free for personal projects.

1. Push your code to GitHub (make sure `.env` is in `.gitignore` — it already is)
2. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
3. Click **"Add New Project"** → import your GitHub repo
4. Vercel auto-detects Vite — framework should be **"Vite"**
5. **Add Environment Variables:** In the Vercel dashboard → Settings → Environment Variables, add:
   - `VITE_TMDB_API_KEY`
   - `VITE_TMDB_TOKEN`
   - `VITE_TMDB_BASE_URL` = `https://api.themoviedb.org/3`
   - `VITE_TMDB_IMAGE_BASE_URL` = `https://image.tmdb.org/t/p`
6. Click **Deploy** — your app will be live in ~1 minute!

> Every time you push to `main` branch, Vercel automatically redeploys.

---

### Option C — Netlify

1. Push code to GitHub
2. Go to [https://netlify.com](https://netlify.com) → New site from Git
3. Connect GitHub → select your repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add environment variables in Site Settings → Environment Variables
6. Deploy!

> **Important for Netlify:** Add a `_redirects` file inside `public/` folder with this content:
>
> ```
> /*    /index.html    200
> ```
>
> This tells Netlify to serve `index.html` for all routes (needed for React Router client-side routing).

---

### Option D — Docker (Advanced)

Use this if you want to run the app in a container, e.g. on a VPS or Kubernetes cluster.

**Create a `Dockerfile` in `imdb-clone/`:**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `nginx.conf`:**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and run:**

```bash
# Build the image
docker build -t imdb-clone .

# Run the container
docker run -p 8080:80 \
  -e VITE_TMDB_API_KEY=your_key \
  -e VITE_TMDB_TOKEN=your_token \
  -e VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 \
  imdb-clone
```

> **Note:** Vite bakes environment variables into the build at compile time. For Docker, you should set them before running `npm run build` (e.g. via `--build-arg` or a `.env` file inside the container). They are NOT read at runtime like a Node.js server would.

---

## 19. Common Errors & Fixes

| Error                                      | Likely Cause                             | Fix                                                                            |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------ |
| Blank white screen                         | Missing or wrong env variables           | Check `.env` file; restart dev server after changing `.env`                    |
| `Failed to fetch` / no movies              | Invalid TMDB API key or token            | Double-check keys in `.env`; ensure `VITE_TMDB_BASE_URL` has no trailing slash |
| `useAuth must be used inside AuthProvider` | Using `useAuth` outside `<AuthProvider>` | Make sure `<AuthProvider>` wraps your component in `main.tsx`                  |
| TypeScript error on build                  | Type mismatch or unused variable         | Read the error message — it tells you exactly which file and line              |
| `Module not found` error                   | Wrong import path                        | Check the file path; TypeScript paths are case-sensitive                       |
| Port 5173 already in use                   | Another app is using the port            | Kill the process or run `npm run dev -- --port 3000`                           |
| Watchlist resets on refresh                | `localStorage` not working               | Check browser settings — private/incognito mode can disable `localStorage`     |
| Login works but user disappears            | New registered users aren't persisted    | This is by design — only the 2 mock users survive a full page refresh in dev   |
| Vercel 404 on page refresh                 | SPA routing issue                        | Add `vercel.json` with rewrites, or ensure framework is set to Vite            |

**`vercel.json` for SPA routing (if needed):**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

_Built with ❤️ as a TypeScript + React learning project. Happy coding!_
