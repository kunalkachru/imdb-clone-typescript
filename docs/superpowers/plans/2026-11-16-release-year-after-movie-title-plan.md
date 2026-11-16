# Plan: Show release year after movie detail title

## T1: Render the formatted release year in the movie detail heading

Checks: AC-1, AC-2

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/utils/formatMovieTitle.test.ts
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/utils/formatMovieTitle.test.ts

How to show: Import the existing title formatter into the movie detail page and use it for the `<h1>`, so a valid release date contributes its four-digit year in parentheses while an absent release date leaves the title unchanged; preserve the existing title formatting behavior covered by the utility tests.

## T2: Add movie detail heading regressions for dated and undated movies

Checks: AC-1, AC-2

Files:
- src/test/pages/MovieDetail.test.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx::renders the movie title with its release year
- src/test/pages/MovieDetail.test.tsx::renders only the movie title when release date is missing
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Add page-level fixtures for `Inception` with `2010-01-01` and with no release date, assert the heading contains exactly `Inception (2010)` in the first case, and assert `Inception` is present while `Inception (` and empty brackets are absent in the second; run the focused MovieDetail tests and the complete Vitest suite successfully.
