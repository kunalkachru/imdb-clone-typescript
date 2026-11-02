import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import PasswordInput from "../../components/PasswordInput";

const Controlled = ({ onChange }: { onChange: () => void }) => {
  const [value, setValue] = useState("");
  return (
    <PasswordInput
      name="password"
      value={value}
      placeholder="••••••••"
      required
      onChange={(e) => {
        setValue(e.target.value);
        onChange();
      }}
    />
  );
};

describe("PasswordInput", () => {
  it("defaults to a hidden password with a Show password toggle", () => {
    render(<Controlled onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText("••••••••");
    expect(input).toHaveAttribute("type", "password");

    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles between text and password on each click", async () => {
    render(<Controlled onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText("••••••••");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    expect(input, "after first click").toHaveAttribute("type", "text");
    const shown = screen.getByRole("button", { name: "Hide password" });
    expect(shown).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(shown);

    expect(input, "after second click").toHaveAttribute("type", "password");
    const hidden = screen.getByRole("button", { name: "Show password" });
    expect(hidden).toHaveAttribute("aria-pressed", "false");
  });

  it("passes name, value, placeholder and required through and calls onChange", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByPlaceholderText("••••••••");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toBeRequired();

    await userEvent.type(input, "secret1");

    expect(input).toHaveValue("secret1");
    expect(onChange).toHaveBeenCalledTimes(7);
  });

  it("keeps the typed value when the toggle is clicked", async () => {
    render(<Controlled onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText("••••••••");
    await userEvent.type(input, "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    expect(input).toHaveValue("secret1");
  });

  it("renders an aria-hidden inline svg icon and does not submit the form", async () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) =>
      e.preventDefault(),
    );
    render(
      <form onSubmit={onSubmit}>
        <Controlled onChange={vi.fn()} />
      </form>,
    );

    const button = screen.getByRole("button", { name: "Show password" });
    const svg = button.querySelector("svg");
    expect(svg, "toggle should contain an inline svg").not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");

    await userEvent.click(button);

    expect(onSubmit, "clicking the toggle must not submit the form").not.toHaveBeenCalled();
  });
});
