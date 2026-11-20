# Plan: Watchlist release-year sort and average rating (S-133)

## T1: Add release-year sorting and watchlist average to the Watchlist page
Checks: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
Files:
- src/pages/Watchlist.tsx
Tests:
- src/test/pages/Watchlist.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Watchlist.test.tsx
How to show: Extend the validated sort values with `release-year` and add the `Release year` option while retaining the three existing labels and the `watchlist-sort` localStorage key. Derive release-year order from a copy of the watchlist, sorting dated movies newest first, placing empty release dates after dated movies, and preserving the existing insertion-order tie behavior; keep Recently added, title, rating, search, card, add/remove, clear, and persisted movie-record behavior unchanged. Derive the arithmetic mean from every movie in the full watchlist, format it to exactly one decimal place beside the heading count for both normal and search headings, and omit it when the watchlist is empty.

## T2: Add focused coverage for release-year sorting, persistence, and average-rating display
Checks: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
Files:
- src/test/pages/Watchlist.test.tsx
Tests:
- src/test/pages/Watchlist.test.tsx::renders the sort dropdown with Recently added selected by default
- src/test/pages/Watchlist.test.tsx::sorts movies by release year with undated movies last and insertion-order tie-breakers
- src/test/pages/Watchlist.test.tsx::persists and restores the release-year sort after remounting
- src/test/pages/Watchlist.test.tsx::shows the overall average rating beside the total count
- src/test/pages/Watchlist.test.tsx::shows the overall average rating beside the matching count while searching
- src/test/pages/Watchlist.test.tsx::hides the average rating and sort dropdown for an empty watchlist
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Watchlist.test.tsx
How to show: Expand the exact option-list assertion to include `Release year`; use dated, undated, and tied-year fixtures to assert newest-first ordering, all undated movies last, and stable insertion-order ties. Select the new option, assert `localStorage` contains `release-year`, remount with the stored value, and assert both the selected option and order. Use ratings whose arithmetic mean needs one-decimal formatting to assert the average beside the full count and beside a filtered matching count while searching, prove the search heading still counts matches, and assert the empty state has neither average text nor a sort control while retaining its existing content. Preserve the existing tests for title/rating sorting, fallback, search, add/remove, clear, and card rendering.

## T3: Run the complete Watchlist and application regression checks
Checks: AC-7
Files:
- src/pages/Watchlist.tsx
- src/test/pages/Watchlist.test.tsx
Tests:
- src/test/pages/Watchlist.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run
How to show: Run the focused Watchlist test file and then the repository’s full Vitest command, confirming the existing sort choices and remembered-sort behavior, add/remove/clear actions, search behavior, and movie-card rendering continue to pass alongside the new release-year and average-rating assertions.
