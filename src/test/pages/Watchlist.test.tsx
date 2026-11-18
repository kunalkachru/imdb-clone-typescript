import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Watchlist from "../../pages/Watchlist";
import { WatchlistContext } from "../../context/WatchlistContextDef";
import { AuthContext } from "../../context/AuthContextDef";
import type { WatchlistContextType } from "../../types/watchlist";
import type { AuthContextType } from "../../types/auth";

const authValue: AuthContextType = {
  user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
  token: "token",
  status: "success",
  error: null,
  login: async () => true,
  register: async () => true,
  logout: vi.fn(),
};

const movie = {
  id: 1,
  title: "Inception",
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2010-01-01",
  vote_average: 8.4,
  vote_count: 100,
  genre_ids: [1],
};

const movies = [
  { ...movie, id: 1, title: "Bravo", vote_average: 7.5 },
  { ...movie, id: 2, title: "Alpha", vote_average: 9.2 },
  { ...movie, id: 3, title: "Charlie", vote_average: 8.1 },
];

const renderWithContext = (watchlistContext: WatchlistContextType) =>
  render(
    <AuthContext.Provider value={authValue}>
      <WatchlistContext.Provider value={watchlistContext}>
        <MemoryRouter>
          <Watchlist />
        </MemoryRouter>
      </WatchlistContext.Provider>
    </AuthContext.Provider>,
  );

