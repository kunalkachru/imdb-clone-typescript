# Spec v1: S-136

## Goal
The Actors page currently fetches popular actors one TMDB page at a time, renders page 1 in the API response order, appends later pages beneath it, and has no sort control or saved sort state (`src/pages/Actors.tsx`, `getPopularActors` in `src/services/tmdb.ts`). Add an accessible sort control above the actors list with exactly `Popularity` and `Name A to Z` choices. `Popularity` is the default and preserves the existing TMDB popular-result order, including the existing append order when more pages are loaded. `Name A to Z` orders all currently loaded actor cards by ascending actor name while retaining the current order for equal names. Save the selected sort in `localStorage`, restore it when the Actors page opens again, and fall back to `Popularity` when no valid saved choice exists.

## Acceptance checks
- AC-1: The Actors page renders an accessible sort control above the actors list with exactly the options `Popularity` and `Name A to Z`, and `Popularity` is selected when no sort has been saved (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-2: With multiple loaded actors, selecting `Name A to Z` renders every loaded actor card in ascending actor-name order, preserving the existing order for equal names (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-3: With multiple loaded API pages, `Popularity` renders actors in the existing TMDB response order—page 1 followed by appended later pages—and changing back to `Popularity` restores that order (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-4: Selecting `Name A to Z` writes the selected sort to `localStorage`, and reopening the Actors page restores both the selected option and its name-sorted actor order (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-5: A missing or invalid saved Actors sort falls back to `Popularity` and renders actors in TMDB response order (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-6: Existing Actors loading, pagination, photo/placeholder rendering, route access, and all unrelated application behavior continue to pass without new failures (how to see it: test: the full suite)

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
