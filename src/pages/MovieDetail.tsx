import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { getMovieDetail } from "../services/tmdb";
import type { Movie, MovieDetail as MovieDetailType } from "../types/movie";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import { getMovieSurvey } from "../services/survey";
import type { MovieSurveyResponse } from "../types/survey";
import MovieSurveyForm from "../components/survey/MovieSurveyForm";
import MovieSurveySummary from "../components/survey/MovieSurveySummary";
import AudienceSurveySnapshot from "../components/survey/AudienceSurveySnapshot";
import {
  buildAudienceSnapshotMetrics,
  getAudienceCommentHighlights,
} from "../services/surveyCommunity";

const MovieDetail = () => {
  // TS LESSON: useParams returns Record<string, string | undefined>
  // we destructure and type the id explicitly
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);
  const { user } = useAuth();
  const [isSurveyExpanded, setIsSurveyExpanded] = useState(false);

  // TS LESSON: consuming context — fully typed, no null checks needed
  const { dispatch, isInWatchlist } = useWatchlist();

  // TS LESSON: Number() converts string to number
  // id from URL is always a string — TMDB needs a number
  const {
    data: movie,
    loading,
    error,
  } = useFetch<MovieDetailType>(
    () => {
      if (!Number.isFinite(movieId) || movieId <= 0) {
        throw new Error("Invalid movie id");
      }
      return getMovieDetail(movieId);
    },
    movieId, // re-fetch if id changes
  );
  const [surveyVersion, setSurveyVersion] = useState(0);
  const survey = useMemo<MovieSurveyResponse | null>(() => {
    if (!Number.isFinite(movieId) || movieId <= 0) {
      return null;
    }
    void surveyVersion;
    return getMovieSurvey(movieId, user?.id ?? null);
  }, [movieId, user?.id, surveyVersion]);
  const audienceMetrics = useMemo(
    () => buildAudienceSnapshotMetrics(movieId, survey),
    [movieId, survey],
  );
  const audienceComments = useMemo(
    () => getAudienceCommentHighlights(movieId, survey),
    [movieId, survey],
  );

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-500 text-2xl">Invalid movie id</p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-2xl animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );

  // TS LESSON: type narrowing — after this check
  // TypeScript KNOWS movie is MovieDetailType (not null)
  if (!movie) return null;
  // TS LESSON: boolean from typed context function
  const alreadyAdded = isInWatchlist(movie.id);

  // TS LESSON: Movie type cast — MovieDetail extends Movie
  // so we can safely cast it when dispatching
  const handleWatchlist = () => {
    if (alreadyAdded) {
      dispatch({ type: "REMOVE_MOVIE", payload: movie.id });
    } else {
      dispatch({ type: "ADD_MOVIE", payload: movie as Movie });
    }
  };

  const handleSurveySubmitted = (value: MovieSurveyResponse) => {
    void value;
    setSurveyVersion((current) => current + 1);
    setIsSurveyExpanded(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Backdrop */}
      <div className="relative h-96 w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 -mt-32 relative z-10 pb-16">
        <div className="flex gap-8">
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-48 h-72 object-cover rounded-xl shadow-2xl flex-shrink-0"
          />

          {/* Info */}
          <div className="flex flex-col justify-end pb-4">
            <h1 className="text-white text-4xl font-black mb-2">
              {movie.title}
            </h1>

            {/* TS LESSON: optional chaining on optional fields */}
            {movie.tagline && (
              <p className="text-gray-400 text-lg italic mb-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex gap-4 mb-4">
              <span className="text-yellow-400 font-bold text-xl">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300">
                {movie.release_date?.split("-")[0]}
              </span>
              {/* TS LESSON: optional field — runtime might not exist */}
              {movie.runtime && (
                <span className="text-gray-300">{movie.runtime} min</span>
              )}
            </div>

            {/* Genres — optional array */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {movie.genres.map((genre_item) => (
                  <span
                    key={genre_item.id}
                    className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium"
                  >
                    {genre_item.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              {movie.overview}
            </p>
            {/* Watchlist Button — changes based on alreadyAdded */}
            <button
              onClick={handleWatchlist}
              className={`w-fit px-6 py-3 rounded-lg font-bold transition-colors ${
                alreadyAdded
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-yellow-400 hover:bg-yellow-300 text-black"
              }`}
            >
              {alreadyAdded
                ? "❌ Remove from Watchlist"
                : "➕ Add to Watchlist"}
            </button>
          </div>
        </div>

        <div className="mt-12">
          {survey && !isSurveyExpanded ? (
            <MovieSurveySummary
              survey={survey}
              onEdit={() => setIsSurveyExpanded(true)}
            />
          ) : (
            <>
              {!isSurveyExpanded && (
                <div className="rounded-2xl border border-gray-700 bg-gray-800/70 p-6 shadow-xl">
                  <p className="text-sm font-semibold uppercase tracking-wide text-yellow-400">
                    Audience Feedback
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-white">
                    Add your survey response
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                    Capture structured feedback for this movie with multiple ratings,
                    recommendation intent, viewing context, and freeform comments.
                  </p>
                  <button
                    onClick={() => setIsSurveyExpanded(true)}
                    className="mt-5 rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black transition-colors hover:bg-yellow-300"
                  >
                    {survey ? "Edit Feedback" : "Open Survey"}
                  </button>
                </div>
              )}

              {isSurveyExpanded && (
                <MovieSurveyForm
                  movieId={movie.id}
                  userId={user?.id ?? null}
                  existingSurvey={survey}
                  onSubmitted={handleSurveySubmitted}
                  onCancel={() => setIsSurveyExpanded(false)}
                />
              )}
            </>
          )}
        </div>

        <AudienceSurveySnapshot
          metrics={audienceMetrics}
          comments={audienceComments}
        />
      </div>
    </div>
  );
};

export default MovieDetail;
