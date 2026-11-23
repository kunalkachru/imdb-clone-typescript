## T1: Update the Watchlist sort control to the requested labels

Checks: AC-1, AC-2, AC-3, AC-4

Files:
- src/pages/Watchlist.tsx

Tests:
- src/test/pages/Watchlist.test.tsx

How to show: Keep the existing non-empty-watchlist combobox, `Recently added` default, internal sort values, localStorage key, sorting algorithms, and remount initialization. Change the accessible label to `Sort by` and the requested option text to `Title A–Z`, `Rating (high to low)`, and `Release date (newest)`, while retaining the existing `Recently added` option and release-date persistence value so all three selections continue to order and restore correctly.

## T2: Add focused coverage for requested choices and persistence

Checks: AC-1, AC-2, AC-3, AC-4

Files:
- src/test/pages/Watchlist.test.tsx

Tests:
- src/test/pages/Watchlist.test.tsx::Watchlist page > renders the sort dropdown with Recently added selected by default
- src/test/pages/Watchlist.test.tsx::sorts movies by title A–Z
- src/test/pages/Watchlist.test.tsx::sorts movies by rating high to low
- src/test/pages/Watchlist.test.tsx::sorts movies by release date newest first with undated movies last
- src/test/pages/Watchlist.test.tsx::persists the selected sort and restores it after reload
- src/test/pages/Watchlist.test.tsx::persists and restores the Release date sort
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Watchlist.test.tsx

How to show: Update the focused Watchlist assertions to query the combobox by accessible name `Sort by` and verify the exact option texts. Use fixtures with distinct titles, ratings, dated releases, and undated releases to prove each requested order; select each requested option, verify its internal persisted value, unmount and remount, then verify the selected label and corresponding order, including `Release date (newest)`.

## T3: Verify unchanged Watchlist and application behavior

Checks: AC-5

Files:
- src/pages/Watchlist.tsx
- src/test/pages/Watchlist.test.tsx

Tests:
- src/test/pages/Watchlist.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run

How to show: Run the focused Watchlist file and the complete Vitest suite. Confirm existing empty-state, search, card rendering, add/remove/clear, recently-added behavior, sort fallback, movie-record persistence, and other application tests pass with no behavior changes beyond the requested sort label and choice text.
