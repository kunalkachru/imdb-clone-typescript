import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Register from "../../pages/Register";
import { AuthProvider } from "../../context/AuthContext";

const loginUserMock = vi.fn();
const registerUserMock = vi.fn();

const weakSample = "abc123";
const strongSample = "Tr0ub4dor&3xq!Zed-Maple";

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

  it("masks the password by default and toggles visibility without submitting", async () => {
    renderRegisterFlow();

    const password = screen.getByPlaceholderText("••••••••");
    expect(password, "password input should default to type=password").toHaveAttribute(
      "type",
      "password",
    );

    await userEvent.type(password, "secret99");
    expect(password).toHaveValue("secret99");

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password, "clicking eye should reveal the password").toHaveAttribute(
      "type",
      "text",
    );

    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password, "clicking again should hide the password").toHaveAttribute(
      "type",
      "password",
    );
    expect(registerUserMock, "toggle must not submit the form").not.toHaveBeenCalled();
  });

  it("hides the strength meter on the empty form and keeps the eye and submit enabled", () => {
    renderRegisterFlow();

    expect(
      screen.queryByTestId("strength-meter"),
      "strength meter should be absent while the password is empty",
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Show password" }),
      "Show password toggle should be present",
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
      "Create Account should stay enabled on the empty form",
    ).toBeEnabled();
  });

  it("shows a labelled strength meter once a password is typed", async () => {
    renderRegisterFlow();

    await userEvent.type(screen.getByPlaceholderText("••••••••"), weakSample);
    const weakLabel = screen.getByTestId("strength-meter").textContent;
    expect(weakLabel, "meter should carry a label").toBeTruthy();

    await userEvent.clear(screen.getByPlaceholderText("••••••••"));
    await userEvent.type(screen.getByPlaceholderText("••••••••"), strongSample);
    const strongLabel = screen.getByTestId("strength-meter").textContent;
    expect(strongLabel, "meter should carry a label").toBeTruthy();
    expect(weakLabel).not.toBe(strongLabel);
  });

  it("blocks a weak password with an alert and registers a strong one", async () => {
    registerUserMock.mockResolvedValueOnce({
      user: { id: 4, name: "John", email: "john@example.com", createdAt: "now" },
      token: "token",
    });

    renderRegisterFlow();

    await userEvent.type(screen.getByPlaceholderText("John Doe"), "John");
    await userEvent.type(
      screen.getByPlaceholderText("john@example.com"),
      "john@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), weakSample);
    await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      registerUserMock,
      "weak password must not reach registerUser",
    ).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await userEvent.clear(screen.getByPlaceholderText("••••••••"));
    await userEvent.type(screen.getByPlaceholderText("••••••••"), strongSample);
    await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => expect(screen.getByText("Home page")).toBeInTheDocument());
    expect(registerUserMock).toHaveBeenCalledTimes(1);
  });

  it("keeps the helper text visible while an error is shown", async () => {
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
    expect(screen.getByTestId("register-helper-text")).toBeInTheDocument();
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
