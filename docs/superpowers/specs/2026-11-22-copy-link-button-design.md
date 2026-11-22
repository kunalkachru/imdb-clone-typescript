# Spec v1: S-149

## Goal
Add a `Copy link` button to the movie detail page. Activating it copies the current movie page URL to the browser clipboard and changes the button text to `Link copied` for exactly 2 seconds, after which the button returns to `Copy link`.

## Acceptance checks
- AC-1: A loaded movie detail page renders an accessible button named `Copy link` (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-2: Activating the `Copy link` button calls the browser clipboard with the current movie page URL and changes the button text to `Link copied` (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-3: After activation, `Link copied` remains visible before 2 seconds have elapsed and is no longer visible at 2 seconds, with the button text returned to `Copy link` (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-4: Existing application behavior remains unchanged outside the movie-page copy-link behavior (how to see it: test: the full suite)

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
