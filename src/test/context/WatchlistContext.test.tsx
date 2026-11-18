import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { WatchlistProvider } from "../../context/WatchlistContext";
import { useWatchlist } from "../../hooks/useWatchlist";
import { AuthContext } from "../../context/AuthContextDef";
import type { AuthContextType } from "../../types/auth";

const movie = {
  id: 1,
  title: "Movie",
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2020-01-01",
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [1],
};

const otherMovie = { ...movie, id: 2, title: "Other movie" };

const defaultAuthValue: AuthContextType = {
  user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
  token: "token",
  status: "success",
  error: null,
  login: async () => true,
  register: async () => true,
  logout: () => {},
};

const Harness = () => {
  const { watchlist, dispatch } = useWatchlist();

  return (
    <div>
      <div data-testid="watchlist">{JSON.stringify(watchlist)}</div>
      <button onClick={() => dispatch({ type: "ADD_MOVIE", payload: movie })}>
        add movie
      </button>
      <button
        onClick={() => dispatch({ type: "ADD_MOVIE", payload: otherMovie })}
      >
        add other movie
      </button>
      <button onClick={() => dispatch({ type: "REMOVE_MOVIE", payload: movie.id })}>
        remove movie
      </button>
      <button onClick={() => dispatch({ type: "CLEAR" })}>clear watchlist</button>
    </div>
  );
};

const renderWatchlist = (authValue: AuthContextType | null = null) =>
  render(
    <AuthContext.Provider value={authValue}>
      <WatchlistProvider>
        <Harness />
      </WatchlistProvider>
    </AuthContext.Provider>,
  );

describe("WatchlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("AC-6: persists adding, removing, and clearing the complete active watchlist", async () => {
    renderWatchlist();

    await userEvent.click(screen.getByText("add movie"));
    await userEvent.click(screen.getByText("add other movie"));
    await waitFor(() =>
      expect(localStorage.getItem("watchlist:guest")).toBe(
        JSON.stringify([movie, otherMovie]),
      ),
    );

    await userEvent.click(screen.getByText("remove movie"));
    await waitFor(() =>
      expect(localStorage.getItem("watchlist:guest")).toBe(
        JSON.stringify([otherMovie]),
      ),
    );

    await userEvent.click(screen.getByText("clear watchlist"));
    await waitFor(() =>
      expect(localStorage.getItem("watchlist:guest")).toBe("[]"),
    );
  });

  it("AC-6: restores the guest watchlist in a new provider instance", async () => {
    const firstRender = renderWatchlist();

    await userEvent.click(screen.getByText("add movie"));
    await waitFor(() =>
      expect(localStorage.getItem("watchlist:guest")).toBe(JSON.stringify([movie])),
    );

    firstRender.unmount();
    renderWatchlist();

    expect(screen.getByTestId("watchlist")).toHaveTextContent(JSON.stringify([movie]));
  });

  it("AC-6: persists authenticated watchlists under the user-scoped key", async () => {
    renderWatchlist(defaultAuthValue);

    await userEvent.click(screen.getByText("add movie"));

    await waitFor(() =>
      expect(localStorage.getItem("watchlist:1")).toBe(JSON.stringify([movie])),
    );
    expect(localStorage.getItem("watchlist:guest")).toBeNull();
  });
});
