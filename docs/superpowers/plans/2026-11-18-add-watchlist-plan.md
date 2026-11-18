## T1: Make watchlist state persist complete guest and user lists

Checks: AC-6
Files:
- `src/context/WatchlistContext.tsx`
- `src/test/context/WatchlistContext.test.tsx`
Tests:
- `src/test/context/WatchlistContext.test.tsx::persists adding, removing, and clearing the complete active watchlist`
- `src/test/context/WatchlistContext.test.tsx::restores the guest watchlist in a new provider instance`
- `src/test/context/WatchlistContext.test.tsx::persists authenticated watchlists under the user-scoped key`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/context/WatchlistContext.test.tsx`
How to show:
- Exercise `ADD_MOVIE`, `REMOVE_MOVIE`, and `CLEAR` through a test harness, assert after each action that the active `watchlist:1` or `watchlist:guest` key contains exactly the resulting full movie array, unmount and mount a fresh provider, and assert the restored list matches storage. Preserve the existing user-switch tests so a prior user’s movies cannot be written into the next user’s key, and make malformed or absent storage resolve to an empty list without breaking provider initialization.

## T2: Add accessible card toggles and preserve movie-detail actions

Checks: AC-1, AC-2
Files:
- `src/components/MovieCard.tsx`
- `src/pages/Home.tsx`
- `src/pages/MovieDetail.tsx`
- `src/test/pages/Home.test.tsx`
- `src/test/pages/MovieDetail.test.tsx`
Tests:
- `src/test/pages/Home.test.tsx::adds and removes a movie from the card watchlist toggle without navigating`
- `src/test/pages/Home.test.tsx::renders an accessible watchlist toggle state for a saved movie`
- `src/test/pages/MovieDetail.test.tsx::renders Add to Watchlist and dispatches add for an unsaved movie`
- `src/test/pages/MovieDetail.test.tsx::renders Remove from Watchlist and dispatches remove for a saved movie`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Home.test.tsx src/test/pages/MovieDetail.test.tsx`
How to show:
- Give each rendered movie card a labeled add/remove control that reads the shared `isInWatchlist(movie.id)` state, dispatches `ADD_MOVIE` or `REMOVE_MOVIE` with the movie/id payload, and stops click propagation so toggling does not invoke the card’s movie navigation. Reuse the same card behavior wherever saved movies are displayed, and retain the detail-page labels exactly as “Add to Watchlist” and “Remove from Watchlist” while asserting the corresponding shared-state dispatches.

## T3: Expose an unprotected Watchlist route and render saved or empty content

Checks: AC-3, AC-4, AC-5, AC-7, AC-8
Files:
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/pages/Watchlist.tsx`
- `src/test/components/Navbar.test.tsx`
- `src/test/components/ProtectedRoute.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
- `src/test/App.test.tsx`
Tests:
- `src/test/components/Navbar.test.tsx::renders the Watchlist link for guests and authenticated users`
- `src/test/components/ProtectedRoute.test.tsx::renders the application Watchlist route for a guest without redirecting to login`
- `src/test/pages/Watchlist.test.tsx::renders every saved movie as a navigable card and removes only the selected movie`
- `src/test/pages/Watchlist.test.tsx::renders the empty state with Browse Movies and no movie cards or sign-in message`
- `src/test/App.test.tsx::resolves watchlist and movie links with HashRouter-compatible paths`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/components/Navbar.test.tsx src/test/components/ProtectedRoute.test.tsx src/test/pages/Watchlist.test.tsx src/test/App.test.tsx`
How to show:
- Keep the Watchlist navigation link visible for both auth states with `to="/watchlist"`, remove the login guard from the application’s `/watchlist` route, and retain the existing search/sort/clear behavior while ensuring saved cards link to `/movie/:id` and their remove control does not navigate or remove other records. With an empty list, show an empty-state message and a `Browse Movies` action only—no movie cards, poster images, or sign-in requirement copy. Mount the route shell through the existing HashRouter setup and assert the resulting watchlist and movie href/path conventions.

## T4: Run the full regression suite for watchlist integration

Checks: AC-9
Files:
- `src/test/App.test.tsx`
- `src/test/pages/Home.test.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
- `src/test/context/WatchlistContext.test.tsx`
- `src/test/components/Navbar.test.tsx`
- `src/test/components/ProtectedRoute.test.tsx`
Tests:
- `src/test/App.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the complete Vitest command after the focused checks, confirm all existing non-watchlist behavior still passes alongside the new watchlist coverage, and use any failure to adjust only the affected watchlist integration while preserving unrelated assertions.
