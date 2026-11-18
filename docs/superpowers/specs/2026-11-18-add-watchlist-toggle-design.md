# Spec v1: S-112

## Goal
Add a user-scoped watchlist workflow to the movie discovery experience. Every rendered movie card and the movie details page expose a toggle that adds or removes that movie, the navigation exposes the Watchlist page, saved movies are listed there with an empty state when none are saved, and saved state survives a page reload.

## Acceptance checks
- AC-1: Every movie card in the home/search movie grid exposes an accessible add/remove watchlist toggle; activating an unselected card toggle adds that card's movie, activating a selected card toggle removes it, and activating the toggle does not navigate to the movie detail page (how to see it: test: src/test/pages/Home.test.tsx)
- AC-2: The movie details page exposes an accessible watchlist toggle that adds the displayed movie when it is absent and removes it when it is present, with the toggle state and accessible name updating after each action (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-3: The primary navigation contains a link named "Watchlist" targeting the watchlist route for both guest and authenticated navigation states (how to see it: test: src/test/components/Navbar.test.tsx)
- AC-4: The Watchlist page renders every saved movie as a movie card with its title and an active remove toggle, and removing a card removes that movie from the rendered list (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-5: An empty Watchlist page renders the text "No movies in your watchlist yet", renders no saved movie cards, and does not render a movie-card toggle (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-6: Adding or removing a movie updates the active user's watchlist storage, and remounting the watchlist provider after a page reload restores the saved movie state (how to see it: test: src/test/context/WatchlistContext.test.tsx)
- AC-7: Existing application behavior remains unchanged apart from the watchlist additions (how to see it: test: the full suite)

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
