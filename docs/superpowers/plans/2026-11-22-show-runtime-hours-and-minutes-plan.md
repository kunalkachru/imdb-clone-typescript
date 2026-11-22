## T1: Format known movie detail runtimes with labeled hours and minutes

Checks: AC-1, AC-2, AC-3

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx

How to show: Update the movie detail runtime formatter so positive runtimes use the exact `<hours> h <minutes> min` form, including `2 h 15 min` for 135 minutes and `0 h 45 min` for 45 minutes. Keep the existing conditional rendering that omits the runtime segment for undefined, null, and zero values.

## T2: Update focused runtime regression coverage

Checks: AC-1, AC-2, AC-3

Files:
- src/test/pages/MovieDetail.runtime.test.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > renders 135-minute runtime as hours and minutes
- src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > renders 45-minute runtime as minutes only
- src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > omits runtime when runtime is unknown
- src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > omits runtime when runtime is null
- src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > omits runtime when runtime is zero
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.runtime.test.tsx

How to show: Assert the exact `2 h 15 min` and `0 h 45 min` strings, assert that `2h 15m`, `135 min`, and `45m` are absent, and retain no-runtime assertions for unknown, null, and zero runtime data. Run the focused runtime test file with the repository's required TMDB environment variables.

## T3: Verify application-wide regression safety

Checks: AC-4

Files:
- src/pages/MovieDetail.tsx
- src/test/pages/MovieDetail.runtime.test.tsx

Tests:
- src/test/pages/MovieDetail.runtime.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Run the complete Vitest suite and confirm all existing behavior outside movie detail runtime formatting remains unchanged, with no unrelated test regressions.
