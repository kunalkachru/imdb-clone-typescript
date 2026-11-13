# Spec v1: S-17

## Goal
Add a shared footer to the application shell so the attribution text “Movie data from TMDB” is rendered consistently on every routed page. The footer should be part of the common layout rather than duplicated in individual page components, and the regression test should exercise the route shell to prevent attribution disappearing from a page when routes change.

## Acceptance checks
- AC-1: The application renders exactly one visible footer containing the text “Movie data from TMDB” on each configured route: `/`, `/movie/:id`, `/login`, `/register`, `/actors`, and authenticated `/watchlist` (how to see it: test: src/test/App.test.tsx)
- AC-2: After navigating between configured routes, the destination page still renders exactly one visible footer containing “Movie data from TMDB” (how to see it: test: src/test/App.test.tsx)

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
