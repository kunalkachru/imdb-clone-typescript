import type {
  MovieSurveyFormData,
  MovieSurveyResponse,
  MovieSurveyValidationErrors,
} from "../types/survey";

const buildSurveyStorageKey = (movieId: number, userId: number | null): string =>
  `survey:${userId ?? "guest"}:movie:${movieId}`;

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const validateScaleValue = (
  value: number,
  min: number,
  max: number,
  fieldName: string,
): string | undefined => {
  if (!Number.isFinite(value) || value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}.`;
  }
  return undefined;
};

export const validateSurveyForm = (
  values: MovieSurveyFormData,
): MovieSurveyValidationErrors => {
  const errors: MovieSurveyValidationErrors = {};

  errors.overallRating = validateScaleValue(
    values.overallRating,
    1,
    10,
    "Overall rating",
  );
  errors.storyRating = validateScaleValue(values.storyRating, 1, 5, "Story rating");
  errors.actingRating = validateScaleValue(
    values.actingRating,
    1,
    5,
    "Acting rating",
  );
  errors.visualsRating = validateScaleValue(
    values.visualsRating,
    1,
    5,
    "Visuals rating",
  );
  errors.musicRating = validateScaleValue(values.musicRating, 1, 5, "Music rating");
  errors.pacingRating = validateScaleValue(
    values.pacingRating,
    1,
    5,
    "Pacing rating",
  );

  if (!values.whatWorkedWell.trim()) {
    errors.whatWorkedWell = "Tell us what worked well.";
  } else if (values.whatWorkedWell.trim().length < 10) {
    errors.whatWorkedWell = "Please add at least 10 characters.";
  }

  if (!values.whatCouldBeBetter.trim()) {
    errors.whatCouldBeBetter = "Tell us what could be better.";
  } else if (values.whatCouldBeBetter.trim().length < 10) {
    errors.whatCouldBeBetter = "Please add at least 10 characters.";
  }

  return errors;
};

export const getMovieSurvey = (
  movieId: number,
  userId: number | null,
): MovieSurveyResponse | null => {
  const stored = localStorage.getItem(buildSurveyStorageKey(movieId, userId));
  return stored ? (JSON.parse(stored) as MovieSurveyResponse) : null;
};

export const submitMovieSurvey = async (
  movieId: number,
  userId: number | null,
  values: MovieSurveyFormData,
): Promise<MovieSurveyResponse> => {
  const errors = validateSurveyForm(values);
  const hasErrors = Object.values(errors).some(Boolean);

  if (hasErrors) {
    throw new Error("Survey form is invalid.");
  }

  await sleep(500);

  const payload: MovieSurveyResponse = {
    movieId,
    userId,
    submittedAt: new Date().toISOString(),
    ...values,
    whatWorkedWell: values.whatWorkedWell.trim(),
    whatCouldBeBetter: values.whatCouldBeBetter.trim(),
  };

  localStorage.setItem(
    buildSurveyStorageKey(movieId, userId),
    JSON.stringify(payload),
  );

  return payload;
};
