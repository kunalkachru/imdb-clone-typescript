import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Watchlist from "../../pages/Watchlist";
import { WatchlistContext } from "../../context/WatchlistContextDef";
import { AuthContext } from "../../context/AuthContextDef";
import type { WatchlistContextType } from "../../types/watchlist";
import type { AuthContextType } from "../../types/auth";

const authValue: AuthContextType = {
  user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
  token: "token",
  status: "success",
  error: null,
  login: async () => true,
  register: async () => true,
  logout: vi.fn(),
};

const movie = {
  id: 1,
  title: "Inception",
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2010-01-01",
  vote_average: 8.4,
  vote_count: 100,
  genre_ids: [1],
};

const renderWithContext = (watchlistContext: WatchlistContextType) =>
  render(
    <AuthContext.Provider value={authValue}>
      <WatchlistContext.Provider value={watchlistContext}>
        <MemoryRouter>
          <Watchlist />
        </MemoryRouter>
      </WatchlistContext.Provider>
    </AuthContext.Provider>,
  );

describe("Watchlist page", () => {
  it("renders empty state", () => {
    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    expect(screen.getByText("No movies in your watchlist yet")).toBeInTheDocument();
  });

  it("renders movies and supports clearing", async () => {
    const dispatch = vi.fn();

    renderWithContext({
      watchlist: [movie],
      dispatch,
      isInWatchlist: () => true,
    });

    expect(screen.getByText("Inception")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR" });
  });
});
