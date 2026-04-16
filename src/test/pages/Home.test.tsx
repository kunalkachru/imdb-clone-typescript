import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "../../pages/Home";
import { AuthContext } from "../../context/AuthContextDef";
import type { AuthContextType } from "../../types/auth";

const mockUseFetch = vi.fn();

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

describe("Home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trending movies", () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return {
          data: { genres: [{ id: 28, name: "Action" }] },
          loading: false,
          error: null,
        };
      }
      return {
        data: {
          page: 1,
          total_pages: 3,
          total_results: 60,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
      };
    });

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("🎬 Trending Movies")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("searches and displays result heading", async () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return {
          data: { genres: [{ id: 28, name: "Action" }] },
          loading: false,
          error: null,
        };
      }
      const depValue = String(dependency ?? "");
      const hasSearch = depValue.includes("inception");
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: hasSearch ? 1 : 0,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
      };
    });

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "inception");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText('Results for "inception"')).toBeInTheDocument();
  });

  it("supports combining search with genre filter", async () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return {
          data: {
            genres: [
              { id: 28, name: "Action" },
              { id: 18, name: "Drama" },
            ],
          },
          loading: false,
          error: null,
        };
      }
      return {
        data: {
          page: 1,
          total_pages: 2,
          total_results: 10,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
      };
    });

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await userEvent.selectOptions(screen.getByLabelText("Browse by genre"), "28");
    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "inception");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(
      screen.getByText('Results for "inception" in Action'),
    ).toBeInTheDocument();
  });

  it("renders numbered pagination and clears filters", async () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return {
          data: { genres: [{ id: 28, name: "Action" }] },
          loading: false,
          error: null,
        };
      }

      const depValue = String(dependency ?? "");
      const pageMatch = depValue.match(/\|(\d+)$/);
      const page = Number(pageMatch?.[1] ?? "1");
      return {
        data: {
          page,
          total_pages: 6,
          total_results: 120,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
      };
    });

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole("button", { name: "Go to page 2" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    expect(screen.getByText("Page 2 of 6")).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText("Browse by genre"), "28");
    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "inception");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(
      screen.getByText('Results for "inception" in Action'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("🎬 Trending Movies")).toBeInTheDocument();
  });
});
