import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Footer from "../../components/Footer";

describe("Footer", () => {
  it("AC-1: renders the current-year IMDb Clone copyright", () => {
    render(<Footer />);

    expect(
      screen.getByText(`© ${new Date().getFullYear()} IMDb Clone`),
    ).toBeVisible();
  });

  it("AC-3: links back to the top of the application shell", async () => {
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
});
