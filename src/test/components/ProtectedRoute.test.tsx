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

    expect(screen.getByText("Login page")).toBeInTheDocument();
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
