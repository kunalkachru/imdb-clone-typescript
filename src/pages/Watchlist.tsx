import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types/movie";
import Navbar from "../components/Navbar";

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, dispatch } = useWatchlist();

  // TS LESSON: local search state — filters watchlist only
  const [searchQuery, setSearchQuery] = useState<string>("");

  // TS LESSON: derived state — filter movies based on searchQuery
  // no API call needed — just filter existing array
  const filteredMovies: Movie[] = searchQuery.trim()
    ? watchlist.filter((movie: Movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : watchlist; // no search — show all

  const handleSearch = () => {
    // search happens live as user types — nothing extra needed here
    // but keeping onSearch for Navbar compatibility
  };

  const heading = searchQuery.trim()
    ? `Results for "${searchQuery}" in Watchlist`
    : "🎬 My Watchlist";

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(val: string) => setSearchQuery(val)}
        onSearch={handleSearch}
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

        {/* Empty watchlist */}
        {watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-gray-400 text-xl">
              No movies in your watchlist yet
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
            <p className="text-gray-400 text-xl">
              No movies matching "{searchQuery}" in your watchlist
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
            >
              Clear Search
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
              <div
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full object-cover"
                />
                <div className="p-3">
                  <h2 className="text-white font-semibold text-sm truncate">
                    {movie.title}
                  </h2>
                  <p className="text-yellow-400 text-sm mt-1">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Remove button on hover */}
              <button
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
