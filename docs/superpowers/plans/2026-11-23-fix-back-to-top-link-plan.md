# Plan: Fix Back to Top control (S-165)

## T1: Make the shared Back to Top control scroll in place
Checks: AC-1, AC-2, AC-3
Files:
- `src/components/Footer.tsx` — replace the `href="#top"` route-changing link with an accessible in-page control that invokes the browser scroll-to-top behavior while preserving the TMDB attribution, current-year copyright, and visible Back to Top label.
- `src/App.tsx` — add the stable `top` target to the shared route shell so it remains present as routes change.
Tests:
- `src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route`
- `src/test/App.test.tsx::application route shell > keeps the Back to top control on the current route when activated`
- `src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes`
How to show:
- Show one visible footer with the existing attribution, current-year copyright, and Back to Top control on every configured route; show that activating the control calls the browser scroll-to-top behavior without changing the current route or producing an unmatched/black page; show that the `top` target and one footer remain present after route navigation.

## T2: Add regression coverage for the HashRouter-safe footer contract
Checks: AC-1, AC-2, AC-3, AC-4
Files:
- `src/test/App.test.tsx` — retain the configured-route and navigation assertions, add the named activation test required by the spec, and exercise the shared shell under the router setup that previously treated `#top` as a route so the control's scroll behavior and current route are verified.
Tests:
- `src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route`
- `src/test/App.test.tsx::application route shell > keeps the Back to top control on the current route when activated`
- `src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the three named route-shell tests and the full Vitest suite; report passing checks for all configured routes, activation without hash-route navigation, persistence of the top target after navigation, and no new test failures.
