import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Footer from "../../components/Footer";

describe("Footer", () => {
  it("AC-1: generates the copyright year at render time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00.000Z"));

    const { rerender } = render(<Footer />);
    expect(screen.getByText("© 2025 IMDb Clone")).toBeVisible();

    vi.setSystemTime(new Date("2026-01-01T12:00:00.000Z"));
    rerender(<Footer />);
    expect(screen.getByText("© 2026 IMDb Clone")).toBeVisible();

    vi.useRealTimers();
  });

  it("renders the exact copyright text beside the attribution and link", () => {
    render(<Footer />);

    const copyright = screen.getByText(`© ${new Date().getFullYear()} IMDb Clone`);
    const attribution = screen.getByText("Movie data from TMDB");
    const link = screen.getByRole("link", { name: "Back to top" });

    expect(copyright).toBeVisible();
    expect(attribution).toBeVisible();
    expect(link).toBeVisible();
    expect(attribution.nextElementSibling).toBe(link);
  });

  it("AC-3: links back to and activates the top of the application shell", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    const top = document.createElement("div");
    top.id = "app-shell-top";
    top.scrollIntoView = scrollIntoView;
    document.body.append(top);

    render(<Footer />);
    const link = screen.getByRole("link", { name: "Back to top" });

    expect(link).toHaveAttribute("href", "#app-shell-top");
    await user.click(link);
    expect(window.location.hash).toBe("#app-shell-top");

    top.remove();
  });

  it("keeps the current route when activated inside HashRouter", async () => {
    window.location.hash = "#/movie/1";
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    const top = document.createElement("div");
    top.id = "app-shell-top";
    top.scrollIntoView = scrollIntoView;
    document.body.append(top);

    render(
      <HashRouter>
        <Footer />
      </HashRouter>,
    );

    await user.click(screen.getByRole("link", { name: "Back to top" }));

    expect(window.location.hash).toBe("#/movie/1");
    expect(scrollIntoView).toHaveBeenCalledOnce();

    top.remove();
  });
});
