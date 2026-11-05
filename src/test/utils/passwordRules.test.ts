import { describe, expect, it } from "vitest";
import { checkPasswordRules } from "../../utils/passwordRules";

describe("checkPasswordRules", () => {
  it.each([
    ["short7x", "too short"],
    ["abcdefgh", "no digit"],
    ["12345678", "no letter"],
    ["", "empty"],
  ])("rejects %s (%s)", (sample) => {
    const result = checkPasswordRules(sample);
    expect(result.ok, `failures: ${result.failures.join(", ")}`).toBe(false);
    expect(result.failures.length).toBeGreaterThan(0);
  });

  it.each(["Abcdefg1", "Qwerty2024Zz"])("accepts %s", (sample) => {
    const result = checkPasswordRules(sample);
    expect(result.ok, `failures: ${result.failures.join(", ")}`).toBe(true);
    expect(result.failures).toEqual([]);
  });
});
