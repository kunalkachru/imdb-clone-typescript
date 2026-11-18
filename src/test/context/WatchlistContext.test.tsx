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

const RemoveHarness = () => {
  const { watchlist, dispatch } = useWatchlist();

  return (
    <>
      <div data-testid="count">{watchlist.length}</div>
      <button onClick={() => dispatch({ type: "REMOVE_MOVIE", payload: movie.id })}>
        remove
      </button>
    </>
  );
};

const ToggleHarness = () => {
  const { watchlist, dispatch } = useWatchlist();

  return (
    <>
      <div data-testid="toggle-count">{watchlist.length}</div>
      <button onClick={() => dispatch({ type: "TOGGLE_MOVIE", payload: movie })}>
        toggle
      </button>
    </>
  );
};

describe("WatchlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("AC-6: persists added movies under the active user's watchlist key", async () => {
    const remountedView = render(
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

  it("AC-6: loads the correct watchlist when the active user changes", async () => {
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

  it("AC-6: does not leak the previous user's movies into a new user's empty watchlist", async () => {
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

  it("AC-6: persists removals and restores the saved state after a provider remount", async () => {
    const view = render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await userEvent.click(screen.getByText("add"));
    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));

    view.unmount();

    const remountedView = render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <Harness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("1"));

    remountedView.unmount();
    render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <RemoveHarness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await userEvent.click(screen.getByText("remove"));
    await waitFor(() => expect(localStorage.getItem("watchlist:1")).toBe("[]"));
  });

  it("AC-6: toggles a movie in the active user's watchlist state", async () => {
    render(
      <AuthContext.Provider value={defaultAuthValue}>
        <WatchlistProvider>
          <ToggleHarness />
        </WatchlistProvider>
      </AuthContext.Provider>,
    );

    await userEvent.click(screen.getByText("toggle"));
    await waitFor(() => expect(screen.getByTestId("toggle-count")).toHaveTextContent("1"));
    await userEvent.click(screen.getByText("toggle"));
    await waitFor(() => expect(screen.getByTestId("toggle-count")).toHaveTextContent("0"));
    expect(localStorage.getItem("watchlist:1")).toBe("[]");
  });
});
