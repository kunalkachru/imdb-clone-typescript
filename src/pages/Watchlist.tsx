import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types/movie";
import Navbar from "../components/Navbar";
import { formatMovieTitle } from "../utils/formatMovieTitle";

const WATCHLIST_SORT_KEY = "watchlist-sort";
const SORT_OPTIONS = ["recently-added", "title", "rating"] as const;
type WatchlistSort = (typeof SORT_OPTIONS)[number];

const isWatchlistSort = (value: string | null): value is WatchlistSort =>
  SORT_OPTIONS.includes(value as WatchlistSort);

const getStoredSort = (): WatchlistSort => {
  try {
    const storedSort = localStorage.getItem(WATCHLIST_SORT_KEY);
    return isWatchlistSort(storedSort) ? storedSort : "recently-added";
  } catch {
    return "recently-added";
  }
};

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, dispatch } = useWatchlist();

  // TS LESSON: local search state — filters watchlist only
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sort, setSort] = useState<WatchlistSort>(getStoredSort);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sortedWatchlist = useMemo(() => {
    const newestFirst = [...watchlist].reverse();

    if (sort === "recently-added") {
      return newestFirst;
    }

    return newestFirst.sort((left, right) =>
      sort === "title"
        ? left.title.localeCompare(right.title)
        : right.vote_average - left.vote_average,
    );
  }, [sort, watchlist]);

  // TS LESSON: derived state — filter movies based on searchQuery
  // no API call needed — just filter existing array
  const filteredMovies: Movie[] = searchQuery.trim()
    ? sortedWatchlist.filter((movie: Movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sortedWatchlist; // no search — show all

  const handleSearch = () => {
    // search happens live as user types — nothing extra needed here
    // but keeping onSearch for Navbar compatibility
  };

  const heading = searchQuery.trim()
    ? `Results for "${searchQuery}" in Watchlist (${filteredMovies.length})`
    : `🎬 My Watchlist (${watchlist.length})`;

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(val: string) => setSearchQuery(val)}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
      />

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-4xl font-black">{heading}</h1>
          {watchlist.length > 0 && (
            <button
              onClick={() => dispatch({ type: "CLEAR" })}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {watchlist.length > 0 && (
          <div className="mb-8">
            <label htmlFor="watchlist-sort" className="text-white font-semibold mr-3">
              Sort watchlist
            </label>
            <select
              id="watchlist-sort"
              value={sort}
              onChange={(event) => {
                const nextSort = event.target.value as WatchlistSort;
                setSort(nextSort);
                try {
                  localStorage.setItem(WATCHLIST_SORT_KEY, nextSort);
                } catch {
                  // Sorting remains available for this session if storage is unavailable.
                }
              }}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white"
            >
              <option value="recently-added">Recently added</option>
              <option value="title">Title A to Z</option>
              <option value="rating">Rating highest first</option>
            </select>
          </div>
        )}

        {/* Empty watchlist */}
        {watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[16rem] px-4 gap-4 text-center">
            <p className="text-gray-400 text-xl">
              No movies in your watchlist yet
            </p>
            <p
              data-testid="watchlist-empty-guidance"
              className="text-gray-400 text-base max-w-md text-center"
            >
              Save films to your watchlist from any movie page.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
            >
              Browse Movies
            </button>
          </div>
        )}

        {/* No search results */}
        {watchlist.length > 0 && filteredMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p role="status" className="text-gray-400 text-xl">
              No movies match "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Movies grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie: Movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg overflow-hidden group relative"
            >
              <Link
                to={`/movie/${movie.id}`}
                className="block cursor-pointer hover:scale-105 transition-transform"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-400 flex items-center justify-center text-gray-800 font-semibold">
                    No poster
                  </div>
                )}
                <div className="p-3">
                  <h2 className="text-white font-semibold text-sm truncate">
                    {formatMovieTitle(movie.title, movie.release_date)}
                  </h2>
                  <p className="text-yellow-400 text-sm mt-1">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </Link>

              {/* Remove button on hover */}
              <button
                type="button"
                aria-label={`Remove ${movie.title} from watchlist`}
                onClick={() =>
                  dispatch({ type: "REMOVE_MOVIE", payload: movie.id })
                }
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
