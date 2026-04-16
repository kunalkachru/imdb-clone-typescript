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
    mockUseFetch
      .mockReturnValueOnce({
        data: { results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }] },
        loading: false,
        error: null,
      })
      .mockReturnValueOnce({ data: null, loading: false, error: null });

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("🎬 Trending Movies")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("searches and displays result heading", async () => {
    mockUseFetch
      .mockReturnValueOnce({ data: { results: [] }, loading: false, error: null })
      .mockReturnValue({
        data: {
          results: [{ id: 1, title: "Inception", vote_average: 8.4, poster_path: "/p.jpg" }],
        },
        loading: false,
        error: null,
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
});
