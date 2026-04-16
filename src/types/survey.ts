export const surveySentimentOptions = [
  "loved_it",
  "liked_it",
  "neutral",
  "disliked_it",
  "hated_it",
] as const;

export const surveyWatchContextOptions = [
  "alone",
  "family",
  "friends",
  "partner",
  "other",
] as const;

export const surveyDiscoverySourceOptions = [
  "search",
  "homepage",
  "recommendation",
  "social",
  "other",
] as const;

export type SurveySentiment = (typeof surveySentimentOptions)[number];
export type SurveyWatchContext = (typeof surveyWatchContextOptions)[number];
export type SurveyDiscoverySource =
  (typeof surveyDiscoverySourceOptions)[number];

export interface MovieSurveyResponse {
  movieId: number;
  userId: number | null;
  submittedAt: string;
  overallRating: number;
  storyRating: number;
  actingRating: number;
  visualsRating: number;
  musicRating: number;
  pacingRating: number;
  wouldRecommend: boolean;
  watchContext: SurveyWatchContext;
  discoverySource: SurveyDiscoverySource;
  sentimentTag: SurveySentiment;
  whatWorkedWell: string;
  whatCouldBeBetter: string;
}

export interface AudienceSurveyEntry extends MovieSurveyResponse {
  reviewerName: string;
}

export interface AudienceSnapshotMetrics {
  responses: number;
  averageOverallRating: number;
  recommendRate: number;
  averageStoryRating: number;
  averageActingRating: number;
  averageVisualsRating: number;
  averageMusicRating: number;
  averagePacingRating: number;
  topSentiment: SurveySentiment;
}

export interface MovieSurveyFormData {
  overallRating: number;
  storyRating: number;
  actingRating: number;
  visualsRating: number;
  musicRating: number;
  pacingRating: number;
  wouldRecommend: boolean;
  watchContext: SurveyWatchContext;
  discoverySource: SurveyDiscoverySource;
  sentimentTag: SurveySentiment;
  whatWorkedWell: string;
  whatCouldBeBetter: string;
}

export interface MovieSurveyValidationErrors {
  overallRating?: string;
  storyRating?: string;
  actingRating?: string;
  visualsRating?: string;
  musicRating?: string;
  pacingRating?: string;
  whatWorkedWell?: string;
  whatCouldBeBetter?: string;
}

export const defaultSurveyFormData: MovieSurveyFormData = {
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
  whatWorkedWell: "",
  whatCouldBeBetter: "",
};
