## T1: Extend the shared footer with the current-year copyright and back-to-top link

Checks: AC-1, AC-2, AC-3

Files:
- `src/components/Footer.tsx` — render `© <current year> IMDb Clone` using the calendar year at render time, retain `Movie data from TMDB`, and add a visible `Back to top` link beside the attribution that targets the top of the application shell.
- `src/App.tsx` — expose a stable top-of-shell target while keeping the footer in the common route shell.
- `src/App.css` — add only the footer layout/presentation needed to keep the copyright, attribution, and back-to-top link visible together and next to one another.

Tests:
- `src/test/components/Footer.test.tsx`
- `src/test/App.test.tsx`

How to show: Render the footer with the current calendar year and show the exact copyright text, the existing TMDB attribution, and a visible `Back to top` link together. Verify the link points to the application-shell top target and that activating it moves the document to that target. Keep the footer outside the routed page content so the same elements remain present on every configured route.

## T2: Add focused footer and route-shell acceptance coverage

Checks: AC-1, AC-2, AC-3

Files:
- `src/test/components/Footer.test.tsx` — add isolated assertions for render-time year generation, exact copyright text, the adjacent attribution/link content, the top-target destination, and activation behavior.
- `src/test/App.test.tsx` — extend the configured-route and navigation assertions to require the copyright text and visible back-to-top link alongside `Movie data from TMDB` on `/`, `/movie/:id`, `/login`, `/register`, `/actors`, and authenticated `/watchlist`.

Tests:
- `src/test/components/Footer.test.tsx`
- `src/test/App.test.tsx`

How to show: Use a controlled system date or current-year assertion to prove the year is not hard-coded; exercise the footer activation against its shell target; and render every configured route, including authenticated `/watchlist`, confirming one shared footer exposes all three required items after initial render and route navigation.

## T3: Verify behavior outside the footer additions remains unchanged

Checks: AC-4

Files:
- `src/components/Footer.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/test/components/Footer.test.tsx`
- `src/test/App.test.tsx`

Tests:
- `src/test/components/Footer.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`

How to show: Run the complete Vitest suite and confirm the new footer tests and all existing application tests pass, demonstrating that behavior outside the requested footer additions remains unchanged.
