## T1: Add focused acceptance tests for movie financials and original language

Checks: AC-1, AC-2, AC-3, AC-4
Files:
- `src/test/pages/MovieDetail.financials.test.tsx`
- `src/types/movie.ts`
Tests:
- `src/test/pages/MovieDetail.financials.test.tsx::renders compact budget and box office amounts`
- `src/test/pages/MovieDetail.financials.test.tsx::renders the original language as a name`
- `src/test/pages/MovieDetail.financials.test.tsx::omits unknown or zero budget and box office independently`
- `src/test/pages/MovieDetail.financials.test.tsx::formats smaller positive money values compactly`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.financials.test.tsx`
How to show:
- Create a focused `MovieDetail` fixture/render helper that supplies the existing required movie fields plus `budget`, `revenue`, and `original_language`. Assert the exact AC-1 values `$63M` and `$1.2B`, `English` without a displayed `en` code, independent omission of zero/unknown financial fields, and `$950K`/`$125K` for smaller positive values. Extend `MovieDetail` so these TMDB detail fields are typed as optional nullable values suitable for incomplete fixtures and API responses. Run the focused file before implementation to establish the expected failing behavior.

## T2: Render compact financial metadata and the original-language name

Checks: AC-1, AC-2, AC-3, AC-4
Files:
- `src/pages/MovieDetail.tsx`
- `src/types/movie.ts`
- `src/test/pages/MovieDetail.financials.test.tsx`
Tests:
- `src/test/pages/MovieDetail.financials.test.tsx::renders compact budget and box office amounts`
- `src/test/pages/MovieDetail.financials.test.tsx::renders the original language as a name`
- `src/test/pages/MovieDetail.financials.test.tsx::omits unknown or zero budget and box office independently`
- `src/test/pages/MovieDetail.financials.test.tsx::formats smaller positive money values compactly`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.financials.test.tsx`
How to show:
- Add a compact USD formatter in `MovieDetail.tsx` using English locale compact notation with at most one decimal place so positive values render as `$63M`, `$1.2B`, `$950K`, and `$125K`, without raw integer output. Render Budget and Box office metadata only when `budget`/`revenue` are finite and greater than zero, independently of one another. Resolve `original_language` with the platform language display-name API for an English name, render `English` for `en`, and do not expose the raw code as the displayed value. Place the new metadata in the existing movie detail information area without changing the surrounding rating, runtime, genres, overview, homepage, watchlist, or survey behavior. Run the focused tests and confirm all four named checks pass.

## T3: Verify the complete movie page and application regression suite

Checks: AC-5
Files:
- `src/types/movie.ts`
- `src/pages/MovieDetail.tsx`
- `src/test/pages/MovieDetail.financials.test.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/MovieDetail.runtime.test.tsx`
Tests:
- `src/test/pages/MovieDetail.financials.test.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/MovieDetail.runtime.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the full Vitest command from the repository root and confirm every existing and new test passes. Review the focused page tests alongside existing movie-detail tests to demonstrate that only budget, box-office, and original-language metadata was added, with no regression to title/year, rating/vote count, runtime, navigation, watchlist, survey, loading, error, or unrelated application behavior.
