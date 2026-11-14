# Spec v1: S-54

## Goal
Prevent movie detail metadata from rendering the literal `undefined min` when the movie response has no known runtime. The runtime segment should be omitted when runtime is absent, while a known numeric runtime should continue to display with the `min` suffix. Preserve the existing regression coverage and make the committed unknown-runtime test pass after the fix.

## Acceptance checks
- AC-1: A movie detail with no runtime does not render `undefined min` or any runtime segment (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx::MovieDetail runtime > reproduces the undefined runtime text when runtime is unknown)
- AC-2: A movie detail with a known runtime renders the numeric value followed by ` min` in the details line (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx)
- AC-3: A movie detail with a runtime of `0` renders `0 min` rather than hiding the runtime (how to see it: test: src/test/pages/MovieDetail.runtime.test.tsx)

## Affected areas
- (none)

## Risks
- A truthiness check must not accidentally suppress a valid runtime of `0`; the intended behavior is based on whether the runtime is absent, not on inventing a substitute value.

## New packages
- (none)

## Choices
- (none)

## Assumptions
- (none)

## Docs used
- (none)
