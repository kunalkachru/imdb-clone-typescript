import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "../../pages/Home";
import { AuthContext } from "../../context/AuthContextDef";
import type { AuthContextType } from "../../types/auth";

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
    mockIsInWatchlist.mockReturnValue(false);
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

  it("renders a grey No poster placeholder for a movie without a poster", () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return { data: { genres: [] }, loading: false, error: null };
      }
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "" }],
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

    expect(screen.getByText("No poster")).toHaveClass("bg-gray-400");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the existing poster and title alt text for a movie with a poster", () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return { data: { genres: [] }, loading: false, error: null };
      }
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: 1,
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

    expect(screen.getByRole("img", { name: "Inception" })).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/p.jpg",
    );
  });

  it("AC-1: adds and removes a movie from the card watchlist toggle without navigating", async () => {
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return { data: { genres: [] }, loading: false, error: null };
      }
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
      };
    });

    const view = render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    const toggle = screen.getByRole("button", { name: /Add Inception to watchlist/i });
    await userEvent.click(toggle);
    expect(mockDispatch).toHaveBeenLastCalledWith({
      type: "ADD_MOVIE",
      payload: expect.objectContaining({ id: 1 }),
    });
    expect(screen.getByText("Inception")).toBeInTheDocument();

    mockIsInWatchlist.mockReturnValue(true);
    view.rerender(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Remove Inception from watchlist/i }));
    expect(mockDispatch).toHaveBeenLastCalledWith({ type: "REMOVE_MOVIE", payload: 1 });
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("AC-1: renders an accessible watchlist toggle state for a saved movie", () => {
    mockIsInWatchlist.mockReturnValue(true);
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return { data: { genres: [] }, loading: false, error: null };
      }
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: 1,
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

    expect(
      screen.getByRole("button", { name: "Remove Inception from watchlist" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the release year on cards and keeps the bare title for alt text", () => {
    const releaseDate = "2010-07-16";
    const year = releaseDate.slice(0, 4);
    mockUseFetch.mockImplementation((fetchFn: unknown, dependency: unknown) => {
      void fetchFn;
      if (dependency === "movie-genres") {
        return { data: { genres: [] }, loading: false, error: null };
      }
      return {
        data: {
          page: 1,
          total_pages: 1,
          total_results: 2,
          results: [
            {
              id: 1,
              title: "Inception",
              vote_average: 8.4,
              poster_path: "/p.jpg",
              release_date: releaseDate,
            },
            {
              id: 2,
              title: "Untitled Project",
              vote_average: 5,
              poster_path: "/q.jpg",
              release_date: "",
            },
          ],
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

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0].textContent).toBe(`Inception (${year})`);
    expect(headings[1].textContent).toBe("Untitled Project");
    expect(screen.getByRole("img", { name: "Inception" })).toBeInTheDocument();
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

  it("applies the genre query parameter and renders the genre results heading", () => {
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
          total_pages: 1,
          total_results: 1,
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
      };
    });

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={["/?genre=28"]}>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole("heading", { name: "🎭 Action Movies" })).toBeInTheDocument();
    expect(mockUseFetch).toHaveBeenCalledWith(expect.any(Function), "|28|1");
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
