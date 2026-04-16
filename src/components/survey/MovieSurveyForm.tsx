import { useMemo, useState } from "react";
import type {
  MovieSurveyFormData,
  MovieSurveyResponse,
  MovieSurveyValidationErrors,
} from "../../types/survey";
import {
  defaultSurveyFormData,
  surveyDiscoverySourceOptions,
  surveySentimentOptions,
  surveyWatchContextOptions,
} from "../../types/survey";
import { submitMovieSurvey, validateSurveyForm } from "../../services/survey";
import SurveyRatingField from "./SurveyRatingField";

interface MovieSurveyFormProps {
  movieId: number;
  userId: number | null;
  existingSurvey: MovieSurveyResponse | null;
  onSubmitted: (survey: MovieSurveyResponse) => void;
  onCancel?: () => void;
}

const formatOptionLabel = (value: string): string =>
  value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());

const MovieSurveyForm = ({
  movieId,
  userId,
  existingSurvey,
  onSubmitted,
  onCancel,
}: MovieSurveyFormProps) => {
  const initialValues = useMemo<MovieSurveyFormData>(() => {
    if (!existingSurvey) {
      return defaultSurveyFormData;
    }

    const {
      overallRating,
      storyRating,
      actingRating,
      visualsRating,
      musicRating,
      pacingRating,
      wouldRecommend,
      watchContext,
      discoverySource,
      sentimentTag,
      whatWorkedWell,
      whatCouldBeBetter,
    } = existingSurvey;

    return {
      overallRating,
      storyRating,
      actingRating,
      visualsRating,
      musicRating,
      pacingRating,
      wouldRecommend,
      watchContext,
      discoverySource,
      sentimentTag,
      whatWorkedWell,
      whatCouldBeBetter,
    };
  }, [existingSurvey]);

  const [formData, setFormData] = useState<MovieSurveyFormData>(initialValues);
  const [errors, setErrors] = useState<MovieSurveyValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateSurveyForm(formData);
    setErrors(validationErrors);
    setSubmitError(null);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitMovieSurvey(movieId, userId, formData);
      onSubmitted(result);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit feedback right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof MovieSurveyFormData>(
    field: K,
    value: MovieSurveyFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-700 bg-gray-800/80 p-6 shadow-xl"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-yellow-400">
          Audience Feedback
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          Share your survey response
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
          Rate the movie across multiple dimensions and add short freeform feedback
          that can later power analytics and dashboards.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SurveyRatingField
          label="Overall rating"
          min={1}
          max={10}
          value={formData.overallRating}
          onChange={(value) => updateField("overallRating", value)}
          helper="1 = poor, 10 = exceptional"
        />
        <SurveyRatingField
          label="Story"
          min={1}
          max={5}
          value={formData.storyRating}
          onChange={(value) => updateField("storyRating", value)}
        />
        <SurveyRatingField
          label="Acting"
          min={1}
          max={5}
          value={formData.actingRating}
          onChange={(value) => updateField("actingRating", value)}
        />
        <SurveyRatingField
          label="Visuals"
          min={1}
          max={5}
          value={formData.visualsRating}
          onChange={(value) => updateField("visualsRating", value)}
        />
        <SurveyRatingField
          label="Music"
          min={1}
          max={5}
          value={formData.musicRating}
          onChange={(value) => updateField("musicRating", value)}
        />
        <SurveyRatingField
          label="Pacing"
          min={1}
          max={5}
          value={formData.pacingRating}
          onChange={(value) => updateField("pacingRating", value)}
        />
      </div>

      {Object.values(errors).some(Boolean) && (
        <div className="mt-4 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Please review the highlighted survey fields before submitting.
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white">Would recommend</span>
          <select
            value={formData.wouldRecommend ? "yes" : "no"}
            onChange={(e) => updateField("wouldRecommend", e.target.value === "yes")}
            className="rounded-lg bg-gray-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white">Watch context</span>
          <select
            value={formData.watchContext}
            onChange={(e) => updateField("watchContext", e.target.value as MovieSurveyFormData["watchContext"])}
            className="rounded-lg bg-gray-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {surveyWatchContextOptions.map((option) => (
              <option key={option} value={option}>
                {formatOptionLabel(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white">Discovery source</span>
          <select
            value={formData.discoverySource}
            onChange={(e) =>
              updateField(
                "discoverySource",
                e.target.value as MovieSurveyFormData["discoverySource"],
              )
            }
            className="rounded-lg bg-gray-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {surveyDiscoverySourceOptions.map((option) => (
              <option key={option} value={option}>
                {formatOptionLabel(option)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-semibold text-white">Overall sentiment</span>
        <select
          value={formData.sentimentTag}
          onChange={(e) =>
            updateField("sentimentTag", e.target.value as MovieSurveyFormData["sentimentTag"])
          }
          className="rounded-lg bg-gray-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {surveySentimentOptions.map((option) => (
            <option key={option} value={option}>
              {formatOptionLabel(option)}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white">What worked well?</span>
          <textarea
            value={formData.whatWorkedWell}
            onChange={(e) => updateField("whatWorkedWell", e.target.value)}
            rows={5}
            placeholder="Highlight the strongest parts of the movie experience."
            className="rounded-lg bg-gray-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {errors.whatWorkedWell && (
            <span className="text-sm text-red-400">{errors.whatWorkedWell}</span>
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white">What could be better?</span>
          <textarea
            value={formData.whatCouldBeBetter}
            onChange={(e) => updateField("whatCouldBeBetter", e.target.value)}
            rows={5}
            placeholder="Call out moments that felt weak, confusing, or disappointing."
            className="rounded-lg bg-gray-700 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {errors.whatCouldBeBetter && (
            <span className="text-sm text-red-400">{errors.whatCouldBeBetter}</span>
          )}
        </label>
      </div>

      {submitError && (
        <div className="mt-4 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {submitError}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : existingSurvey ? "Update Feedback" : "Submit Feedback"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MovieSurveyForm;
