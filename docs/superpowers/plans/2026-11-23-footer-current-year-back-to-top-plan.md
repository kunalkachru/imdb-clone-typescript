## T1: Extend the shared footer and application top anchor

Checks: AC-1, AC-2, AC-3

Files:
- src/components/Footer.tsx
- src/App.tsx
- src/App.css

Tests:
- src/test/App.test.tsx

How to show: Keep the single shared `Footer` outside the route elements, render `© ${new Date().getFullYear()} IMDb Clone` together with the existing `Movie data from TMDB` text, and place a visible accessible `Back to top` link beside that attribution with `href="#top"`. Give the current application page top a stable `id="top"` target while preserving the existing route shell, layout, and behavior.

## T2: Add focused footer route and link coverage

Checks: AC-1, AC-2, AC-3

Files:
- src/test/App.test.tsx

Tests:
- src/test/App.test.tsx::renders exactly one current-year footer on each configured route
- src/test/App.test.tsx::renders a Back to top link targeting the top anchor next to the TMDB attribution
- src/test/App.test.tsx::keeps exactly one complete footer after navigating between configured routes
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/App.test.tsx

How to show: Extend the existing route-shell harness to exercise `/`, `/movie/1`, `/login`, `/register`, `/actors`, and `/watchlist`, asserting one visible footer per route with the runtime current year, copyright text, and TMDB attribution. Assert the accessible `Back to top` link is visible, adjacent to the attribution, and points to `#top`; then navigate between configured routes and repeat the complete-footer assertion without changing the existing route behavior.

## T3: Run the complete regression suite

Checks: AC-3

Files:
- src/components/Footer.tsx
- src/App.tsx
- src/App.css
- src/test/App.test.tsx

Tests:
- src/test/App.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run

How to show: Run the full Vitest suite and confirm the footer checks and all existing application tests pass, demonstrating that route navigation and unrelated application behavior remain unchanged.
