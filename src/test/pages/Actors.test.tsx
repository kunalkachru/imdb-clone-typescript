import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Actors from "../../pages/Actors";
import App from "../../App";
import { AuthContext } from "../../context/AuthContextDef";
import type { AuthContextType } from "../../types/auth";
import { getPopularActors } from "../../services/tmdb";

vi.mock("../../services/tmdb", () => ({
  getPopularActors: vi.fn(),
}));

const mockGetPopularActors = vi.mocked(getPopularActors);

const loggedOut: AuthContextType = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  login: async () => false,
  register: async () => false,
  logout: vi.fn(),
};

const page1 = {
  page: 1,
  total_pages: 2,
  total_results: 3,
  results: [
    { id: 1, name: "Tom Hanks", profile_path: "/hanks.jpg" },
    { id: 2, name: "No Photo Actor", profile_path: null },
  ],
};

const page2 = {
  page: 2,
  total_pages: 2,
  total_results: 3,
  results: [{ id: 3, name: "Meryl Streep", profile_path: "/streep.jpg" }],
};

const renderActors = () =>
  render(
    <AuthContext.Provider value={loggedOut}>
      <MemoryRouter>
        <Actors />
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe("Actors page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the Popular Actors heading", async () => {
    mockGetPopularActors.mockResolvedValue(page1);
    renderActors();

    expect(
      screen.getByRole("heading", { level: 1, name: "Popular Actors" }),
    ).toBeInTheDocument();
    await screen.findByText("Tom Hanks");
  });

  it("renders actor cards with photos and a placeholder when there is no photo", async () => {
    mockGetPopularActors.mockResolvedValue(page1);
    renderActors();

    expect(await screen.findByText("Tom Hanks")).toBeInTheDocument();
    expect(screen.getByText("No Photo Actor")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Tom Hanks" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "No Photo Actor" })).toBeNull();
    expect(screen.getByTestId("actor-placeholder")).toBeInTheDocument();
  });

  it("Show more loads the next page, appends it and hides the button on the last page", async () => {
    mockGetPopularActors.mockImplementation(async (page = 1) =>
      page === 1 ? page1 : page2,
    );
    renderActors();

    await screen.findByText("Tom Hanks");
    await userEvent.click(screen.getByRole("button", { name: "Show more" }));

    expect(await screen.findByText("Meryl Streep")).toBeInTheDocument();
    expect(mockGetPopularActors).toHaveBeenCalledWith(2);
    expect(screen.getByText("Tom Hanks")).toBeInTheDocument();
    expect(screen.getByText("No Photo Actor")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show more" })).toBeNull();
  });

  it("renders the /actors route without requiring login", async () => {
    mockGetPopularActors.mockResolvedValue(page1);
    render(
      <AuthContext.Provider value={loggedOut}>
        <MemoryRouter initialEntries={["/actors"]}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Popular Actors" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("Tom Hanks")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Login")).toBeInTheDocument();
  });
});
