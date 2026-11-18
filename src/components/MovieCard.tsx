import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../types/movie";
import { formatMovieTitle } from "../utils/formatMovieTitle";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const { dispatch, isInWatchlist } = useWatchlist();
  const selected = isInWatchlist(movie.id);

  const handleWatchlistToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(
      selected
        ? { type: "REMOVE_MOVIE", payload: movie.id }
        : { type: "ADD_MOVIE", payload: movie },
    );
  };

  return (
    <article
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="movie-card bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full object-cover"
      />
      <div className="p-3">
        <h2 className="text-white font-semibold text-sm truncate">
          {formatMovieTitle(movie.title, movie.release_date)}
        </h2>
        <p className="text-yellow-400 text-sm mt-1">
          ⭐ {movie.vote_average.toFixed(1)}
        </p>
        <button
          type="button"
          aria-label={`${selected ? "Remove" : "Add"} ${movie.title} to watchlist`}
          aria-pressed={selected}
          onClick={handleWatchlistToggle}
          className={`movie-card-watchlist-toggle mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            selected
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          {selected ? "❌ Remove from Watchlist" : "➕ Add to Watchlist"}
        </button>
      </div>
    </article>
  );
};

export default MovieCard;
