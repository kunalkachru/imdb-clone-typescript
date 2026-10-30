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

    expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR" });
  });

  it("shows the release year for dated movies and the bare title for undated ones", () => {
    const year = movie.release_date.slice(0, 4);
    renderWithContext({
      watchlist: [movie, { ...movie, id: 2, title: "Untitled Project", release_date: "" }],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0].textContent).toBe(`Inception (${year})`);
    expect(headings[1].textContent).toBe("Untitled Project");
    expect(screen.getByRole("img", { name: "Inception" })).toBeInTheDocument();
  });

  it("shows the no-match message with the typed query and a 'Clear search' button", async () => {
    renderWithContext({
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "zzz");

    expect(screen.getByText('No movies match "zzz"')).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent('No movies match "zzz"');
    expect(screen.queryByText(/No movies matching/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear Search" })).not.toBeInTheDocument();
  });

  it("clears the search and shows the full watchlist again", async () => {
    renderWithContext({
      watchlist: [movie, { ...movie, id: 2, title: "Untitled Project", release_date: "" }],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(searchInput, "zzz");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(searchInput).toHaveValue("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    expect(screen.getByText("Untitled Project")).toBeInTheDocument();
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
  });

  it("focuses the search input after 'Clear search' empties it", async () => {
    renderWithContext({
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(searchInput, "zzz");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(searchInput).toHaveValue("");
    expect(searchInput).toHaveFocus();

    await userEvent.keyboard("inc");
    expect(searchInput).toHaveValue("inc");
  });

  it("does not focus the search input on first render or after 'Clear All'", async () => {
    const dispatch = vi.fn();
    renderWithContext({
      watchlist: [movie],
      dispatch,
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    expect(searchInput).not.toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR" });
    expect(searchInput).not.toHaveFocus();
  });

  it("hides the no-match message and 'Clear search' when the query matches or the watchlist is empty", async () => {
    const { unmount } = renderWithContext({
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "incep");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    unmount();

    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "zzz");

    expect(screen.getByText("No movies in your watchlist yet")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
