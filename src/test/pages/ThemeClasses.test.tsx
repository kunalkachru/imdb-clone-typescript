import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import MovieDetail from "../../pages/MovieDetail";
import Watchlist from "../../pages/Watchlist";
import { AuthContext } from "../../context/AuthContextDef";
import { WatchlistContext } from "../../context/WatchlistContextDef";
import type { AuthContextType } from "../../types/auth";
import type { WatchlistContextType } from "../../types/watchlist";

const mockUseFetch = vi.fn();
const mockDispatch = vi.fn();
const mockIsInWatchlist = vi.fn();

vi.mock("../../hooks/useFetch", () => ({
  default: (...args: unknown[]) => mockUseFetch(...args),
}));

const authValue: AuthContextType = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  login: async () => false,
  register: async () => false,
  logout: vi.fn(),
};

const watchlistAuthValue: AuthContextType = {
  ...authValue,
  user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
  token: "token",
  status: "success",
  login: async () => true,
  register: async () => true,
};

const movie = {
  id: 1,
  title: "Inception",
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "",
  vote_average: 8.4,
  vote_count: 100,
  genre_ids: [1],
};

// A class token is a light base when it has no `dark:` prefix and a dark
// counterpart when it does. Only colour utilities count (not text-2xl etc.).
const colour = (utility: "bg" | "text") =>
  new RegExp(`^${utility}-(white|black|(gray|yellow|red)-\\d{2,3})(\\/\\d+)?$`);

const expectLightAndDarkPair = (
  el: HTMLElement,
  utility: "bg" | "text",
  label: string,
) => {
  const tokens = el.className.split(/\s+/).filter(Boolean);
  const base = tokens.filter((t) => colour(utility).test(t));
  const dark = tokens
    .filter((t) => t.startsWith("dark:"))
    .map((t) => t.slice("dark:".length))
    .filter((t) => colour(utility).test(t));
  expect(
    base.length,
    `${label} needs a light ${utility}- colour class, got "${el.className}"`,
  ).toBeGreaterThan(0);
  expect(
    dark.length,
    `${label} needs a dark:${utility}- colour class, got "${el.className}"`,
  ).toBeGreaterThan(0);
};

