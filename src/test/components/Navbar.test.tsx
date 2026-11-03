import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContextDef";
import { ThemeProvider } from "../../context/ThemeContext";
import type { AuthContextType } from "../../types/auth";

const baseAuthValue: AuthContextType = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  login: async () => false,
  register: async () => false,
  logout: vi.fn(),
};

describe("Navbar", () => {
  it("shows login link for guests", () => {
    render(
      <AuthContext.Provider value={baseAuthValue}>
        <MemoryRouter>
          <Navbar searchQuery="" onSearchChange={vi.fn()} onSearch={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("shows user and logout for authenticated users", async () => {
    const logout = vi.fn();

    render(
      <AuthContext.Provider
        value={{
          ...baseAuthValue,
          user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
          token: "token",
          status: "success",
          logout,
        }}
      >
        <MemoryRouter>
          <Navbar searchQuery="" onSearchChange={vi.fn()} onSearch={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("👤 John")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("toggles the theme class on the root element and saves the choice", async () => {
    localStorage.clear();

    render(
      <AuthContext.Provider value={baseAuthValue}>
        <ThemeProvider>
          <MemoryRouter>
            <Navbar searchQuery="" onSearchChange={vi.fn()} onSearch={vi.fn()} />
          </MemoryRouter>
        </ThemeProvider>
      </AuthContext.Provider>,
    );

    const toggle = screen.getByTestId("theme-toggle");
    expect(toggle).toHaveAttribute("aria-label", "Switch to light theme");
    expect(document.documentElement).toHaveClass("dark");

    await userEvent.click(toggle);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(toggle).toHaveAttribute("aria-label", "Switch to dark theme");

    await userEvent.click(toggle);
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
