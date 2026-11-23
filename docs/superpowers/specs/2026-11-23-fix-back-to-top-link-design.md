# Spec v1: S-165

## Goal
Keep the shared footer's `Back to top` control, but make activation return the current page to its top position without handing `#top` to `HashRouter` as a route. The control must not produce the black/unmatched page, and the footer's existing attribution and copyright content must remain present.

## Acceptance checks
- AC-1: On every configured route (`/`, `/movie/1`, `/login`, `/register`, `/actors`, and authenticated `/watchlist`), the shared footer renders one visible `Back to top` control alongside `Movie data from TMDB` and the current-year `IMDb Clone` copyright (how to see it: test: src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route)
- AC-2: Activating `Back to top` calls the browser scroll-to-top behavior, leaves the current routed page active, and does not navigate to an unmatched route or black page (how to see it: test: src/test/App.test.tsx::application route shell > keeps the Back to top control on the current route when activated)
- AC-3: The page-top scroll target exists in the shared route shell and is present after navigating between configured routes (how to see it: test: src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes)
- AC-4: Existing application behavior has no new test failures (how to see it: test: the full suite)

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