describe("Page light/dark class pairs", () => {
  it("Home wrapper and heading have light bases with dark: variants", () => {
    mockUseFetch.mockImplementation((_fetchFn: unknown, dependency: unknown) => {
      if (dependency === "movie-genres") {
        return { data: { genres: [] }, loading: false, error: null };
      }
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [{ ...movie, title: "Inception" }],
        },
        loading: false,
        error: null,
      };
    });

    const { container } = render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    const root = container.firstElementChild as HTMLElement;
    expectLightAndDarkPair(root, "bg", "Home wrapper");
    expectLightAndDarkPair(
      screen.getByText("🎬 Trending Movies"),
      "text",
      "Home heading",
    );
    const card = screen.getByRole("heading", { level: 2, name: "Inception" })
      .parentElement!.parentElement!;
    expectLightAndDarkPair(card, "bg", "Home movie card");
  });

  it("Login wrapper, card and form surfaces have light/dark pairs", () => {
    const { container } = render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expectLightAndDarkPair(
      container.firstElementChild as HTMLElement,
      "bg",
      "Login wrapper",
    );
    const card = screen.getByText("Sign in to your account").parentElement!
      .parentElement!;
    expectLightAndDarkPair(card, "bg", "Login card");
    expectLightAndDarkPair(
      screen.getByText("Sign in to your account"),
      "text",
      "Login subtitle",
    );
    expectLightAndDarkPair(
      screen.getByPlaceholderText("john@example.com"),
      "bg",
      "Login email input",
    );
    expectLightAndDarkPair(
      screen.getByPlaceholderText("john@example.com"),
      "text",
      "Login email input text",
    );
    expectLightAndDarkPair(
      screen.getByTestId("login-helper-text"),
      "text",
      "Login helper text",
    );
  });

  it("Register wrapper, card and form surfaces have light/dark pairs", () => {
    const { container } = render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expectLightAndDarkPair(
      container.firstElementChild as HTMLElement,
      "bg",
      "Register wrapper",
    );
    const card = screen.getByText("Create your account").parentElement!
      .parentElement!;
    expectLightAndDarkPair(card, "bg", "Register card");
    expectLightAndDarkPair(
      screen.getByText("Create your account"),
      "text",
      "Register subtitle",
    );
    expectLightAndDarkPair(
      screen.getByPlaceholderText("John Doe"),
      "bg",
      "Register name input",
    );
    expectLightAndDarkPair(
      screen.getByTestId("register-helper-text"),
      "text",
      "Register helper text",
    );
  });

  it("MovieDetail wrapper, title and survey card have light/dark pairs", () => {
    mockIsInWatchlist.mockReturnValue(false);
    mockUseFetch.mockReturnValue({
      data: {
        ...movie,
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    const { container } = render(
      <AuthContext.Provider value={watchlistAuthValue}>
        <WatchlistContext.Provider
          value={{
            watchlist: [],
            dispatch: mockDispatch,
            isInWatchlist: mockIsInWatchlist,
          }}
        >
          <MemoryRouter initialEntries={["/movie/1"]}>
            <Routes>
              <Route path="/movie/:id" element={<MovieDetail />} />
            </Routes>
          </MemoryRouter>
        </WatchlistContext.Provider>
      </AuthContext.Provider>,
    );

    expectLightAndDarkPair(
      container.firstElementChild as HTMLElement,
      "bg",
      "MovieDetail wrapper",
    );
    expectLightAndDarkPair(
      screen.getByRole("heading", { level: 1, name: "Inception" }),
      "text",
      "MovieDetail title",
    );
    const surveyCard = screen.getByRole("heading", {
      level: 2,
      name: "Add your survey response",
    }).parentElement!;
    expectLightAndDarkPair(surveyCard, "bg", "MovieDetail survey card");
    expectLightAndDarkPair(
      screen.getByText("Audience Feedback"),
      "text",
      "MovieDetail eyebrow",
    );
  });

  it("Watchlist wrapper, heading, empty-state text and cards have light/dark pairs", () => {
    const emptyContext: WatchlistContextType = {
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    };
    const { container, unmount } = render(
      <AuthContext.Provider value={watchlistAuthValue}>
        <WatchlistContext.Provider value={emptyContext}>
          <MemoryRouter>
            <Watchlist />
          </MemoryRouter>
        </WatchlistContext.Provider>
      </AuthContext.Provider>,
    );

    expectLightAndDarkPair(
      container.firstElementChild as HTMLElement,
      "bg",
      "Watchlist wrapper",
    );
    expectLightAndDarkPair(
      screen.getByRole("heading", { level: 1 }),
      "text",
      "Watchlist heading",
    );
    expectLightAndDarkPair(
      screen.getByText("No movies in your watchlist yet"),
      "text",
      "Watchlist empty text",
    );
    expectLightAndDarkPair(
      screen.getByTestId("watchlist-empty-guidance"),
      "text",
      "Watchlist guidance text",
    );
    unmount();

    const filledContext: WatchlistContextType = {
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    };
    render(
      <AuthContext.Provider value={watchlistAuthValue}>
        <WatchlistContext.Provider value={filledContext}>
          <MemoryRouter>
            <Watchlist />
          </MemoryRouter>
        </WatchlistContext.Provider>
      </AuthContext.Provider>,
    );

    const card = screen.getByRole("heading", { level: 2, name: "Inception" })
      .closest(".group") as HTMLElement;
    expectLightAndDarkPair(card, "bg", "Watchlist movie card");
    expectLightAndDarkPair(
      screen.getByRole("heading", { level: 2, name: "Inception" }),
      "text",
      "Watchlist card title",
    );
  });
});
