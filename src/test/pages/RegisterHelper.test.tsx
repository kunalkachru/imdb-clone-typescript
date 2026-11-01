import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Register from "../../pages/Register";
import { AuthProvider } from "../../context/AuthContext";

vi.mock("../../services/auth", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

const renderRegister = () =>
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );

describe("Register helper text", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the helper paragraph with the chosen wording", () => {
    renderRegister();

    expect(screen.getByTestId("register-helper-text")).toHaveTextContent(
      "Demo only: sign-in uses local mock accounts in your browser, and your watchlist is available after you sign in.",
    );
  });

  it("places the helper paragraph after the form element", () => {
    renderRegister();

    const form = document.querySelector("form");
    expect(form, "Register page should render a <form>").not.toBeNull();
    const helper = screen.getByTestId("register-helper-text");
    expect(
      form!.compareDocumentPosition(helper) & Node.DOCUMENT_POSITION_FOLLOWING,
      "helper text should follow the form in the DOM",
    ).toBeTruthy();
  });

  it("keeps the labels and an enabled Create Account button", () => {
    renderRegister();

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
      "Create Account button should be present and enabled",
    ).toBeEnabled();
  });
});
