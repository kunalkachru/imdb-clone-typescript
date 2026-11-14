# Plan: Hide unknown movie runtime

## T1: Render the runtime segment only when runtime is present

Checks: AC-1, AC-2, AC-3

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.runtime.test.tsx

How to show: Adjust the details-line runtime rendering to distinguish an absent runtime from a valid numeric value, including `0`; the unknown-runtime case must render no runtime segment, while known values retain the ` min` suffix.

## T2: Make runtime regression coverage assert unknown, known, and zero values

Checks: AC-1, AC-2, AC-3

Files:
- src/test/pages/MovieDetail.runtime.test.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx::omits runtime when runtime is unknown
- src/test/pages/MovieDetail.runtime.test.tsx::renders known runtime with min suffix
- src/test/pages/MovieDetail.runtime.test.tsx::renders zero runtime with min suffix
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Replace the current bug-reproduction expectation with an absence assertion and add fixtures/assertions for a positive runtime and `runtime: 0`; run the focused test file and the full Vitest suite successfully.
