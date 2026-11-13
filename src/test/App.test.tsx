import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import { WatchlistProvider } from "../context/WatchlistContext";

vi.mock("../hooks/useFetch", () => ({
  default: () => ({ data: null, loading: false, error: null }),
}));

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

describe("application route shell", () => {
  it("renders exactly one visible shared footer with the TMDB attribution", () => {
    renderApp();

    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    expect(screen.getByText("Movie data from TMDB")).toBeVisible();
  });

  it("keeps exactly one footer after navigating between routes", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("link", { name: "Login" }));

    expect(screen.getByRole("heading", { name: "🎬 IMDBClone" })).toBeVisible();
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    expect(screen.getByText("Movie data from TMDB")).toBeVisible();
  });
});
