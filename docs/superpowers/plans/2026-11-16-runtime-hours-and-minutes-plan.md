# Plan: Show movie runtime as hours and minutes

## T1: Format the movie detail runtime in hours and minutes

Checks: AC-1, AC-2, AC-3

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.runtime.test.tsx

How to show: Update the runtime segment in the movie detail details line to render whole hours followed by remaining minutes, omit the hour portion when it is zero, and render no segment when runtime is absent; a 135-minute runtime must appear as `2h 15m`, a 45-minute runtime as `45m`, and neither case may retain the old `min` wording.

## T2: Add runtime-format regression coverage

Checks: AC-1, AC-2, AC-3

Files:
- src/test/pages/MovieDetail.runtime.test.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx::renders 135-minute runtime as hours and minutes
- src/test/pages/MovieDetail.runtime.test.tsx::renders 45-minute runtime as minutes only
- src/test/pages/MovieDetail.runtime.test.tsx::omits runtime when runtime is unknown
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Replace the legacy `min` expectation with focused page-level assertions for exact `2h 15m` and `45m` output, assert that `135 min` and `45 min` are absent, and preserve the no-runtime coverage for missing or null runtime data; run the focused runtime test file and the full Vitest suite successfully.
