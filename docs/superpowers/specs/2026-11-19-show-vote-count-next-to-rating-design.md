# Spec v1: S-126

## Goal
On a movie's details page, show the number of votes next to the existing star rating. Format the rating and count as `⭐ 8.4 (12,345 votes)`, using a thousands separator in the vote count.

## Acceptance checks
- AC-1: The movie details page renders the star rating and a 12,345 vote count together as `⭐ 8.4 (12,345 votes)` when the movie data has `vote_average: 8.4` and `vote_count: 12345` (how to see it: test: src/test/pages/MovieDetail.test.tsx::MovieDetail page > renders the rating with a thousands-separated vote count)
- AC-2: Existing application behavior remains unchanged outside the vote-count display (how to see it: test: the full suite)

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
