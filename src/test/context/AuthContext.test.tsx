import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { AuthStatus } from "../../types/auth";

const loginUserMock = vi.fn();
const registerUserMock = vi.fn();

vi.mock("../../services/auth", () => ({
  loginUser: (...args: unknown[]) => loginUserMock(...args),
  registerUser: (...args: unknown[]) => registerUserMock(...args),
}));

const Harness = () => {
  const { user, status, error, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="user">{user?.email ?? "none"}</div>
      <div data-testid="status">{status}</div>
      <div data-testid="error">{error ?? "none"}</div>
      <button
        onClick={() => login({ email: "john@example.com", password: "password123" })}
      >
        login
      </button>
      <button
        onClick={() =>
          register({
            name: "John",
            email: "john@example.com",
            password: "password123",
          })
        }
      >
        register
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("logs in and logs out successfully", async () => {
    loginUserMock.mockResolvedValueOnce({
      user: { id: 1, name: "John", email: "john@example.com", createdAt: "now" },
      token: "token",
    });

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByText("login"));

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent(AuthStatus.SUCCESS),
    );
    expect(screen.getByTestId("user")).toHaveTextContent("john@example.com");

    await userEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("returns error state for failed register", async () => {
    registerUserMock.mockRejectedValueOnce(new Error("Email already registered"));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByText("register"));

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent(AuthStatus.ERROR),
    );
    expect(screen.getByTestId("error")).toHaveTextContent("Email already registered");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });
});
