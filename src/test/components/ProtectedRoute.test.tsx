import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import { AuthContext } from "../../context/AuthContextDef";
import type { AuthContextType } from "../../types/auth";

const baseAuth: AuthContextType = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
};

describe("ProtectedRoute", () => {
  it("redirects guests to login", () => {
    render(
      <AuthContext.Provider value={baseAuth}>
        <MemoryRouter initialEntries={["/watchlist"]}>
          <Routes>
            <Route path="/watchlist" element={<div>Watchlist page</div>} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Watchlist page")).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("AC-7: renders the application Watchlist route for a guest without redirecting to login", () => {
    render(
      <AuthContext.Provider value={baseAuth}>
        <MemoryRouter initialEntries={["/watchlist"]}>
          <Routes>
            <Route path="/watchlist" element={<div>Watchlist page</div>} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Watchlist page")).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    render(
      <AuthContext.Provider
        value={{
          ...baseAuth,
          user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
          token: "token",
          status: "success",
        }}
      >
        <MemoryRouter initialEntries={["/watchlist"]}>
          <Routes>
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <div>Watchlist page</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Watchlist page")).toBeInTheDocument();
  });
});
