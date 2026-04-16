import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useFetch from "../../hooks/useFetch";

describe("useFetch", () => {
  it("loads data successfully", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ value: 42 });
    const { result } = renderHook(() => useFetch(fetchFn));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ value: 42 });
    expect(result.current.error).toBeNull();
  });

  it("re-fetches when dependencies change", async () => {
    const fetchFn = vi.fn((value: string) => Promise.resolve({ value }));
    const { result, rerender } = renderHook(
      ({ query }) => useFetch(() => fetchFn(query), query),
      { initialProps: { query: "one" } },
    );

    await waitFor(() => expect(result.current.data).toEqual({ value: "one" }));

    rerender({ query: "two" });

    await waitFor(() => expect(result.current.data).toEqual({ value: "two" }));
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("captures errors", async () => {
    const { result } = renderHook(() =>
      useFetch(async () => {
        throw new Error("boom");
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("boom");
  });
});
