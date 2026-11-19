# Spec v1: S-128

## Goal
On the movie detail page, expose a movie's official website when TMDB provides one. Render the link with the exact label `Official website`, open it in a new browser tab, and omit it entirely when no website is available. Make every displayed genre tag a navigation control that takes the visitor to the Home page with that genre selected, using the same genre-filter behavior and URL state as the existing “Browse by genre” control.

## Acceptance checks
- AC-1: A movie detail with `homepage: "https://example.com/inception"` renders one visible link named `Official website` whose href is that URL and whose target opens a new tab (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-2: A movie detail with no homepage value renders no link named `Official website` (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-3: A movie detail with genres renders each genre name as a clickable navigation link, and clicking the `Action` genre navigates to the Home page with `genre=28` selected (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-4: Clicking a movie-page genre produces the same genre-filtered Home state as selecting that genre in the `Browse by genre` control, including the genre query parameter and genre-results heading (how to see it: test: src/test/pages/Home.test.tsx)
- AC-5: Existing application behavior remains unchanged outside the official-website and clickable-genre behavior (how to see it: test: the full suite)

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
