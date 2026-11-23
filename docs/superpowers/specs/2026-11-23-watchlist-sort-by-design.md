# Spec v1: S-155

## Goal
Update the Watchlist sort dropdown to use the owner-requested “Sort by” label and choice text. The existing sort implementation and remembered selection remain available: choosing a sort orders the saved movies accordingly, and the selected choice is restored after a page reload. The existing “Recently added” default remains because this request does not ask to remove it.

## Acceptance checks
- AC-1: A non-empty Watchlist renders a combobox labeled `Sort by` with the existing `Recently added` default and the requested choices `Title A–Z`, `Rating (high to low)`, and `Release date (newest)` (how to see it: test: src/test/pages/Watchlist.test.tsx::Watchlist page > renders the sort dropdown with Recently added selected by default)
- AC-2: Selecting `Title A–Z` orders all Watchlist movies by ascending title, selecting `Rating (high to low)` orders them by descending rating, and selecting `Release date (newest)` orders dated movies newest first with undated movies last (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-3: Selecting any requested sort persists that choice, and remounting the Watchlist restores the selected choice and its corresponding movie order (how to see it: test: src/test/pages/Watchlist.test.tsx::Watchlist page > persists the selected sort and restores it after reload)
- AC-4: The remembered release-date choice is labeled `Release date (newest)` and restores newest-release ordering after remounting (how to see it: test: src/test/pages/Watchlist.test.tsx::Watchlist page > persists and restores the Release year sort)
- AC-5: Existing Watchlist behavior remains unchanged outside the requested sort labels and choices (how to see it: test: the full suite)

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
