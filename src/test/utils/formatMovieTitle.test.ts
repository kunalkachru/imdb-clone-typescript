import { describe, expect, it } from "vitest";
import { formatMovieTitle } from "../../utils/formatMovieTitle";

describe("formatMovieTitle", () => {
  it("appends the four-digit year to a dated movie", () => {
    expect(formatMovieTitle("Inception", "2010-01-01")).toBe("Inception (2010)");
  });

  it("returns the bare title when the release date is empty, missing or null", () => {
    expect(formatMovieTitle("Inception", "")).toBe("Inception");
    expect(formatMovieTitle("Inception", undefined)).toBe("Inception");
    expect(formatMovieTitle("Inception", null)).toBe("Inception");
  });

  it("returns the bare title when the release date does not start with four digits", () => {
    expect(formatMovieTitle("Inception", "unknown")).toBe("Inception");
    expect(formatMovieTitle("Inception", "201")).toBe("Inception");
  });
});
