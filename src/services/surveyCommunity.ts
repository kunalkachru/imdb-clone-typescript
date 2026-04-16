import type {
  AudienceSnapshotMetrics,
  AudienceSurveyEntry,
  MovieSurveyResponse,
  SurveySentiment,
} from "../types/survey";

const seededMovieSurveyEntries: AudienceSurveyEntry[] = [
  {
    reviewerName: "Ava",
    movieId: 27205,
    userId: null,
    submittedAt: "2026-04-10T10:05:00.000Z",
    overallRating: 9,
    storyRating: 5,
    actingRating: 4,
    visualsRating: 5,
    musicRating: 5,
    pacingRating: 4,
    wouldRecommend: true,
    watchContext: "friends",
    discoverySource: "recommendation",
    sentimentTag: "loved_it",
    whatWorkedWell: "The layered narrative and performances stayed compelling throughout.",
    whatCouldBeBetter: "A few dream-level transitions were hard to follow initially.",
  },
  {
    reviewerName: "Rohan",
    movieId: 27205,
    userId: null,
    submittedAt: "2026-04-11T14:45:00.000Z",
    overallRating: 8,
    storyRating: 4,
    actingRating: 4,
    visualsRating: 5,
    musicRating: 4,
    pacingRating: 4,
    wouldRecommend: true,
    watchContext: "partner",
    discoverySource: "search",
    sentimentTag: "liked_it",
    whatWorkedWell: "Visually stunning and emotionally grounded lead character arc.",
    whatCouldBeBetter: "Could trim some exposition to keep momentum in the middle section.",
  },
  {
    reviewerName: "Maya",
    movieId: 27205,
    userId: null,
    submittedAt: "2026-04-12T19:20:00.000Z",
    overallRating: 7,
    storyRating: 4,
    actingRating: 4,
    visualsRating: 4,
    musicRating: 4,
    pacingRating: 3,
    wouldRecommend: true,
    watchContext: "family",
    discoverySource: "social",
    sentimentTag: "liked_it",
    whatWorkedWell: "Great concept and strong cast chemistry kept us engaged.",
    whatCouldBeBetter: "Ending is good but some plot points still need a second watch.",
  },
  {
    reviewerName: "Leo",
    movieId: 278,
    userId: null,
    submittedAt: "2026-04-13T09:10:00.000Z",
    overallRating: 9,
    storyRating: 5,
    actingRating: 5,
    visualsRating: 4,
    musicRating: 4,
    pacingRating: 5,
    wouldRecommend: true,
    watchContext: "alone",
    discoverySource: "homepage",
    sentimentTag: "loved_it",
    whatWorkedWell: "Character arcs are intense and the emotional payoff is excellent.",
    whatCouldBeBetter: "A little heavy for casual viewing, but that is part of its charm.",
  },
];

const roundToOneDecimal = (value: number): number =>
  Math.round(value * 10) / 10;

const getTopSentiment = (items: MovieSurveyResponse[]): SurveySentiment => {
  const counts = new Map<SurveySentiment, number>();
  for (const item of items) {
    counts.set(item.sentimentTag, (counts.get(item.sentimentTag) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "neutral";
};

export const getSeededMovieSurveyEntries = (movieId: number): AudienceSurveyEntry[] =>
  seededMovieSurveyEntries
    .filter((entry) => entry.movieId === movieId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

export const buildAudienceSnapshotMetrics = (
  movieId: number,
  currentUserSurvey: MovieSurveyResponse | null,
): AudienceSnapshotMetrics => {
  const entries: MovieSurveyResponse[] = getSeededMovieSurveyEntries(movieId);
  if (currentUserSurvey) {
    entries.unshift(currentUserSurvey);
  }

  const count = entries.length;
  if (count === 0) {
    return {
      responses: 0,
      averageOverallRating: 0,
      recommendRate: 0,
      averageStoryRating: 0,
      averageActingRating: 0,
      averageVisualsRating: 0,
      averageMusicRating: 0,
      averagePacingRating: 0,
      topSentiment: "neutral",
    };
  }

  const sum = entries.reduce(
    (acc, entry) => ({
      overall: acc.overall + entry.overallRating,
      story: acc.story + entry.storyRating,
      acting: acc.acting + entry.actingRating,
      visuals: acc.visuals + entry.visualsRating,
      music: acc.music + entry.musicRating,
      pacing: acc.pacing + entry.pacingRating,
      recommend: acc.recommend + (entry.wouldRecommend ? 1 : 0),
    }),
    {
      overall: 0,
      story: 0,
      acting: 0,
      visuals: 0,
      music: 0,
      pacing: 0,
      recommend: 0,
    },
  );

  return {
    responses: count,
    averageOverallRating: roundToOneDecimal(sum.overall / count),
    recommendRate: roundToOneDecimal((sum.recommend / count) * 100),
    averageStoryRating: roundToOneDecimal(sum.story / count),
    averageActingRating: roundToOneDecimal(sum.acting / count),
    averageVisualsRating: roundToOneDecimal(sum.visuals / count),
    averageMusicRating: roundToOneDecimal(sum.music / count),
    averagePacingRating: roundToOneDecimal(sum.pacing / count),
    topSentiment: getTopSentiment(entries),
  };
};

export const getAudienceCommentHighlights = (
  movieId: number,
  currentUserSurvey: MovieSurveyResponse | null,
): AudienceSurveyEntry[] => {
  const seeded = getSeededMovieSurveyEntries(movieId);
  const withCurrent =
    currentUserSurvey === null
      ? seeded
      : [
          {
            ...currentUserSurvey,
            reviewerName: "You",
          },
          ...seeded,
        ];

  return withCurrent.slice(0, 3);
};
