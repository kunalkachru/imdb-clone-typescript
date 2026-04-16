import type { Movie } from "../types/movie";
import type { MovieDetail } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const headers: HeadersInit = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json;charset=utf-8",
};
// TS LESSON: Generic function — <T> means "whatever type you pass in"
// This is the MOST important TS concept for API calls
// Instead of writing fetchMovies(), fetchMovieDetail() etc separately,
// one generic function handles ALL API calls and returns the right type
async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (API_KEY) {
    url.searchParams.set("api_key", API_KEY);
  }

  const response = await fetch(url.toString(), {
    headers,
  });
  if (!response.ok) {
    throw new Error(
      `Error fetching data from TMDB (${response.status}): ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}
// TS LESSON: API responses have a wrapper — define it
// TMDB wraps movie lists like: { page: 1, results: Movie[], total_pages: 10 }
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Now specific API functions — clean and fully typed
export const getPopularMovies = (page = 1) =>
  fetchFromTMDB<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);

export const getTrendingMovies = () =>
  fetchFromTMDB<TMDBResponse<Movie>>("/trending/movie/week");

export const searchMovies = (query: string, page = 1) =>
  fetchFromTMDB<TMDBResponse<Movie>>(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
  );

export const getMovieDetail = (id: number) =>
  fetchFromTMDB<MovieDetail>(`/movie/${id}`).then((movie) => ({
    ...movie,
    // Keep backwards compatibility with previous "genre" field usage.
    genres: movie.genres ?? [],
  }));
