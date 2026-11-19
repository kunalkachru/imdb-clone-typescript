import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetail from "../../pages/MovieDetail";

const mockUseFetch = vi.fn();
const mockDispatch = vi.fn();
const mockIsInWatchlist = vi.fn();
const mockAuthUser = { id: 1, name: "John", email: "john@example.com", createdAt: "now" };

vi.mock("../../hooks/useFetch", () => ({
  default: (...args: unknown[]) => mockUseFetch(...args),
}));

vi.mock("../../hooks/useWatchlist", () => ({
  useWatchlist: () => ({
    dispatch: mockDispatch,
    isInWatchlist: mockIsInWatchlist,
  }),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: mockAuthUser,
  }),
}));

describe("MovieDetail page", () => {
  const renderMovieWithRating = () => {
    mockIsInWatchlist.mockReturnValue(false);
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2010-01-01",
        vote_average: 8.4,
        vote_count: 12345,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("renders the rating with a thousands-separated vote count", () => {
    renderMovieWithRating();

    expect(screen.getByText("⭐ 8.4 (12,345 votes)")).toBeInTheDocument();
  });

  it("AC-1: renders the rating with a thousands-separated vote count", () => {
    renderMovieWithRating();

    expect(screen.getByText("⭐ 8.4 (12,345 votes)")).toBeInTheDocument();
  });

  it("shows invalid id message for malformed route params", () => {
    mockUseFetch.mockReturnValue({ data: null, loading: false, error: null });

    render(
      <MemoryRouter initialEntries={["/movie/not-a-number"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Invalid movie id")).toBeInTheDocument();
  });

  it("AC-2: renders Add to Watchlist and dispatches add for an unsaved movie", async () => {
    mockIsInWatchlist.mockReturnValue(false);
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2010-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    expect(screen.getByText("Audience Snapshot")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Add to Watchlist" }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_MOVIE",
      payload: expect.objectContaining({ id: 1 }),
    });
  });

  it("renders the movie title with its release year", () => {
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2010-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Inception (2010)",
    );
  });

  it("renders only the movie title when release date is missing", () => {
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Inception");
    expect(heading).not.toHaveTextContent(/[()]/);
  });

  it("AC-2: renders Remove from Watchlist and dispatches remove for a saved movie", async () => {
    mockIsInWatchlist.mockReturnValue(true);
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2010-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Remove from Watchlist" }),
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "REMOVE_MOVIE",
      payload: 1,
    });
  });

  it("submits survey feedback and shows minimized summary", async () => {
    mockIsInWatchlist.mockReturnValue(false);
    mockUseFetch.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        overview: "Overview",
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        release_date: "2010-01-01",
        vote_average: 8.4,
        vote_count: 100,
        genre_ids: [1],
        genres: [{ id: 1, name: "Action" }],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open Survey" }));

    await userEvent.clear(
      screen.getByPlaceholderText(
        "Highlight the strongest parts of the movie experience.",
      ),
    );
    await userEvent.type(
      screen.getByPlaceholderText(
        "Highlight the strongest parts of the movie experience.",
      ),
      "The visuals and layered story were outstanding.",
    );
    await userEvent.clear(
      screen.getByPlaceholderText(
        "Call out moments that felt weak, confusing, or disappointing.",
      ),
    );
    await userEvent.type(
      screen.getByPlaceholderText(
        "Call out moments that felt weak, confusing, or disappointing.",
      ),
      "Some exposition felt dense in the opening act.",
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit Feedback" }));

    expect(
      await screen.findByText("Feedback Submitted"),
    ).toBeInTheDocument();
    expect(screen.getByText("Overall 8/10")).toBeInTheDocument();
    expect(screen.getAllByText("Would recommend").length).toBeGreaterThan(0);
    expect(screen.getByText("Community feedback highlights")).toBeInTheDocument();
  });
});
