# Plan: Add TMDB attribution footer (S-17)

## T1: Add the shared footer to the application route shell
Checks: AC-1, AC-2
Files:
- `src/components/Footer.tsx` — add the semantic shared footer containing exactly “Movie data from TMDB”.
- `src/App.tsx` — wrap the configured routes in the common application shell and render one `Footer` outside the route elements so it persists across route changes.
- `src/App.css` — add only the layout/presentation rules needed for the footer to remain visible as part of the page shell without duplicating it in page components.
Tests:
- `src/test/App.test.tsx`
How to show:
- Render the route shell with each configured route (`/`, `/movie/:id`, `/login`, `/register`, `/actors`, and authenticated `/watchlist`) and show that the document contains exactly one visible footer whose accessible content includes “Movie data from TMDB”; keep the footer outside individual page components so the same assertion remains true after route changes.

## T2: Add route-shell regression coverage for rendering and navigation
Checks: AC-1, AC-2
Files:
- `src/test/App.test.tsx` — add the route-shell test harness with stable page/API/auth mocks, an authenticated watchlist setup, and assertions for one visible attribution footer on every configured route and after navigating between configured routes.
Tests:
- `src/test/App.test.tsx::renders exactly one TMDB attribution footer on each configured route`
- `src/test/App.test.tsx::keeps exactly one TMDB attribution footer after navigating between configured routes`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the named tests and the full Vitest command; report the route list exercised, the authenticated `/watchlist` case, and the post-navigation assertion, with no route producing zero or duplicate visible footers.
