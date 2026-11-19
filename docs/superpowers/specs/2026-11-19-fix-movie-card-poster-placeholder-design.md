# Spec v1: S-127

## Goal
Replace the broken poster image shown by a movie card when its movie has no poster image with a grey placeholder box containing the text `No poster`. Apply this to movie cards on both the Home page and the Watchlist page. Cards for movies that have a poster image continue rendering that poster as they do now.

## Acceptance checks
- AC-1: A Home movie card whose movie has no poster image renders a grey poster placeholder box containing the text `No poster` and does not render a poster image element (how to see it: test: src/test/pages/Home.test.tsx)
- AC-2: A Watchlist movie card whose movie has no poster image renders a grey poster placeholder box containing the text `No poster` and does not render a poster image element (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-3: A Home movie card whose movie has a poster image continues rendering that poster with the movie title as its alternative text and the existing poster presentation (how to see it: test: src/test/pages/Home.test.tsx)
- AC-4: A Watchlist movie card whose movie has a poster image continues rendering that poster with the movie title as its alternative text and the existing poster presentation (how to see it: test: src/test/pages/Watchlist.test.tsx)
- AC-5: Existing application behavior remains unchanged outside the movie-card poster placeholder behavior (how to see it: test: the full suite)

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
