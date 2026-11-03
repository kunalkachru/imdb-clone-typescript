import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "../../context/ThemeContext";
import { useTheme } from "../../hooks/useTheme";

const Harness = () => {
  const { theme } = useTheme();
  return <div data-testid="theme">{theme}</div>;
};

const renderWithProvider = () =>
  render(
    <ThemeProvider>
      <Harness />
    </ThemeProvider>,
  );

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("starts in dark mode when nothing is stored", () => {
    renderWithProvider();

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("restores a stored light theme", () => {
    localStorage.setItem("theme", "light");

    renderWithProvider();

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("falls back to dark when the stored value is invalid", () => {
    localStorage.setItem("theme", "purple");

    renderWithProvider();

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });
});
