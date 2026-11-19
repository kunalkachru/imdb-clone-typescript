import { cleanup, render, screen } from "@testing-library/react";
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

const renderMovie = (details: Record<string, unknown>) => {
  mockUseFetch.mockReturnValue({
    data: {
      id: 1,
      title: "Financials Movie",
      overview: "Overview",
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      release_date: "2020-01-01",
      vote_average: 8.4,
      vote_count: 100,
      genre_ids: [],
      ...details,
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
};

describe("MovieDetail financials and original language", () => {
  it("renders compact budget and box office amounts", () => {
    renderMovie({ budget: 63_000_000, revenue: 1_200_000_000 });

    expect(screen.getByText("Budget $63M")).toBeInTheDocument();
    expect(screen.getByText("Box office $1.2B")).toBeInTheDocument();
  });

  it("renders the original language as a name", () => {
    renderMovie({ original_language: "en" });

    expect(screen.getByText("Original language English")).toBeInTheDocument();
    expect(screen.queryByText("Original language en")).not.toBeInTheDocument();
  });

  it("omits unknown or zero budget and box office independently", () => {
    renderMovie({ budget: 0, revenue: 125_000_000 });

    expect(screen.queryByText(/Budget/)).not.toBeInTheDocument();
    expect(screen.getByText("Box office $125M")).toBeInTheDocument();

    cleanup();
    renderMovie({ budget: 63_000_000, revenue: 0 });

    expect(screen.getByText("Budget $63M")).toBeInTheDocument();
    expect(screen.queryByText(/Box office/)).not.toBeInTheDocument();
  });

  it("formats smaller positive money values compactly", () => {
    renderMovie({ budget: 950_000, revenue: 125_000 });

    expect(screen.getByText("Budget $950K")).toBeInTheDocument();
    expect(screen.getByText("Box office $125K")).toBeInTheDocument();
    expect(screen.queryByText(/950000|125000/)).not.toBeInTheDocument();
  });
});
