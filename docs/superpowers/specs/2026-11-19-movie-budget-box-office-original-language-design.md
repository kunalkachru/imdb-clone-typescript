# Spec v1: S-129

## Goal
On a movie detail page, show the movie's budget and box office as compact USD amounts and show its original language as a human-readable language name. The current `MovieDetail` type in `src/types/movie.ts` has no fields for these values, and `src/pages/MovieDetail.tsx` renders no financial or original-language metadata; the change therefore adds the TMDB detail fields to the model and renders them in the existing movie metadata area.

## Acceptance checks
- AC-1: A movie detail fixture with `budget: 63000000` and `revenue: 1200000000` renders `Budget $63M` and `Box office $1.2B` (how to see it: test: src/test/pages/MovieDetail.financials.test.tsx::renders compact budget and box office amounts)
- AC-2: A movie detail fixture with `original_language: "en"` renders `English` as the original-language name and does not render the raw code `en` as the displayed language value (how to see it: test: src/test/pages/MovieDetail.financials.test.tsx::renders the original language as a name)
- AC-3: A movie detail fixture with an unknown or zero budget omits the budget label and value while still rendering a known non-zero box office, and a fixture with an unknown or zero box office omits the box-office label and value while still rendering a known non-zero budget (how to see it: test: src/test/pages/MovieDetail.financials.test.tsx::omits unknown or zero budget and box office independently)
- AC-4: A movie detail fixture with `budget: 950000` and `revenue: 125000` renders compact positive amounts without full raw integers, using `$950K` and `$125K` (how to see it: test: src/test/pages/MovieDetail.financials.test.tsx::formats smaller positive money values compactly)
- AC-5: Existing application behavior remains unchanged outside the budget, box-office, and original-language metadata (how to see it: test: the full suite)

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
