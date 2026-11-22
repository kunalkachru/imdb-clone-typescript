# Spec v1: S-151

## Goal
Extend the existing shared application footer so it keeps the “Movie data from TMDB” attribution and also renders “© <current year> IMDb Clone” plus a “Back to top” link next to that attribution. The copyright year must be generated from the current year at render time, and the link must take the visitor to the top of the current page. Keep the footer in the common route shell so the content is present across the configured routes.

## Acceptance checks
- AC-1: The shared footer displays exactly `© <current year> IMDb Clone` where `<current year>` is the runtime calendar year, alongside the existing `Movie data from TMDB` text (how to see it: test: src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route)
- AC-2: The shared footer displays a visible link with the exact label `Back to top` next to the footer’s existing attribution content, and activating it targets the top of the current page (how to see it: test: src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route)
- AC-3: Each configured route (`/`, `/movie/1`, `/login`, `/register`, `/actors`, and `/watchlist`) renders exactly one visible footer containing `Movie data from TMDB`, `© <current year> IMDb Clone`, and `Back to top` (how to see it: test: src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route)
- AC-4: After navigating between configured routes, exactly one visible footer remains and continues to contain `Movie data from TMDB`, `© <current year> IMDb Clone`, and `Back to top` (how to see it: test: src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes)
- AC-5: Existing application behavior remains without new failures after the footer update (how to see it: test: the full suite)

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
