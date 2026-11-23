# Spec v1: S-153

## Goal
The shared `Footer` rendered by `src/App.tsx` currently contains only the text “Movie data from TMDB”. Extend that footer with `© <current year> IMDb Clone` and a visible `Back to top` link placed next to the existing TMDB attribution. The year must be generated from the current year at render time, and the link must navigate to the top of the current page. Keep one shared footer on every configured route.

## Acceptance checks
- AC-1: On every configured route (`/`, `/movie/1`, `/login`, `/register`, `/actors`, and `/watchlist`), the application renders exactly one visible footer containing `© <current year> IMDb Clone` where `<current year>` equals `new Date().getFullYear()`, and containing the existing text `Movie data from TMDB` (how to see it: test: src/test/App.test.tsx)
- AC-2: The shared footer renders a visible accessible link named `Back to top` next to `Movie data from TMDB`, and that link targets the current page's top anchor (the `#top` fragment) (how to see it: test: src/test/App.test.tsx)
- AC-3: Navigating between the configured routes preserves exactly one visible footer with the copyright text, TMDB attribution, and `Back to top` link, while all existing application behavior remains unchanged (how to see it: test: the full suite)

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
