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
  const saved = isInWatchlist(movie.id);

  const handleWatchlistToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(
      saved
        ? { type: "REMOVE_MOVIE", payload: movie.id }
        : { type: "ADD_MOVIE", payload: movie },
    );
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
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
      </div>
      <button
        type="button"
        aria-label={`${saved ? "Remove" : "Add"} ${movie.title} ${saved ? "from" : "to"} watchlist`}
        aria-pressed={saved}
        onClick={handleWatchlistToggle}
        className="absolute top-2 right-2 rounded-full bg-gray-900/90 px-3 py-2 text-sm font-semibold text-white"
      >
        {saved ? "✓" : "+"}
      </button>
    </div>
  );
};

export default MovieCard;
