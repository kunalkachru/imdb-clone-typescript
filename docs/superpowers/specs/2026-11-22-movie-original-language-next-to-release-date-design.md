# Spec v1: S-148

## Goal
On the movie detail page, display the movie's human-readable original language beside the release date/year in the existing release metadata row. For a movie with `original_language: "en"` and release date `2020-01-01`, the row must show the release year and `English` together, rather than placing original language in a separate metadata row. Preserve the existing omission behavior when no original language is provided and preserve unrelated movie-page behavior.

## Acceptance checks
- AC-1: A movie detail with release date `2020-01-01` and `original_language: "en"` renders the release year `2020` and the human-readable language `English` together in the release metadata row, with no separate `Original language English` metadata item (how to see it: test: src/test/pages/MovieDetail.financials.test.tsx::MovieDetail financials and original language > renders the original language as a name)
- AC-2: A movie detail with no `original_language` does not render an original-language value while continuing to render its release year when present (how to see it: test: src/test/pages/MovieDetail.financials.test.tsx)
- AC-3: Existing application behavior outside the original-language placement remains unchanged with no new full-suite failures (how to see it: test: the full suite)

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
