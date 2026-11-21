# Spec v1: S-140

## Goal
Add a `Known for` row to every actor card on the Actors page. For each actor, load that actor's movie credits, rank the credits by TMDB popularity descending, and display up to the three highest-ranked movie titles. Each displayed title exposes its movie release year in a tooltip. Existing actor sorting, pagination, photo/placeholder rendering, and route access remain unchanged.

## Acceptance checks
- AC-1: Each rendered actor card displays a `Known for` row containing up to three movie titles from that actor's movie credits, ordered by descending TMDB popularity and showing fewer titles when fewer than three credits are available (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-2: Each movie title in a `Known for` row exposes the movie's release year as its tooltip text (how to see it: test: src/test/pages/Actors.test.tsx)
- AC-3: The actor movie-credit service requests the actor's movie credits and preserves each credit's title, popularity, and release date needed to select and label the three movies (how to see it: test: src/test/services/tmdb.test.ts)
- AC-4: Existing actor sorting, pagination, photo/placeholder rendering, route access, and unrelated application behavior continue to pass without new failures (how to see it: test: the full suite)

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