describe("Watchlist page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("AC-5: renders the empty state without movie cards or toggles", () => {
    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    expect(screen.getByText("No movies in your watchlist yet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /watchlist/i })).not.toBeInTheDocument();
  });

  it("shows the headline and guidance paragraph in the empty state", () => {
    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    expect(screen.getByRole("heading", { level: 1, name: "🎬 My Watchlist (0)" })).toBeInTheDocument();
    expect(screen.getByTestId("watchlist-empty-guidance")).toHaveTextContent(
      "Signed-in users can save films to their watchlist from any movie page.",
    );
    expect(screen.getByTestId("watchlist-empty-guidance")).not.toHaveAttribute("role");
  });

  it("renders no movie cards, images or search-result messages in the empty state", () => {
    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Browse Movies" })).toBeInTheDocument();
  });

  it("centers and sizes the empty-state block for small screens", () => {
    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    const container = screen.getByText("No movies in your watchlist yet").parentElement!;
    expect(container).toHaveClass("items-center");
    expect(container.className).toMatch(/(^|\s)min-h-/);
    expect(container).not.toHaveClass("h-64");
    expect(container).toHaveClass("px-4");
    expect(screen.getByTestId("watchlist-empty-guidance")).toHaveClass("text-center");
  });

  it("shows the total count in the headline when no search is active", () => {
    renderWithContext({
      watchlist: [
        movie,
        { ...movie, id: 2, title: "Untitled Project", release_date: "" },
        { ...movie, id: 3, title: "Third Film", release_date: "" },
      ],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "🎬 My Watchlist (3)" }),
    ).toBeInTheDocument();
  });

  it("shows the number of matching films in the headline while searching", async () => {
    renderWithContext({
      watchlist: [movie, { ...movie, id: 2, title: "Untitled Project", release_date: "" }],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(searchInput, "incep");
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent(/in Watchlist \(1\)$/);

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "zzz");
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent(/in Watchlist \(0\)$/);
  });

  it("AC-4: renders saved movies with active remove toggles", async () => {
    const dispatch = vi.fn();

    renderWithContext({
      watchlist: [movie],
      dispatch,
      isInWatchlist: () => true,
    });

    expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    const removeToggle = screen.getByRole("button", {
      name: "Remove Inception from watchlist",
    });
    expect(removeToggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(removeToggle);
    expect(dispatch).toHaveBeenCalledWith({ type: "REMOVE_MOVIE", payload: movie.id });

    await userEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR" });
  });

  it("shows the release year for dated movies and the bare title for undated ones", () => {
    const year = movie.release_date.slice(0, 4);
    renderWithContext({
      watchlist: [movie, { ...movie, id: 2, title: "Untitled Project", release_date: "" }],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0].textContent).toBe("Untitled Project");
    expect(headings[1].textContent).toBe(`Inception (${year})`);
    expect(screen.getByRole("img", { name: "Inception" })).toBeInTheDocument();
  });

  it("shows the no-match message with the typed query and a 'Clear search' button", async () => {
    renderWithContext({
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "zzz");

    expect(screen.getByText('No movies match "zzz"')).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent('No movies match "zzz"');
    expect(screen.queryByText(/No movies matching/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear Search" })).not.toBeInTheDocument();
  });

  it("clears the search and shows the full watchlist again", async () => {
    renderWithContext({
      watchlist: [movie, { ...movie, id: 2, title: "Untitled Project", release_date: "" }],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(searchInput, "zzz");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(searchInput).toHaveValue("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    expect(screen.getByText("Untitled Project")).toBeInTheDocument();
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
  });

  it("focuses the search input after 'Clear search' empties it", async () => {
    renderWithContext({
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    await userEvent.type(searchInput, "zzz");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(searchInput).toHaveValue("");
    expect(searchInput).toHaveFocus();

    await userEvent.keyboard("inc");
    expect(searchInput).toHaveValue("inc");
  });

  it("does not focus the search input on first render or after 'Clear All'", async () => {
    const dispatch = vi.fn();
    renderWithContext({
      watchlist: [movie],
      dispatch,
      isInWatchlist: () => true,
    });

    const searchInput = screen.getByPlaceholderText("Search movies...");
    expect(searchInput).not.toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR" });
    expect(searchInput).not.toHaveFocus();
  });

  it("hides the no-match message and 'Clear search' when the query matches or the watchlist is empty", async () => {
    const { unmount } = renderWithContext({
      watchlist: [movie],
      dispatch: vi.fn(),
      isInWatchlist: () => true,
    });

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "incep");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    unmount();

    renderWithContext({
      watchlist: [],
      dispatch: vi.fn(),
      isInWatchlist: () => false,
    });

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "zzz");

    expect(screen.getByText("No movies in your watchlist yet")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  it("renders the sort dropdown with Recently added selected by default", () => {
    renderWithContext({ watchlist: movies, dispatch: vi.fn(), isInWatchlist: () => true });

    const sort = screen.getByRole("combobox", { name: "Sort watchlist" });
    expect(sort).toHaveValue("recently-added");
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "Recently added",
      "Title A to Z",
      "Rating highest first",
    ]);
  });

  it("sorts movies by recently added order without changing persisted movie records", () => {
    const persistedMovies = [...movies];
    localStorage.setItem("watchlist:1", JSON.stringify(persistedMovies));
    renderWithContext({ watchlist: movies, dispatch: vi.fn(), isInWatchlist: () => true });

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Charlie (2010)",
      "Alpha (2010)",
      "Bravo (2010)",
    ]);
    expect(JSON.parse(localStorage.getItem("watchlist:1")!)).toEqual(persistedMovies);
  });

  it("sorts movies by title A to Z with recently added tie-breakers", async () => {
    const tiedTitleMovies = [
      { ...movies[0], title: "Same" },
      { ...movies[1], title: "Alpha" },
      { ...movies[2], title: "Same" },
    ];
    renderWithContext({ watchlist: tiedTitleMovies, dispatch: vi.fn(), isInWatchlist: () => true });

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort watchlist" }), "title");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Alpha (2010)",
      "Same (2010)",
      "Same (2010)",
    ]);
  });

  it("sorts movies by rating highest first with recently added tie-breakers", async () => {
    const tiedRatingMovies = [
      { ...movies[0], vote_average: 8.1 },
      { ...movies[1], vote_average: 9.2 },
      { ...movies[2], vote_average: 8.1 },
    ];
    renderWithContext({ watchlist: tiedRatingMovies, dispatch: vi.fn(), isInWatchlist: () => true });

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort watchlist" }), "rating");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Alpha (2010)",
      "Charlie (2010)",
      "Bravo (2010)",
    ]);
  });

  it("persists the selected sort and restores it after reload", async () => {
    const view = renderWithContext({ watchlist: movies, dispatch: vi.fn(), isInWatchlist: () => true });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort watchlist" }), "rating");

    expect(localStorage.getItem("watchlist-sort")).toBe("rating");
    view.unmount();
    renderWithContext({ watchlist: movies, dispatch: vi.fn(), isInWatchlist: () => true });

    expect(screen.getByRole("combobox", { name: "Sort watchlist" })).toHaveValue("rating");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Alpha (2010)",
      "Charlie (2010)",
      "Bravo (2010)",
    ]);
  });

  it("falls back to Recently added for missing or invalid stored sort values", () => {
    const view = renderWithContext({ watchlist: movies, dispatch: vi.fn(), isInWatchlist: () => true });

    expect(screen.getByRole("combobox", { name: "Sort watchlist" })).toHaveValue("recently-added");
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Charlie (2010)",
      "Alpha (2010)",
      "Bravo (2010)",
    ]);

    view.unmount();
    localStorage.setItem("watchlist-sort", "not-a-sort");
    renderWithContext({ watchlist: movies, dispatch: vi.fn(), isInWatchlist: () => true });

    expect(screen.getByRole("combobox", { name: "Sort watchlist" })).toHaveValue("recently-added");
  });

  it("hides the sort dropdown for an empty watchlist", () => {
    renderWithContext({ watchlist: [], dispatch: vi.fn(), isInWatchlist: () => false });

    expect(screen.queryByRole("combobox", { name: "Sort watchlist" })).not.toBeInTheDocument();
    expect(screen.getByText("No movies in your watchlist yet")).toBeInTheDocument();
  });

});
