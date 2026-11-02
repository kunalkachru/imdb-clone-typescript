import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PasswordInput from "../../components/PasswordInput";

describe("PasswordInput", () => {
  it("renders a masked input with passed-through props and a closed toggle", () => {
    render(
      <PasswordInput
        name="password"
        placeholder="••••••••"
        required
        defaultValue="secret"
      />,
    );

    const input = screen.getByPlaceholderText("••••••••");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toBeRequired();
    expect(input).toHaveValue("secret");

    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles between text and password without changing the value", async () => {
    render(<PasswordInput placeholder="pw" />);

    const input = screen.getByPlaceholderText("pw");
    await userEvent.type(input, "hunter2");
    expect(input).toHaveValue("hunter2");

    const button = screen.getByRole("button", { name: "Show password" });
    await userEvent.click(button);

    expect(input).toHaveAttribute("type", "text");
    const hideButton = screen.getByRole("button", { name: "Hide password" });
    expect(hideButton).toHaveAttribute("aria-pressed", "true");
    expect(input).toHaveValue("hunter2");

    await userEvent.click(hideButton);

    expect(input).toHaveAttribute("type", "password");
    const showAgain = screen.getByRole("button", { name: "Show password" });
    expect(showAgain).toHaveAttribute("aria-pressed", "false");
    expect(input).toHaveValue("hunter2");
  });

  it("does not submit the surrounding form and is keyboard-focusable", async () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) =>
      e.preventDefault(),
    );

    render(
      <form onSubmit={onSubmit}>
        <PasswordInput placeholder="pw" />
      </form>,
    );

    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("type", "button");

    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();

    // Tab from the input lands on the toggle button.
    screen.getByPlaceholderText("pw").focus();
    await userEvent.tab();
    expect(button).toHaveFocus();
  });

  it("keeps the svg icon hidden from assistive tech in both states", async () => {
    render(<PasswordInput placeholder="pw" />);

    const button = screen.getByRole("button", { name: "Show password" });
    const svg = button.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");

    await userEvent.click(button);

    const hideButton = screen.getByRole("button", { name: "Hide password" });
    const hideSvg = hideButton.querySelector("svg");
    expect(hideSvg).not.toBeNull();
    expect(hideSvg).toHaveAttribute("aria-hidden", "true");
  });
});
