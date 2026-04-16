import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  discoverMoviesByGenre,
  getMovieGenres,
  getTrendingMovies,
  searchMovies,
  type TMDBResponse,
} from "../services/tmdb";
import type { Genre, Movie } from "../types/movie";
import Navbar from "../components/Navbar";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const urlGenre = searchParams.get("genre") ?? "";
  const urlPage = Number(searchParams.get("page") ?? "1");
  const initialPage = Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1;

  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [activeSearch, setActiveSearch] = useState<string>(urlSearch);
  const [selectedGenre, setSelectedGenre] = useState<string>(urlGenre);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const navigate = useNavigate();
  const hasSearched = activeSearch.trim().length > 0;
  const selectedGenreId = Number(selectedGenre);
  const hasGenreFilter = Number.isFinite(selectedGenreId) && selectedGenreId > 0;

  const updateParams = ({
    nextSearch = activeSearch,
    nextGenre = selectedGenre,
    nextPage = currentPage,
  }: {
    nextSearch?: string;
    nextGenre?: string;
    nextPage?: number;
  }) => {
    const nextParams = new URLSearchParams();
    if (nextSearch.trim()) {
      nextParams.set("search", nextSearch.trim());
    }
    if (nextGenre.trim()) {
      nextParams.set("genre", nextGenre.trim());
    }
    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }
    setSearchParams(nextParams);
  };

  const {
    data: movieData,
    loading,
    error,
  } = useFetch<TMDBResponse<Movie>>(() => {
    if (hasSearched) {
      return searchMovies(
        activeSearch,
        currentPage,
        hasGenreFilter ? selectedGenreId : undefined,
      );
    }
    if (hasGenreFilter) {
      return discoverMoviesByGenre(selectedGenreId, currentPage);
    }
    return getTrendingMovies(currentPage);
  }, `${activeSearch}|${selectedGenre}|${currentPage}`);

  const { data: genresData } = useFetch<{ genres: Genre[] }>(
    getMovieGenres,
    "movie-genres",
  );

  const handleSearch = () => {
    const cleanedQuery = searchQuery.trim();
    if (cleanedQuery) {
      setActiveSearch(cleanedQuery);
      setCurrentPage(1);
      updateParams({ nextSearch: cleanedQuery, nextPage: 1 });
    }
  };

  const movies: Movie[] = movieData?.results ?? [];
  const totalPages = Math.max(movieData?.total_pages ?? 1, 1);
  const activePage = movieData?.page ?? currentPage;
  const activeGenreName =
    genresData?.genres.find((genre) => genre.id === selectedGenreId)?.name ?? "";
  const heading = hasSearched
    ? hasGenreFilter
      ? `Results for "${activeSearch}" in ${activeGenreName || "selected genre"}`
      : `Results for "${activeSearch}"`
    : hasGenreFilter
      ? `🎭 ${activeGenreName || "Genre"} Movies`
      : "🎬 Trending Movies";

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setCurrentPage(nextPage);
    updateParams({ nextPage });
  };

  const maxButtons = 5;
  const pageStart = Math.max(1, activePage - Math.floor(maxButtons / 2));
  const pageEnd = Math.min(totalPages, pageStart + maxButtons - 1);
  const visiblePages = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, idx) => pageStart + idx,
  );
  const canResetFilters = hasSearched || hasGenreFilter;

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(val: string) => {
          setSearchQuery(val);
          if (!val) {
            setActiveSearch("");
            setCurrentPage(1);
            updateParams({ nextSearch: "", nextPage: 1 });
          }
        }}
        onSearch={handleSearch}
      />

      <div className="p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h1 className="text-white text-4xl font-bold">{heading}</h1>
          <div className="w-full max-w-sm space-y-3">
            <label
              htmlFor="genre-filter"
              className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-400"
            >
              Browse by genre
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(event) => {
                const nextGenre = event.target.value;
                setSelectedGenre(nextGenre);
                setCurrentPage(1);
                updateParams({
                  nextGenre,
                  nextSearch: activeSearch,
                  nextPage: 1,
                });
              }}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 focus:border-yellow-400 focus:outline-none"
            >
              <option value="">All genres (trending)</option>
              {(genresData?.genres ?? []).map((genre) => (
                <option key={genre.id} value={String(genre.id)}>
                  {genre.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveSearch("");
                setSelectedGenre("");
                setCurrentPage(1);
                setSearchParams(new URLSearchParams());
              }}
              disabled={!canResetFilters}
              className="w-full rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear filters
            </button>
          </div>
        </div>

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

        {!loading && !error && movies.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => goToPage(activePage - 1)}
              disabled={activePage <= 1}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm font-semibold text-gray-300">
              Page {activePage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    page === activePage
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-gray-700 text-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage >= totalPages}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
