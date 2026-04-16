import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchBar from "../../components/SearchBar";

describe("SearchBar", () => {
  it("calls onChange and onSearch", async () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();

    render(<SearchBar value="" onChange={onChange} onSearch={onSearch} />);

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "inception");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onChange).toHaveBeenCalled();
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("triggers search on Enter key", async () => {
    const onSearch = vi.fn();

    render(<SearchBar value="test" onChange={vi.fn()} onSearch={onSearch} />);

    await userEvent.type(screen.getByPlaceholderText("Search movies..."), "{enter}");
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
