import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetail from "../../pages/MovieDetail";

const mockUseFetch = vi.fn();
const mockDispatch = vi.fn();
const mockIsInWatchlist = vi.fn();

vi.mock("../../hooks/useFetch", () => ({
  default: (...args: unknown[]) => mockUseFetch(...args),
}));

vi.mock("../../hooks/useWatchlist", () => ({
  useWatchlist: () => ({
    dispatch: mockDispatch,
    isInWatchlist: mockIsInWatchlist,
  }),
}));

describe("MovieDetail page", () => {
  it("shows invalid id message for malformed route params", () => {
    mockUseFetch.mockReturnValue({ data: null, loading: false, error: null });

    render(
      <MemoryRouter initialEntries={["/movie/not-a-number"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Invalid movie id")).toBeInTheDocument();
  });

  it("renders movie detail and dispatches add to watchlist", async () => {
    mockIsInWatchlist.mockReturnValue(false);
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2010-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
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

    expect(screen.getByText("Inception")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "➕ Add to Watchlist" }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_MOVIE",
      payload: expect.objectContaining({ id: 1 }),
    });
  });
});
