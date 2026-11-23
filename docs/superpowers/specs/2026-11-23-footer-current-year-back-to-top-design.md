# Spec v2: S-156

## Goal
The owner request is right about the required footer content. The project document’s generic in-app-link convention does not apply to this control; follow ADR-12 for “Back to top”: use a click handler that scrolls the current page to the top and never changes the URL or route. Extend the shared application footer so every routed page shows “© <current year> IMDb Clone” and that link next to the existing “Movie data from TMDB” attribution. The year must be computed at render time.

## Acceptance checks
- AC-1: The shared footer renders exactly one visible copyright string in the form “© <current calendar year> IMDb Clone” alongside the existing “Movie data from TMDB” attribution on every configured route (`/`, `/movie/1`, `/login`, `/register`, `/actors`, and authenticated `/watchlist`) (how to see it: test: src/test/App.test.tsx)
- AC-2: The footer renders a visible link named “Back to top” next to “Movie data from TMDB”; clicking it invokes the click handler, scrolls the current page to top position zero, and leaves both the URL and current route unchanged (how to see it: test: src/test/App.test.tsx)
- AC-3: The application continues to render exactly one footer with the copyright text, “Movie data from TMDB”, and “Back to top” after navigating between configured routes (how to see it: test: src/test/App.test.tsx)
- AC-4: All existing application behavior remains unchanged apart from the specified footer additions (how to see it: test: the full suite)

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
