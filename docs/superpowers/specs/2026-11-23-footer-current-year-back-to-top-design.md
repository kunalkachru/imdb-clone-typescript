# Spec v1: S-159

## Goal
Extend the existing shared application footer with a dynamically generated copyright notice in the exact form `© <current year> IMDb Clone` and a visible `Back to top` link placed next to the existing `Movie data from TMDB` attribution. The footer remains part of the common route shell. The back-to-top link targets the top of the application shell, and the copyright year is derived at render time so it follows the current calendar year without a hard-coded year.

## Acceptance checks
- AC-1: The shared footer renders the exact copyright text `© <current year> IMDb Clone`, where `<current year>` is the calendar year at render time rather than a hard-coded year (how to see it: test: src/test/components/Footer.test.tsx)
- AC-2: The shared footer renders `© <current year> IMDb Clone`, `Movie data from TMDB`, and a visible `Back to top` link together on every configured application route (how to see it: test: src/test/App.test.tsx)
- AC-3: The `Back to top` link targets the top of the application shell and activating it moves the document to that target (how to see it: test: src/test/components/Footer.test.tsx)
- AC-4: Existing application behavior remains unchanged outside the footer additions (how to see it: test: the full suite)

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
