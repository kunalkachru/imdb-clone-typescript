## T1: Render a conditional poster or grey placeholder on Home movie cards

Checks: AC-1, AC-3
Files:
- `src/components/MovieCard.tsx`
- `src/test/pages/Home.test.tsx`
Tests:
- `src/test/pages/Home.test.tsx::renders a grey No poster placeholder for a movie without a poster`
- `src/test/pages/Home.test.tsx::renders the existing poster and title alt text for a movie with a poster`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Home.test.tsx`
How to show:
- Branch the reusable Home card on the movie’s poster value. When it is absent, render a grey poster-sized box containing exactly `No poster` and no `img`; when present, keep the existing TMDB URL, `alt={movie.title}`, and poster classes unchanged. Add focused tests with both fixture shapes and assert the placeholder text, absence of an image, and preserved poster presentation.

## T2: Render the same conditional poster or grey placeholder on Watchlist cards

Checks: AC-2, AC-4
Files:
- `src/pages/Watchlist.tsx`
- `src/test/pages/Watchlist.test.tsx`
Tests:
- `src/test/pages/Watchlist.test.tsx::renders a grey No poster placeholder for a saved movie without a poster`
- `src/test/pages/Watchlist.test.tsx::renders the existing poster and title alt text for a saved movie with a poster`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Watchlist.test.tsx`
How to show:
- Apply the same conditional rendering inside the Watchlist card link, preserving navigation, title, rating, remove control, existing TMDB poster URL, title alternative text, and poster classes for movies with posters. Add focused tests that prove a missing poster produces the grey `No poster` box without an `img`, while a present poster remains unchanged.

## T3: Verify application behavior outside poster placeholders remains unchanged

Checks: AC-5
Files:
- `src/components/MovieCard.tsx`
- `src/pages/Watchlist.tsx`
- `src/test/pages/Home.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
Tests:
- `src/test/pages/Home.test.tsx`
- `src/test/pages/Watchlist.test.tsx`
- `VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run`
How to show:
- Run the complete Vitest suite and confirm all existing tests pass, including Home navigation and watchlist toggling, Watchlist navigation/removal/search behavior, and unrelated application behavior. Confirm the change is limited to conditional movie-card poster rendering.
