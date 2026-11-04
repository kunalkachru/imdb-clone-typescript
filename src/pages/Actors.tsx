import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getPopularActors } from "../services/tmdb";
import type { Person } from "../types/person";

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? "";

const Actors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [actors, setActors] = useState<Person[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Each change of `page` fetches that TMDB page; page 1 replaces the list,
  // later pages are appended below the existing actors.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getPopularActors(page);
        if (!cancelled) {
          setActors((prev) =>
            page === 1 ? result.results : [...prev, ...result.results],
          );
          setTotalPages(Math.max(result.total_pages, 1));
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleSearch = () => {
    const cleaned = searchQuery.trim();
    if (cleaned) {
      navigate(`/?search=${encodeURIComponent(cleaned)}`);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <div className="p-8">
        <h1 className="text-white text-4xl font-bold mb-8">Popular Actors</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              {actor.profile_path ? (
                <img
                  src={`${IMAGE_BASE_URL}/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full object-cover"
                />
              ) : (
                <div
                  data-testid="actor-placeholder"
                  className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700 text-gray-400 text-sm"
                >
                  No photo
                </div>
              )}
              <div className="p-3">
                <h2 className="text-white font-semibold text-sm truncate">
                  {actor.name}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <p className="text-white text-2xl animate-pulse">Loading...</p>
          </div>
        )}

        {!loading && page < totalPages && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actors;
