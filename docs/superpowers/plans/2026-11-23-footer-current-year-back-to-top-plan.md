# Plan: Add current-year footer copyright and Back to top control (S-156)

## T1: Extend the shared footer with copyright and Back to top behavior
Checks: AC-1, AC-2, AC-3
Files:
- `src/components/Footer.tsx` — render exactly one current-calendar-year copyright string beside the existing TMDB attribution and add a visible “Back to top” link whose click handler scrolls the current page to position zero while preventing URL and route changes.
- `src/App.tsx` — preserve the single shared `Footer` outside the route elements so the new content appears on every configured route and survives navigation.
Tests:
- `src/test/App.test.tsx`
How to show:
- Demonstrate that the shared footer contains the exact “© <current calendar year> IMDb Clone” text, “Movie data from TMDB”, and “Back to top”; verify the year is derived at render time, the click invokes `window.scrollTo(0, 0)`, and the location and active route are unchanged.

## T2: Add focused route-shell coverage for footer content, scrolling, and navigation persistence
Checks: AC-1, AC-2, AC-3
Files:
- `src/test/App.test.tsx` — extend the existing route-shell harness and mocks to assert the footer on `/`, `/movie/1`, `/login`, `/register`, `/actors`, and authenticated `/watchlist`, test the Back to top click without URL or route changes, and test that one footer remains after route navigation.
Tests:
- `src/test/App.test.tsx::renders the current-year copyright and footer controls on each configured route`
- `src/test/App.test.tsx::scrolls to the top without changing the URL or route`
- `src/test/App.test.tsx::keeps exactly one complete footer after navigating between configured routes`
How to show:
- Run each named test with the required TMDB environment variables and report the six configured routes exercised, the authenticated watchlist case, the zero-position scroll call, unchanged location/route, and exactly one complete visible footer before and after navigation.

## T3: Run regression verification for unchanged application behavior
Checks: AC-4
Files:
- `src/test/App.test.tsx` — retain the existing route-shell and HashRouter compatibility coverage while adding the footer assertions.
- `src/test/` — exercise the existing application test suite without changing unrelated behavior.
Tests:
- `src/test/App.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the full Vitest suite and report that all existing tests pass alongside the new footer tests, with no failures outside the specified footer additions.
