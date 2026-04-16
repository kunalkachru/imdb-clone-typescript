import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { getTrendingMovies, searchMovies } from "../services/tmdb";
import type { Movie } from "../types/movie";
import Navbar from "../components/Navbar";

interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [hasSearched, setHasSearched] = useState<boolean>(!!urlSearch);
  const [activeSearch, setActiveSearch] = useState<string>(urlSearch);

  const navigate = useNavigate();

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch<TMDBResponse<Movie>>(getTrendingMovies);

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useFetch<TMDBResponse<Movie>>(() => searchMovies(activeSearch), activeSearch);

  const handleSearch = () => {
    const cleanedQuery = searchQuery.trim();
    if (cleanedQuery) {
      setActiveSearch(cleanedQuery);
      setHasSearched(true);
      setSearchParams({ search: cleanedQuery });
    }
  };

  const movies: Movie[] = hasSearched
    ? (searchData?.results ?? [])
    : (trendingData?.results ?? []);

  const loading = hasSearched ? searchLoading : trendingLoading;
  const error = hasSearched ? searchError : trendingError;
  const heading = hasSearched
    ? `Results for "${activeSearch}"`
    : "🎬 Trending Movies";

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(val: string) => {
          setSearchQuery(val);
          if (!val) {
            setHasSearched(false);
            setActiveSearch("");
            setSearchParams({});
          }
        }}
        onSearch={handleSearch}
      />

      <div className="p-8">
        <h1 className="text-white text-4xl font-bold mb-8">{heading}</h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-white text-2xl animate-pulse">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="text-gray-300 text-lg">No movies found.</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie: Movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
