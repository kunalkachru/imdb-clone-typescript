import { describe, expect, it } from "vitest";
import {
  buildAudienceSnapshotMetrics,
  getAudienceCommentHighlights,
  getSeededMovieSurveyEntries,
} from "../../services/surveyCommunity";

describe("survey community service", () => {
  it("returns seeded entries for a movie", () => {
    const entries = getSeededMovieSurveyEntries(27205);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]?.movieId).toBe(27205);
  });

  it("builds audience metrics using seeded data and current user response", () => {
    const metrics = buildAudienceSnapshotMetrics(27205, {
      movieId: 27205,
      userId: 1,
      submittedAt: new Date().toISOString(),
      overallRating: 10,
      storyRating: 5,
      actingRating: 5,
      visualsRating: 5,
      musicRating: 5,
      pacingRating: 5,
      wouldRecommend: true,
      watchContext: "alone",
      discoverySource: "search",
      sentimentTag: "loved_it",
      whatWorkedWell: "Incredible from start to finish and very rewatchable.",
      whatCouldBeBetter: "A tiny bit less exposition in the first quarter.",
    });

    expect(metrics.responses).toBeGreaterThan(1);
    expect(metrics.averageOverallRating).toBeGreaterThan(0);
    expect(metrics.recommendRate).toBeGreaterThan(0);
  });

  it("returns top comment highlights", () => {
    const comments = getAudienceCommentHighlights(27205, null);
    expect(comments.length).toBeGreaterThan(0);
    expect(comments.length).toBeLessThanOrEqual(3);
  });
});
