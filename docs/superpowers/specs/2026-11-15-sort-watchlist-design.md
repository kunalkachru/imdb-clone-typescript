# Spec v2: S-61

## Goal
Add a sort dropdown above the populated Watchlist page at `/#/watchlist`. The dropdown offers “Recently added” as the default, “Title A to Z”, and “Rating highest first”. The selected sort is saved in `localStorage` and restored after a page reload. The dropdown is absent when the watchlist is empty, and existing add/remove watchlist behavior remains unchanged.

## Acceptance checks
- AC-1: A non-empty Watchlist page renders a sort dropdown above the movie list with exactly the options “Recently added”, “Title A to Z”, and “Rating highest first”, with “Recently added” selected by default (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-2: With multiple movies in the watchlist, “Recently added” renders movies in newest-first insertion order, uses no new timestamp field, and preserves that order when movie records are persisted (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-3: Selecting “Title A to Z” renders all watchlist movies in ascending title order, with equal titles retaining the recently-added order (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-4: Selecting “Rating highest first” renders all watchlist movies in descending rating order, with equal ratings retaining the recently-added order (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-5: Selecting a non-default sort writes that choice to localStorage, and reloading the Watchlist page restores both the selected choice and its corresponding movie order (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-6: When the stored sort value is missing or invalid, the Watchlist page selects Recently added and renders movies in newest-first insertion order (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-7: An empty Watchlist page does not render the sort dropdown and continues to render the existing empty-watchlist state (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-8: Adding a movie still dispatches the existing add action and removing a movie still dispatches the existing remove action without changing their current behavior (how to see it: test: src/test/pages/MovieDetail.test.tsx)

## Affected areas
- (none)

## Risks
- (none)

## New packages
- (none)

## Choices
- Recently added means the order movies were added to the watchlist, newest first; use the existing insertion order and do not add a timestamp field.
- For equal ratings or equal titles, retain recently-added order as the tie-breaker.
- If the stored sort value is missing or invalid, use Recently added.

## Assumptions
- (none)

## Docs used
- (none)
