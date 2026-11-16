# Spec v1: S-85

## Goal
On the movie detail page, show a known movie runtime as hours and minutes, such as `2h 15m`, instead of only minutes. A movie with no runtime shows nothing in the runtime position.

## Acceptance checks
- AC-1: A movie detail with a 135-minute runtime displays `2h 15m` in the runtime position and does not display `135 min` (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx)
- AC-2: A movie detail with a 45-minute runtime displays `45m` in the runtime position (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx)
- AC-3: A movie detail with no runtime displays no runtime text or runtime segment in the details line (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx)

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
