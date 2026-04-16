import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContextDef";
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
});
