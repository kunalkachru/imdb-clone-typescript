# Plan: Sort the watchlist

## T1: Add watchlist sort selection and persisted ordering

Checks: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7

Files:
- src/pages/Watchlist.tsx

Tests:
- src/test/pages/Watchlist.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Watchlist.test.tsx

How to show: Add a controlled sort dropdown above the populated movie list with exactly the three specified labels, initialize it from a validated localStorage value with Recently added as the fallback, and persist changes under a stable watchlist-sort key. Derive the displayed list without mutating the reducer's insertion-order array: Recently added is newest-first insertion order, while title and rating sorts use that order as the stable tie-breaker. Render no dropdown for an empty watchlist, preserve the existing search, clear, navigation, and remove behavior, and do not add a timestamp field or change persisted movie records.

## T2: Cover every Watchlist sort, persistence, fallback, and empty-state behavior

Checks: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7

Files:
- src/test/pages/Watchlist.test.tsx

Tests:
- src/test/pages/Watchlist.test.tsx::renders the sort dropdown with Recently added selected by default
- src/test/pages/Watchlist.test.tsx::sorts movies by recently added order without changing persisted movie records
- src/test/pages/Watchlist.test.tsx::sorts movies by title A to Z with recently added tie-breakers
- src/test/pages/Watchlist.test.tsx::sorts movies by rating highest first with recently added tie-breakers
- src/test/pages/Watchlist.test.tsx::persists the selected sort and restores it after reload
- src/test/pages/Watchlist.test.tsx::falls back to Recently added for missing or invalid stored sort values
- src/test/pages/Watchlist.test.tsx::hides the sort dropdown for an empty watchlist
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Watchlist.test.tsx

How to show: Use multiple movie fixtures with distinct and equal titles/ratings to assert the rendered heading order, verify the exact option set and selected value, inspect localStorage after a selection, rerender with the stored value to simulate reload, verify missing and invalid values fall back correctly, and assert the empty-watchlist UI remains while the dropdown is absent.

## T3: Preserve MovieDetail add and remove watchlist actions

Checks: AC-8

Files:
- src/test/pages/MovieDetail.test.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx::renders movie detail and dispatches add to watchlist
- src/test/pages/MovieDetail.test.tsx::renders movie detail and dispatches remove from watchlist
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Retain the existing add-action regression assertion and add the corresponding already-in-watchlist case, asserting the unchanged REMOVE_MOVIE action and movie id after clicking the current button label; run the focused MovieDetail tests and the full Vitest command from the repository instructions.
