import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import { WatchlistProvider } from "../context/WatchlistContext";

const { testMovie, testUser } = vi.hoisted(() => ({
  testUser: {
    id: 1,
    name: "Test Viewer",
    email: "viewer@example.com",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  testMovie: {
    id: 1,
    title: "Test Movie",
    overview: "A stable movie fixture for route-shell tests.",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: "2026-01-01",
    vote_average: 8,
    vote_count: 100,
    popularity: 10,
    adult: false,
    video: false,
    genre_ids: [],
  },
}));

vi.hoisted(() => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: 1,
      name: "Test Viewer",
      email: "viewer@example.com",
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  localStorage.setItem("token", "test-token");
});

vi.mock("../hooks/useFetch", () => ({
  default: (_fetcher: unknown, key?: string | number) => ({
    data:
      key === "movie-genres"
        ? { genres: [] }
        : key === 1
          ? testMovie
        : {
            page: 1,
            results: [testMovie],
            total_pages: 1,
            total_results: 1,
          },
    loading: false,
    error: null,
  }),
}));

vi.mock("../services/tmdb", () => ({
  getPopularActors: vi.fn().mockResolvedValue({
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  }),
  getMovieDetail: vi.fn().mockResolvedValue(testMovie),
  getMovieGenres: vi.fn().mockResolvedValue({ genres: [] }),
  getTrendingMovies: vi.fn().mockResolvedValue({
    page: 1,
    results: [testMovie],
    total_pages: 1,
    total_results: 1,
  }),
  searchMovies: vi.fn().mockResolvedValue({
    page: 1,
    results: [testMovie],
    total_pages: 1,
    total_results: 1,
  }),
  discoverMoviesByGenre: vi.fn().mockResolvedValue({
    page: 1,
    results: [testMovie],
    total_pages: 1,
    total_results: 1,
  }),
}));

vi.mock("../services/auth", () => ({
  loginUser: vi.fn().mockResolvedValue({ user: testUser, token: "test-token" }),
  registerUser: vi.fn().mockResolvedValue({ user: testUser, token: "test-token" }),
}));

const configuredRoutes = [
  "/",
  "/movie/1",
  "/login",
  "/register",
  "/actors",
  "/watchlist",
];

const renderApp = (initialEntries: string[] = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </AuthProvider>
    </MemoryRouter>,
  );

const expectSingleVisibleAttribution = () => {
  expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  expect(screen.getByText("Movie data from TMDB")).toBeVisible();
};

describe("application route shell", () => {
  it("renders exactly one TMDB attribution footer on each configured route", () => {
    localStorage.setItem("user", JSON.stringify(testUser));
    localStorage.setItem("token", "test-token");

    for (const route of configuredRoutes) {
      const { unmount } = renderApp([route]);
      expectSingleVisibleAttribution();
      unmount();
    }
  });

  it("keeps exactly one TMDB attribution footer after navigating between configured routes", async () => {
    localStorage.setItem("user", JSON.stringify(testUser));
    localStorage.setItem("token", "test-token");
    const user = userEvent.setup();
    renderApp();

    expectSingleVisibleAttribution();

    await user.click(screen.getByRole("link", { name: "Actors" }));
    expect(screen.getByRole("heading", { name: "Popular Actors" })).toBeVisible();
    expectSingleVisibleAttribution();

    await user.click(screen.getByRole("link", { name: "Watchlist" }));
    expect(screen.getByRole("heading", { name: /My Watchlist/ })).toBeVisible();
    expectSingleVisibleAttribution();

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("heading", { name: "🎬 Trending Movies" })).toBeVisible();
    expectSingleVisibleAttribution();
  });
});
