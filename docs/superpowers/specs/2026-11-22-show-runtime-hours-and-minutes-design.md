# Spec v1: S-146

## Goal
Update the movie detail page runtime display so every known positive runtime is rendered as hours and minutes in the form `<hours> h <minutes> min`, such as `2 h 22 min`, instead of a minutes-only or compact `h`/`m` form. Continue omitting the runtime when it is unknown, null, or zero.

## Acceptance checks
- AC-1: A movie detail with a 135-minute runtime displays exactly `2 h 15 min` and does not display `2h 15m` or `135 min` (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > renders 135-minute runtime as hours and minutes)
- AC-2: A movie detail with a 45-minute runtime displays exactly `0 h 45 min` and does not display `45m` (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > renders 45-minute runtime as minutes only)
- AC-3: A movie detail with an unknown, null, or zero runtime displays no runtime text or runtime segment (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx)
- AC-4: Existing application behavior outside the movie detail runtime formatting remains unchanged (how to see it: test: the full suite)

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
