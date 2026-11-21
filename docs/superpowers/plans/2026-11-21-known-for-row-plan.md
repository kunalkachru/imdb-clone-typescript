# Plan: Actors Known for row (S-140)

## T1: Add typed actor movie-credit fetching

Checks: AC-3

Files:
- src/types/person.ts
- src/services/tmdb.ts
- src/test/services/tmdb.test.ts

Tests:
- src/test/services/tmdb.test.ts::requests an actor's movie credits with title, popularity, and release date

How to show: Define the movie-credit shape with the fields needed by the Actors page, add a service function that requests TMDB's actor movie-credits endpoint by person id, and preserve the API's title, popularity, and release date values in the returned result. Mock fetch and assert the exact endpoint, query handling, and response fields used by the page.

## T2: Load and render each actor's Known for row

Checks: AC-1, AC-2

Files:
- src/pages/Actors.tsx
- src/types/person.ts
- src/test/pages/Actors.test.tsx

Tests:
- src/test/pages/Actors.test.tsx::renders each actor's three most popular movies in a Known for row
- src/test/pages/Actors.test.tsx::shows each known-for movie release year in its tooltip

How to show: Fetch movie credits for every rendered actor, rank each actor's credits by TMDB popularity descending, cap the result at three, and render a `Known for` row inside each actor card. Render fewer titles when the credit list is shorter, and expose each title's release year as its tooltip text. Keep actor pagination and sorting based on the existing actor collection, retain photo/placeholder rendering, and leave the actor route and navigation behavior unchanged.

## T3: Add focused Actors acceptance coverage

Checks: AC-1, AC-2

Files:
- src/test/pages/Actors.test.tsx

Tests:
- src/test/pages/Actors.test.tsx::renders each actor's three most popular movies in a Known for row
- src/test/pages/Actors.test.tsx::shows each known-for movie release year in its tooltip
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Actors.test.tsx

How to show: Use actor-specific credit fixtures with more than three entries in unsorted popularity order, fewer than three entries, and release dates. Assert the exact descending title order, the three-item limit, the shorter row, the `Known for` label, and each title's exact release-year tooltip. Continue using the existing actor fixtures and assertions for sorting, pagination, photo/placeholder rendering, and route access.

## T4: Run the complete regression suite

Checks: AC-4

Files:
- src/pages/Actors.tsx
- src/services/tmdb.ts
- src/types/person.ts
- src/test/pages/Actors.test.tsx
- src/test/services/tmdb.test.ts

Tests:
- src/test/pages/Actors.test.tsx
- src/test/services/tmdb.test.ts
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Run the focused Actors and TMDB service tests, then the repository's full Vitest command. Confirm the existing actor sorting, pagination, photo/placeholder rendering, unauthenticated route access, and unrelated application tests pass without new failures.
