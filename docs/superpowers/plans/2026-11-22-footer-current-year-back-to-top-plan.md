## T1: Extend the shared footer with runtime copyright and back-to-top navigation
Checks: AC-1, AC-2, AC-3, AC-4
Files:
- src/components/Footer.tsx
- src/App.tsx
Tests:
- src/test/App.test.tsx
How to show: Keep the existing single `Footer` rendered outside the route elements in the common shell, preserve the exact `Movie data from TMDB` attribution, render `© ${new Date().getFullYear()} IMDb Clone`, and render a visible `Back to top` link next to the attribution with a top-of-current-page target such as `href="#"`. The shared footer must remain the only footer on every configured route and after route navigation.

## T2: Add focused route-shell assertions for the updated footer
Checks: AC-1, AC-2, AC-3, AC-4
Files:
- src/test/App.test.tsx
Tests:
- src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route
- src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/App.test.tsx
How to show: Extend the existing route-shell assertions to verify the runtime-year copyright string, exact visible `Back to top` label and top target, and exactly one visible footer containing all three required pieces on `/`, `/movie/1`, `/login`, `/register`, `/actors`, and `/watchlist`, then repeat the same assertions after navigation between configured routes.

## T3: Verify the complete regression suite
Checks: AC-5
Files:
- src/components/Footer.tsx
- src/App.tsx
- src/test/App.test.tsx
Tests:
- src/test/App.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run
How to show: Run the full Vitest suite and confirm the footer update introduces no new failures while all existing application behavior remains passing.
