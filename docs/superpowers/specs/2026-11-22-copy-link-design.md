# Spec v1: S-150

## Goal
Add a `Copy link` button to the movie detail page at `/movie/:id`. When activated, it copies the browser's current page URL and changes its visible label to `Link copied` for exactly 2 seconds before returning to `Copy link`. The existing movie detail content and interactions remain unchanged.

## Acceptance checks
- AC-1: The movie detail page at `/movie/1` renders a visible control labeled `Copy link` (how to see it: ui: /movie/1, "Copy link visible on the page")
- AC-2: Activating the movie detail page's `Copy link` control calls `navigator.clipboard.writeText` with the current browser page URL and immediately shows `Link copied` (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-3: After activation, `Link copied` remains visible before 2,000 milliseconds and the control returns to `Copy link` at 2,000 milliseconds (how to see it: test: src/test/pages/MovieDetail.test.tsx)
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
