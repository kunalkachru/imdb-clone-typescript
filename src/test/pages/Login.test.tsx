import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../../pages/Login";
import { AuthProvider } from "../../context/AuthContext";

const loginUserMock = vi.fn();
const registerUserMock = vi.fn();

vi.mock("../../services/auth", () => ({
  loginUser: (...args: unknown[]) => loginUserMock(...args),
  registerUser: (...args: unknown[]) => registerUserMock(...args),
}));

const renderLoginFlow = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("navigates to home only on successful login", async () => {
    loginUserMock.mockResolvedValueOnce({
      user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
      token: "token",
    });

    renderLoginFlow();

    await userEvent.type(
      screen.getByPlaceholderText("john@example.com"),
      "john@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() =>
      expect(screen.getByText("Home page")).toBeInTheDocument(),
    );
  });

  it("stays on login and shows error when auth fails", async () => {
    loginUserMock.mockRejectedValueOnce(new Error("Invalid email or password"));

    renderLoginFlow();

    await userEvent.type(
      screen.getByPlaceholderText("john@example.com"),
      "john@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Home page")).not.toBeInTheDocument();
  });
});
