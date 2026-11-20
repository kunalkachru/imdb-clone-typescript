# Spec v1: S-133

## Goal
On the Watchlist page, add a Release year sort option that orders movies by newest release first and places movies without a release date last. Show the arithmetic average of all watchlist movies' `vote_average` values next to the heading count, formatted to one decimal place, and omit it when the watchlist is empty. Preserve the existing sort choices and the remembered sort choice.

## Acceptance checks
- AC-1: A non-empty Watchlist sort control keeps `Recently added`, `Title A to Z`, and `Rating highest first`, and adds a `Release year` option (how to see it: test: src/test/pages/Watchlist.test.tsx::Watchlist page > renders the sort dropdown with Recently added selected by default)
- AC-2: Selecting `Release year` orders movies by newest release date/year first, places every movie with an empty release date after dated movies, and preserves the existing insertion-order tie behavior (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-3: Selecting `Release year` stores that choice in `localStorage`, and remounting the Watchlist restores the choice and release-year order (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-4: A non-empty Watchlist heading shows the watchlist count and the arithmetic mean of every movie's `vote_average`, labeled as the average rating and formatted with exactly one decimal place (how to see it: test: src/test/pages/Watchlist.test.tsx::Watchlist page > shows the total count in the headline when no search is active)
- AC-5: While searching, the heading retains the matching-film count and shows the overall watchlist average rating formatted with exactly one decimal place (how to see it: test: src/test/pages/Watchlist.test.tsx::Watchlist page > shows the number of matching films in the headline while searching)
- AC-6: An empty Watchlist hides the average rating and continues to show the existing empty-watchlist state and no sort control (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-7: The existing sort choices, remembered sort restoration, add/remove/clear actions, search behavior, and movie-card rendering continue to pass without new failures (how to see it: test: the full suite)

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
