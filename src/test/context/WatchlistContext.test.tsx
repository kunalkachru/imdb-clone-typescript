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
      <div data-testid="count">{watchlist.length}</div>
      <button onClick={() => dispatch({ type: "ADD_MOVIE", payload: movie })}>
        add
      </button>
    </div>
  );
};

describe("WatchlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists watchlist per user key", async () => {
    render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await userEvent.click(screen.getByText("add"));

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));
    expect(localStorage.getItem("watchlist:1")).toContain('"id":1');
  });

  it("loads the correct watchlist when user changes", async () => {
    localStorage.setItem("watchlist:1", JSON.stringify([movie]));
    localStorage.setItem(
      "watchlist:2",
      JSON.stringify([{ ...movie, id: 2, title: "Other movie" }]),
    );

    const { rerender } = render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));

    rerender(
      <AuthContext.Provider
        value={{
          ...defaultAuthValue,
          user: { id: 2, name: "Jane", email: "jane@example.com", createdAt: "now" },
        }}
      >
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));
    expect(localStorage.getItem("watchlist:2")).toContain('"id":2');
  });

  it("does not leak previous user's movies into a new user's empty watchlist", async () => {
    localStorage.setItem("watchlist:1", JSON.stringify([movie]));
    localStorage.setItem("watchlist:2", JSON.stringify([]));

    const { rerender } = render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));

    rerender(
      <AuthContext.Provider
        value={{
          ...defaultAuthValue,
          user: { id: 2, name: "Jane", email: "jane@example.com", createdAt: "now" },
        }}
      >
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("0"));
    expect(localStorage.getItem("watchlist:2")).toBe("[]");
  });
});
