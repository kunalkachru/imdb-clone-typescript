## T1: Complete user-scoped watchlist persistence and toggle state contract

Checks: AC-6
Files:
- `src/context/WatchlistContext.tsx`
- `src/types/watchlist.ts`
- `src/hooks/useWatchlist.ts`
- `src/test/context/WatchlistContext.test.tsx`
Tests:
- `src/test/context/WatchlistContext.test.tsx`
How to show: Exercise add and remove actions for the active user, assert the corresponding `watchlist:<userId>` localStorage record changes, then unmount and remount the provider with the same authenticated user and assert the saved movie is restored. Preserve separate storage keys when the authenticated user changes and tolerate an empty stored list.

## T2: Add an accessible reusable movie-card watchlist toggle and integrate it into the home/search grid

Checks: AC-1
Files:
- `src/components/MovieCard.tsx`
- `src/pages/Home.tsx`
- `src/App.css`
- `src/test/pages/Home.test.tsx`
Tests:
- `src/test/pages/Home.test.tsx`
How to show: Render home/search results with a watchlist context, verify every rendered card has an accessible add/remove toggle whose name reflects its state, click an unselected toggle and assert the movie is added, click it again and assert it is removed, and verify the click does not change the route to `/movie/:id`. Verify the card’s movie link/navigation remains available through the rest of the card.

## T3: Make the movie-details watchlist toggle stateful and accessible

Checks: AC-2
Files:
- `src/pages/MovieDetail.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/MovieDetail.runtime.test.tsx`
Tests:
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/MovieDetail.runtime.test.tsx`
How to show: With the fetched movie absent from the watchlist, assert the accessible add toggle dispatches `ADD_MOVIE`, then verify the rendered control changes to the remove name/state; with the movie present, assert `REMOVE_MOVIE` and the inverse state update. Keep existing detail title, runtime, survey, and navigation behavior passing.

## T4: Expose Watchlist in navigation and render saved movies plus the empty state

Checks: AC-3, AC-4, AC-5
Files:
- `src/components/Navbar.tsx`
- `src/App.tsx`
- `src/pages/Watchlist.tsx`
- `src/test/components/Navbar.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
- `src/test/App.test.tsx`
Tests:
- `src/test/components/Navbar.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
- `src/test/App.test.tsx`
How to show: In both guest and authenticated navigation contexts, assert a link named `Watchlist` targets the watchlist route. On the route, render each saved movie with its title and an active accessible remove toggle; removing one removes it from the list. With no saved movies, assert exactly the required `No movies in your watchlist yet` text, no movie cards, and no movie-card toggle. Preserve the existing protected-route behavior and Watchlist page sorting/search controls.

## T5: Run the complete regression suite and verify unchanged application behavior

Checks: AC-7
Files:
- `src/test/App.test.tsx`
- `src/test/components/Navbar.test.tsx`
- `src/test/context/WatchlistContext.test.tsx`
- `src/test/pages/Home.test.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
Tests:
- `src/test/App.test.tsx`
- `src/test/components/Navbar.test.tsx`
- `src/test/context/WatchlistContext.test.tsx`
- `src/test/pages/Home.test.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show: Run the full Vitest suite and require all existing and new tests to pass, including route rendering, authentication, movie details, search/pagination, Watchlist sorting/search, survey behavior, and the new add/remove/persistence flows.
