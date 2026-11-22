## T1: Implement the movie-page copy-link interaction

Checks: AC-1, AC-2, AC-3

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx

How to show: Add an accessible button whose initial name is `Copy link` to the loaded movie detail view. On activation, call `navigator.clipboard.writeText` with the current page URL, change the button text to `Link copied`, and schedule the label to return to `Copy link` after exactly 2 seconds; clean up any pending timer when the component unmounts or the interaction is superseded.

## T2: Add focused copy-link behavior coverage

Checks: AC-1, AC-2, AC-3

Files:
- src/test/pages/MovieDetail.test.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx::renders an accessible Copy link button on a loaded movie
- src/test/pages/MovieDetail.test.tsx::copies the current movie URL and shows Link copied after activation
- src/test/pages/MovieDetail.test.tsx::keeps Link copied visible before two seconds and restores Copy link at two seconds
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx

How to show: Mock the browser clipboard, render the loaded `/movie/1` route, assert the button is discoverable by its accessible `Copy link` name, verify activation writes the current movie URL and immediately exposes `Link copied`, and use fake timers to prove the copied label remains before 2 seconds and returns to `Copy link` at 2 seconds.

## T3: Verify application-wide regression safety

Checks: AC-4

Files:
- src/pages/MovieDetail.tsx
- src/test/pages/MovieDetail.test.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run

How to show: Run the complete Vitest suite with the repository-required TMDB environment variables and confirm existing movie-page, routing, survey, watchlist, and unrelated application behavior remains green outside the new copy-link interaction.
