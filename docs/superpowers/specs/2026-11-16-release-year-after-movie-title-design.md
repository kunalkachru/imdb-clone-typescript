# Spec v1: S-77

## Goal
On the movie detail page, display a movie's four-digit release year in brackets after its title, such as `Inception (2010)`. When the movie has no release date, display only the original title and no empty brackets.

## Acceptance checks
- AC-1: The movie detail page displays a movie with release date `2010-01-01` as `Inception (2010)` in the title (how to see it: test: src/test/pages/MovieDetail.test.tsx)
- AC-2: The movie detail page displays only `Inception`, with no bracketed or empty year suffix, when the movie has no release date (how to see it: test: src/test/pages/MovieDetail.test.tsx)

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
