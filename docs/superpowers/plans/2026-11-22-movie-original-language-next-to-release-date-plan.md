## T1: Move original language into the release metadata row

Checks: AC-1, AC-2

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/pages/MovieDetail.financials.test.tsx

How to show: Render the original language beside the existing release year in the first metadata row using the human-readable `Intl.DisplayNames` result, and remove the separate `Original language ...` metadata item. Keep the conditional rendering so a missing language omits only the language value while the release year remains visible.

## T2: Update focused movie detail regression coverage

Checks: AC-1, AC-2

Files:
- src/test/pages/MovieDetail.financials.test.tsx

Tests:
- src/test/pages/MovieDetail.financials.test.tsx::MovieDetail financials and original language > renders the original language as a name
- src/test/pages/MovieDetail.financials.test.tsx::MovieDetail financials and original language > omits the original language when it is missing
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run src/test/pages/MovieDetail.financials.test.tsx

How to show: Assert that `2020` and `English` render together in the release metadata row, that no separate `Original language English` item is present, and that a movie without `original_language` still renders `2020` without any original-language value.

## T3: Verify application-wide regression safety

Checks: AC-3

Files:
- src/pages/MovieDetail.tsx
- src/test/pages/MovieDetail.financials.test.tsx

Tests:
- src/test/pages/MovieDetail.financials.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Run the complete Vitest suite and confirm the original-language placement change introduces no new failures in unrelated movie-page or application behavior.
