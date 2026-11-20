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
    localStorage.clear();
  });

  it("renders the accessible sort control with Popularity selected by default", async () => {
    mockGetPopularActors.mockResolvedValue(page1);
    renderActors();

    const sortControl = screen.getByRole("combobox", { name: "Sort actors" });
    expect(sortControl).toHaveValue("popularity");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("option", { name: "Popularity" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Name A to Z" })).toBeInTheDocument();
    await screen.findByText("Tom Hanks");
  });

  it("sorts all loaded actors by name with stable equal-name ordering", async () => {
    mockGetPopularActors.mockResolvedValue({
      ...page1,
      results: [
        { id: 1, name: "Zoë Actor", profile_path: null },
        { id: 2, name: "Alex Actor", profile_path: null },
        { id: 3, name: "Alex Actor", profile_path: null },
      ],
      total_pages: 1,
    });
    renderActors();

    await screen.findByText("Zoë Actor");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort actors" }), "name");

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Alex Actor",
      "Alex Actor",
      "Zoë Actor",
    ]);
  });

  it("preserves paginated TMDB order for Popularity and restores it after switching back", async () => {
    mockGetPopularActors.mockImplementation(async (page = 1) =>
      page === 1 ? page1 : page2,
    );
    renderActors();

    await screen.findByText("Tom Hanks");
    await userEvent.click(screen.getByRole("button", { name: "Show more" }));
    await screen.findByText("Meryl Streep");
    const sortControl = screen.getByRole("combobox", { name: "Sort actors" });

    await userEvent.selectOptions(sortControl, "name");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Meryl Streep",
      "No Photo Actor",
      "Tom Hanks",
    ]);
    await userEvent.selectOptions(sortControl, "popularity");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Tom Hanks",
      "No Photo Actor",
      "Meryl Streep",
    ]);
  });

  it("persists Name A to Z and restores the selected option and order after remounting", async () => {
    mockGetPopularActors.mockResolvedValue({
      ...page1,
      results: [
        { id: 1, name: "Zoë Actor", profile_path: null },
        { id: 2, name: "Alex Actor", profile_path: null },
      ],
      total_pages: 1,
    });
    const firstRender = renderActors();

    await screen.findByText("Zoë Actor");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort actors" }), "name");
    expect(localStorage.getItem("actors-sort")).toBe("name");
    firstRender.unmount();

    renderActors();
    await screen.findByText("Zoë Actor");
    expect(screen.getByRole("combobox", { name: "Sort actors" })).toHaveValue("name");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Alex Actor",
      "Zoë Actor",
    ]);
  });

  it("falls back to Popularity for missing or invalid saved sort values", async () => {
    localStorage.setItem("actors-sort", "invalid");
    mockGetPopularActors.mockResolvedValue(page1);
    renderActors();

    await screen.findByText("Tom Hanks");
    expect(screen.getByRole("combobox", { name: "Sort actors" })).toHaveValue("popularity");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Tom Hanks",
      "No Photo Actor",
    ]);
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
