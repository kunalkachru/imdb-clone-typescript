## T1: Add official website and genre navigation coverage to the movie detail page

Checks: AC-1, AC-2, AC-3
Files:
- `src/pages/MovieDetail.tsx`
- `src/test/pages/MovieDetail.test.tsx`
Tests:
- `src/test/pages/MovieDetail.test.tsx::MovieDetail page > renders an official website link in a new tab when homepage is available`
- `src/test/pages/MovieDetail.test.tsx::MovieDetail page > omits the official website link when homepage is unavailable`
- `src/test/pages/MovieDetail.test.tsx::MovieDetail page > renders each genre as a link to the Home genre filter`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx`
How to show:
- Extend the existing movie-detail fixtures with `homepage: "https://example.com/inception"` and multiple `{ id, name }` genres, then assert exactly one visible link named `Official website` has that URL and `target="_blank"`.
- Add the no-homepage fixture assertion that `Official website` is absent, including when the optional homepage field is omitted.
- Replace the rendered genre `span` controls with navigation links for every displayed genre, preserving their names and styling while giving the `Action` genre the Home destination with `genre=28`.
- Keep the movie detail route, watchlist, survey, loading, error, title, rating, and other existing behavior unchanged.

## T2: Verify movie-page genre links produce the same Home filter state as Browse by genre

Checks: AC-3, AC-4
Files:
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/Home.test.tsx`
- `src/pages/MovieDetail.tsx`
- `src/pages/Home.tsx`
Tests:
- `src/test/pages/MovieDetail.test.tsx::MovieDetail page > navigates to Home with the selected genre when a genre link is clicked`
- `src/test/pages/Home.test.tsx::Home page > applies the genre query parameter and renders the genre results heading`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx src/test/pages/Home.test.tsx`
How to show:
- Render `MovieDetail` and a Home route in one memory-router test, click the `Action` genre link, and assert the location is `/` with `genre=28` while the Home page receives the normal genre-filtered state.
- Add Home coverage with an initial `/` entry containing `?genre=28`, mock the existing genre and movie fetches, and assert the heading is `🎭 Action Movies` plus the genre request/filter identity used by Browse by genre.
- If the shared navigation behavior requires a small source adjustment, keep it limited to the existing `Link`/search-parameter flow so selecting a genre from the movie page and selecting `Action` in `Browse by genre` produce the same query parameter and heading.

## T3: Run the complete regression suite for the movie-page navigation changes

Checks: AC-5
Files:
- `src/pages/MovieDetail.tsx`
- `src/pages/Home.tsx`
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/Home.test.tsx`
Tests:
- `src/test/pages/MovieDetail.test.tsx`
- `src/test/pages/Home.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the full Vitest suite after the focused page tests and confirm it passes, demonstrating that the conditional external link and genre navigation do not change unrelated application behavior; do not touch `src/App.tsx`, `src/App.css`, or `src/components/Footer.tsx` unless a test proves the requested behavior cannot be implemented without them.
