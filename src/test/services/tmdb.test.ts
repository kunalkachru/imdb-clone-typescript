import { afterEach, describe, expect, it, vi } from "vitest";
import { getMovieDetail, searchMovies } from "../../services/tmdb";

describe("tmdb service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("appends api_key without breaking existing query params", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ results: [], page: 1, total_pages: 1, total_results: 0 }),
    } as Response);

    await searchMovies("batman", 2);

    const calledUrl = fetchMock.mock.calls[0]?.[0];
    expect(String(calledUrl)).toContain("/search/movie?query=batman&page=2");
    expect(String(calledUrl)).toContain("api_key=");
    expect(String(calledUrl)).toContain("&api_key=");
  });

  it("normalizes movie detail genres", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        title: "Movie",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2020-01-01",
        vote_average: 7.2,
        vote_count: 100,
        genre_ids: [1],
      }),
    } as Response);

    const detail = await getMovieDetail(1);
    expect(detail.genres).toEqual([]);
  });

  it("throws detailed error message on request failures", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({}),
    } as Response);

    await expect(searchMovies("test")).rejects.toThrow(
      "Error fetching data from TMDB (401): Unauthorized",
    );
  });
});
