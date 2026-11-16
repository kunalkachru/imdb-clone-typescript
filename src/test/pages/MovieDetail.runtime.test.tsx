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
  it("omits runtime when runtime is undefined", () => {
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

    expect(screen.queryByText("undefined min")).not.toBeInTheDocument();
    expect(screen.queryByText(/ min$/)).not.toBeInTheDocument();
  });

  it("omits runtime when runtime is null", () => {
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Null Runtime",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2020-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [],
        runtime: null,
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

    expect(screen.queryByText("min")).not.toBeInTheDocument();
  });

  it("renders 135 minutes as 2h 15m", () => {
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Known Runtime",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2020-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [],
        runtime: 135,
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

    expect(screen.getByText("2h 15m")).toBeInTheDocument();
    expect(screen.queryByText("135 min")).not.toBeInTheDocument();
  });

  it("renders 45 minutes as 45m", () => {
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Short Runtime",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2020-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [],
        runtime: 45,
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

    expect(screen.getByText("45m")).toBeInTheDocument();
  });
});
