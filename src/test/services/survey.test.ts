import { describe, expect, it } from "vitest";
import {
  getMovieSurvey,
  submitMovieSurvey,
  validateSurveyForm,
} from "../../services/survey";
import { defaultSurveyFormData } from "../../types/survey";

describe("survey service", () => {
  it("validates required freeform feedback", () => {
    const errors = validateSurveyForm({
      ...defaultSurveyFormData,
      whatWorkedWell: "short",
      whatCouldBeBetter: "",
    });

    expect(errors.whatWorkedWell).toBeTruthy();
    expect(errors.whatCouldBeBetter).toBeTruthy();
  });

  it("persists and retrieves survey by movie and user", async () => {
    const payload = await submitMovieSurvey(27205, 1, {
      ...defaultSurveyFormData,
      whatWorkedWell: "The visuals and world-building were excellent.",
      whatCouldBeBetter: "The middle act could have moved faster.",
    });

    expect(payload.movieId).toBe(27205);

    const stored = getMovieSurvey(27205, 1);
    expect(stored?.whatWorkedWell).toBe(
      "The visuals and world-building were excellent.",
    );
  });

  it("isolates responses by user", async () => {
    await submitMovieSurvey(27205, 1, {
      ...defaultSurveyFormData,
      whatWorkedWell: "User one feedback is different and detailed.",
      whatCouldBeBetter: "User one pacing comment is also detailed.",
    });

    await submitMovieSurvey(27205, 2, {
      ...defaultSurveyFormData,
      overallRating: 6,
      wouldRecommend: false,
      whatWorkedWell: "User two still liked the core idea.",
      whatCouldBeBetter: "User two thought the ending was too abrupt.",
    });

    expect(getMovieSurvey(27205, 1)?.overallRating).toBe(8);
    expect(getMovieSurvey(27205, 2)?.overallRating).toBe(6);
  });
});
