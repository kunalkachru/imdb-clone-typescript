# Spec v1: S-164

## Goal
Extend the existing shared application footer with a dynamically generated copyright notice, `© <current year> IMDb Clone`, and a `Back to top` in-page link placed next to the existing `Movie data from TMDB` attribution. The footer remains part of the common route shell and continues to appear once on every configured route. The year must come from the runtime calendar year rather than a hardcoded value, and the link targets the page-top anchor with `href="#top"`.

## Acceptance checks
- AC-1: Each configured route (`/`, `/movie/1`, `/login`, `/register`, `/actors`, and authenticated `/watchlist`) renders exactly one visible footer containing `Movie data from TMDB`, `© ${new Date().getFullYear()} IMDb Clone`, and one visible `Back to top` link in the same footer (how to see it: test: src/test/App.test.tsx)
- AC-2: The shared footer places the visible `Back to top` link next to the visible `Movie data from TMDB` attribution and the link has `href="#top"` (how to see it: test: src/test/App.test.tsx)
- AC-3: After navigating between configured routes, the destination page still renders exactly one footer with the current-year copyright notice, `Movie data from TMDB`, and one `Back to top` link (how to see it: test: src/test/App.test.tsx)
- AC-4: Existing application behavior has no new test failures after the footer enhancement (how to see it: test: the full suite)
- AC-5: The updated route-shell test for `renders exactly one TMDB attribution footer on each configured route` passes with the new copyright notice and `Back to top` link rule (how to see it: test: src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route)
- AC-6: The updated route-navigation test for `keeps exactly one TMDB attribution footer after navigating between configured routes` passes with the new footer content rule (how to see it: test: src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes)

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
