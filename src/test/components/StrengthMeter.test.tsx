import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StrengthMeter from "../../components/StrengthMeter";

const weakSample = "abc123";
const strongSample = "Tr0ub4dor&3xq!Zed-Maple";

describe("StrengthMeter", () => {
  it("renders nothing when the value is empty", () => {
    render(<StrengthMeter value="" />);
    expect(screen.queryByTestId("strength-meter")).toBeNull();
  });

  it("shows a label, and weak and strong samples get different labels", () => {
    const { unmount } = render(<StrengthMeter value={weakSample} />);
    const weakLabel = screen.getByTestId("strength-meter").textContent;
    unmount();

    render(<StrengthMeter value={strongSample} />);
    const strongLabel = screen.getByTestId("strength-meter").textContent;

    expect(weakLabel).toBeTruthy();
    expect(strongLabel).toBeTruthy();
    expect(weakLabel).not.toBe(strongLabel);
  });

  it("exposes the label through aria-valuetext", () => {
    render(<StrengthMeter value={strongSample} />);
    const meter = screen.getByTestId("strength-meter");
    const label = meter.textContent ?? "";
    expect(label).not.toBe("");
    expect(meter.getAttribute("aria-valuetext") ?? "").toContain(label);
  });
});
