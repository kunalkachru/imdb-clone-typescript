# Spec v1: S-117

## Goal
Let any visitor save or remove movies from a personal watchlist from both movie cards and the movie details page. Provide a Watchlist destination in the shared navigation, render saved movies there with a useful empty state, and persist the list in browser storage so it survives a page reload. The watchlist is available without login; authenticated users continue to use their user-scoped storage key, while visitors use the existing `watchlist:guest` fallback. In-app routes use the accepted HashRouter convention: `/#/watchlist` and `/#/movie/:id`.

## Acceptance checks
- AC-1: A movie card on the Home page shows an accessible add-to-watchlist toggle, clicking it adds that movie, and clicking the same toggle again removes it without navigating to the movie details page (how to see it: test: src/test/pages/Home.test.tsx)
- AC-2: The movie details page shows “Add to Watchlist” for an unsaved movie and “Remove from Watchlist” for a saved movie, and each action updates the shared watchlist state (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-3: The navigation renders a Watchlist link for both guest and authenticated users and that link targets the watchlist route (how to see it: test: src/test/components/Navbar.test.tsx)
- AC-4: The Watchlist page at `/watchlist` lists every saved movie as a navigable movie card and supports removing a movie from its card without removing other saved movies (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-5: An empty Watchlist page renders an empty-state message and a Browse Movies action, with no movie cards, poster images, or sign-in requirement message (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-6: Adding a movie, removing a movie, or clearing the watchlist writes the resulting complete movie list to the active localStorage key, and a new provider instance restores that list after reload (how to see it: test: src/test/context/WatchlistContext.test.tsx)
- AC-7: A guest can open `/watchlist` and see the Watchlist page instead of being redirected to `/login` (how to see it: test: src/test/components/ProtectedRoute.test.tsx)
- AC-8: The app uses HashRouter-compatible in-app paths so the Watchlist link resolves to `/#/watchlist` and movie links resolve to `/#/movie/:id` in the mounted application (how to see it: test: src/test/App.test.tsx)
- AC-9: Existing application behavior remains unchanged outside the watchlist behavior (how to see it: test: the full suite)

## Affected areas
- (none)

## Risks
- (none)

## New packages
- (none)

## Choices
- (none)

## Assumptions
- (none)

## Docs used
- (none)
