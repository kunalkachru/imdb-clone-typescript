# Plan: Footer copyright and back-to-top link (S-164)

## T1: Extend the shared footer with current-year copyright and back-to-top link
Checks: AC-1, AC-2, AC-3
Files:
- `src/components/Footer.tsx` — render `© ${new Date().getFullYear()} IMDb Clone` and one visible `Back to top` anchor with `href="#top"` next to the existing `Movie data from TMDB` attribution.
- `src/App.css` — adjust the shared footer presentation only as needed to keep the attribution, copyright notice, and back-to-top link visibly adjacent while preserving the common route-shell layout.
Tests:
- `src/test/App.test.tsx`
How to show:
- Render every configured route, including authenticated `/watchlist`, and show exactly one visible shared footer containing the current runtime year, `IMDb Clone`, `Movie data from TMDB`, and one `Back to top` link; show that the link is adjacent to the attribution and targets `#top`. Navigate between configured routes and repeat the single-footer/content assertions on the destination pages.

## T2: Update route-shell regression tests for the complete footer contract
Checks: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
Files:
- `src/test/App.test.tsx` — update the route-shell assertions and helpers to verify the current-year copyright, TMDB attribution, exactly one visible footer, one visible `Back to top` link, adjacency, and `href="#top"` across all configured routes and after navigation; retain the named route-shell test names required by the spec.
Tests:
- `src/test/App.test.tsx::application route shell > renders exactly one TMDB attribution footer on each configured route`
- `src/test/App.test.tsx::application route shell > keeps exactly one TMDB attribution footer after navigating between configured routes`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run`
How to show:
- Run both named route-shell tests and the full Vitest suite. Report passing assertions for `/`, `/movie/1`, `/login`, `/register`, `/actors`, authenticated `/watchlist`, and the post-navigation destination pages, with no new failures.
