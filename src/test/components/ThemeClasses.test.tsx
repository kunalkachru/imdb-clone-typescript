import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PasswordInput from "../../components/PasswordInput";
import SearchBar from "../../components/SearchBar";
import AudienceSurveySnapshot from "../../components/survey/AudienceSurveySnapshot";
import MovieSurveyForm from "../../components/survey/MovieSurveyForm";
import MovieSurveySummary from "../../components/survey/MovieSurveySummary";
import SurveyRatingField from "../../components/survey/SurveyRatingField";
import type {
  AudienceSnapshotMetrics,
  AudienceSurveyEntry,
  MovieSurveyResponse,
} from "../../types/survey";

// Collect every class token rendered under the root element.
const classTokens = (root: Element): string[] =>
  [...root.querySelectorAll("[class]")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );

// Assert the root has a light colour class and a dark: variant for each of
// background, text and border.
type ColourKind = "bg" | "text" | "border";

const expectLightAndDarkPairs = (
  root: Element,
  kinds: ColourKind[] = ["bg", "text", "border"],
) => {
  const tokens = classTokens(root);
  const lightColour = /^(bg|text|border)-(white|gray|yellow|red)/;
  const darkColour = /^dark:(bg|text|border)-/;

  const lightTokens = tokens.filter((t) => lightColour.test(t));
  const darkTokens = tokens.filter((t) => darkColour.test(t));

  for (const kind of kinds) {
    expect(lightTokens.some((t) => t.startsWith(`${kind}-`))).toBe(true);
    expect(darkTokens.some((t) => t.startsWith(`dark:${kind}-`))).toBe(true);
  }
};

const survey: MovieSurveyResponse = {
  movieId: 550,
  userId: 1,
  submittedAt: new Date().toISOString(),
  overallRating: 8,
  storyRating: 4,
  actingRating: 4,
  visualsRating: 4,
  musicRating: 4,
  pacingRating: 4,
  wouldRecommend: true,
  watchContext: "alone",
  discoverySource: "homepage",
  sentimentTag: "liked_it",
  whatWorkedWell: "Strong script",
  whatCouldBeBetter: "Slow middle",
};

const metrics: AudienceSnapshotMetrics = {
  responses: 3,
  averageOverallRating: 7.5,
  recommendRate: 80,
  averageStoryRating: 4,
  averageActingRating: 4,
  averageVisualsRating: 4,
  averageMusicRating: 4,
  averagePacingRating: 3,
  topSentiment: "liked_it",
};

const comments: AudienceSurveyEntry[] = [
  { ...survey, reviewerName: "Alex" },
];

describe("theme classes on shared components", () => {
  it("PasswordInput and SearchBar carry light and dark colour pairs", () => {
    const { container: passwordRoot } = render(
      <PasswordInput placeholder="pw" />,
    );
    expectLightAndDarkPairs(passwordRoot);

    const input = screen.getByPlaceholderText("pw");
    const inputClasses = input.getAttribute("class") ?? "";
    expect(inputClasses).toContain("bg-white");
    expect(inputClasses).toContain("dark:bg-gray-700");
    expect(inputClasses).toContain("text-gray-900");
    expect(inputClasses).toContain("dark:text-white");
    expect(inputClasses).toContain("border-gray-300");
    expect(inputClasses).toContain("dark:border-transparent");

    const { container: searchRoot } = render(
      <SearchBar value="" onChange={vi.fn()} onSearch={vi.fn()} />,
    );
    expectLightAndDarkPairs(searchRoot);
    const searchClasses =
      searchRoot.querySelector("input")?.getAttribute("class") ?? "";
    expect(searchClasses).toContain("bg-white");
    expect(searchClasses).toContain("dark:bg-gray-700");
    expect(searchClasses).toContain("text-gray-900");
    expect(searchClasses).toContain("dark:text-white");
  });

  it("AudienceSurveySnapshot carries light and dark colour pairs", () => {
    const { container } = render(
      <AudienceSurveySnapshot metrics={metrics} comments={comments} />,
    );
    expectLightAndDarkPairs(container);
  });

  it("MovieSurveyForm carries light and dark colour pairs", () => {
    const { container } = render(
      <MovieSurveyForm
        movieId={550}
        userId={1}
        existingSurvey={null}
        onSubmitted={vi.fn()}
      />,
    );
    expectLightAndDarkPairs(container);
  });

  it("MovieSurveySummary carries light and dark colour pairs", () => {
    const { container } = render(
      <MovieSurveySummary survey={survey} onEdit={vi.fn()} />,
    );
    expectLightAndDarkPairs(container);
  });

  it("SurveyRatingField carries light and dark colour pairs", () => {
    const { container } = render(
      <SurveyRatingField
        label="Story"
        min={1}
        max={5}
        value={4}
        onChange={vi.fn()}
        helper="1 = poor, 5 = great"
      />,
    );
    // The rating field draws surfaces and text only; it has no borders.
    expectLightAndDarkPairs(container, ["bg", "text"]);
  });
});
