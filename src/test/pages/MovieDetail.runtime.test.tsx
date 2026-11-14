import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetail from "../../pages/MovieDetail";

const mockUseFetch = vi.fn();

vi.mock("../../hooks/useFetch", () => ({
  default: (...args: unknown[]) => mockUseFetch(...args),
}));

vi.mock("../../hooks/useWatchlist", () => ({
  useWatchlist: () => ({
    dispatch: vi.fn(),
    isInWatchlist: vi.fn(() => false),
  }),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

describe("MovieDetail runtime", () => {
  it("reproduces the undefined runtime text when runtime is unknown", () => {
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Unknown Runtime",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2020-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("undefined min")).toBeInTheDocument();
  });
});
