## T1: Render a thousands-separated vote count beside the movie rating

Checks: AC-1
Files:
- `src/pages/MovieDetail.tsx`
- `src/test/pages/MovieDetail.test.tsx`
Tests:
- `src/test/pages/MovieDetail.test.tsx::MovieDetail page > renders the rating with a thousands-separated vote count`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/MovieDetail.test.tsx -t "MovieDetail page > renders the rating with a thousands-separated vote count"`
How to show:
- Add the movie detail `vote_count` beside the existing one-decimal star rating and format the count with a locale thousands separator so fixture data with `vote_average: 8.4` and `vote_count: 12345` renders exactly `⭐ 8.4 (12,345 votes)` together. Extend the focused page test with that exact fixture and assertion while preserving the existing rating and detail-page behavior.

## T2: Verify the vote-count change does not regress the application

Checks: AC-2
Files:
- `src/pages/MovieDetail.tsx`
- `src/test/pages/MovieDetail.test.tsx`
Tests:
- `src/test/pages/MovieDetail.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the complete Vitest suite after the focused test, confirm all existing application tests pass, and verify the change is limited to the movie-details rating display without altering unrelated navigation, watchlist, survey, loading, error, or other application behavior.
