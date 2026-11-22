## T1: Add the movie-page copy-link control and timed status

Checks: AC-1, AC-2, AC-3

Files:
- src/pages/MovieDetail.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx

How to show: Add a visible button labeled `Copy link` to the loaded movie detail content. On activation, call `navigator.clipboard.writeText(window.location.href)`, change the button label immediately to `Link copied`, and schedule the label to return to `Copy link` after exactly 2,000 milliseconds. Keep the existing movie detail content and interactions unchanged.

## T2: Add focused copy-link behavior coverage

Checks: AC-1, AC-2, AC-3

Files:
- src/test/pages/MovieDetail.test.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx::renders the Copy link control
- src/test/pages/MovieDetail.test.tsx::copies the current page URL and immediately shows Link copied
- src/test/pages/MovieDetail.test.tsx::keeps Link copied visible until 2 seconds and then restores Copy link
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx

How to show: Mock `navigator.clipboard.writeText`, render `/movie/1`, and assert the control is initially visible as `Copy link`. After activation, assert the mock received the current browser page URL and the label is `Link copied`; with fake timers, verify the copied label remains at 1,999 ms and returns to `Copy link` at 2,000 ms.

## T3: Verify the complete regression suite

Checks: AC-4

Files:
- src/pages/MovieDetail.tsx
- src/test/pages/MovieDetail.test.tsx

Tests:
- src/test/pages/MovieDetail.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themovied.org/3 npm run test:run

How to show: Run the full Vitest suite and confirm all existing movie-page and application tests pass alongside the new copy-link coverage, demonstrating that behavior outside the movie-page copy-link feature remains unchanged.
