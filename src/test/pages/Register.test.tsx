import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Register from "../../pages/Register";
import { AuthProvider } from "../../context/AuthContext";

const loginUserMock = vi.fn();
const registerUserMock = vi.fn();

vi.mock("../../services/auth", () => ({
  loginUser: (...args: unknown[]) => loginUserMock(...args),
  registerUser: (...args: unknown[]) => registerUserMock(...args),
}));

const renderRegisterFlow = () =>
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );

describe("Register page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("navigates home on successful registration", async () => {
    registerUserMock.mockResolvedValueOnce({
      user: { id: 3, name: "John", email: "john@example.com", createdAt: "now" },
      token: "token",
    });

    renderRegisterFlow();

    await userEvent.type(screen.getByPlaceholderText("John Doe"), "John");
    await userEvent.type(
      screen.getByPlaceholderText("john@example.com"),
      "john@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => expect(screen.getByText("Home page")).toBeInTheDocument());
  });

  it("shows error and does not navigate on failed registration", async () => {
    registerUserMock.mockRejectedValueOnce(new Error("Email already registered"));

    renderRegisterFlow();

    await userEvent.type(screen.getByPlaceholderText("John Doe"), "John");
    await userEvent.type(
      screen.getByPlaceholderText("john@example.com"),
      "john@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() =>
      expect(screen.getByText("Email already registered")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Home page")).not.toBeInTheDocument();
  });
});
