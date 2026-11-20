# Plan: Actors sort control (S-136)

## T1: Add the Actors sort control and persisted sorted view

Checks: AC-1, AC-2, AC-3, AC-4, AC-5

Files:
- src/pages/Actors.tsx

Tests:
- src/test/pages/Actors.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Actors.test.tsx

How to show: Add an accessible control above the actor grid with exactly `Popularity` and `Name A to Z`, defaulting to `Popularity` when localStorage is absent or invalid. Persist the validated selection under a stable Actors-sort localStorage key, restore it on mount, and derive the displayed cards from the loaded actor array without mutating it: Popularity retains page-one response order followed by appended pages, while Name A to Z sorts ascending by actor name with stable equal-name ordering. Keep fetching, pagination, loading/error states, photo/placeholder rendering, and navigation behavior unchanged.

## T2: Cover Actors sorting, persistence, fallback, and pagination behavior

Checks: AC-1, AC-2, AC-3, AC-4, AC-5

Files:
- src/test/pages/Actors.test.tsx

Tests:
- src/test/pages/Actors.test.tsx::renders the accessible sort control with Popularity selected by default
- src/test/pages/Actors.test.tsx::sorts all loaded actors by name with stable equal-name ordering
- src/test/pages/Actors.test.tsx::preserves paginated TMDB order for Popularity and restores it after switching back
- src/test/pages/Actors.test.tsx::persists Name A to Z and restores the selected option and order after remounting
- src/test/pages/Actors.test.tsx::falls back to Popularity for missing or invalid saved sort values
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Actors.test.tsx

How to show: Use actor fixtures with deliberately unsorted names, duplicate names, and distinct page responses to assert the exact option set, selected value, stable alphabetical order, original page-append order, localStorage contents, and restored order after a remount. Exercise both missing and invalid saved values, while retaining the existing loading, pagination, photo/placeholder, route-access, and unrelated behavior assertions.

## T3: Run the complete Actors and application regression checks

Checks: AC-6

Files:
- src/pages/Actors.tsx
- src/test/pages/Actors.test.tsx

Tests:
- src/test/pages/Actors.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run

How to show: Run the focused Actors test file and then the repository’s full Vitest command, confirming existing loading, pagination, photo/placeholder, route-access, and unrelated application behavior continue to pass without new failures alongside the sort-control coverage.
