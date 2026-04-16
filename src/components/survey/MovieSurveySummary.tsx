import type { MovieSurveyResponse } from "../../types/survey";

interface MovieSurveySummaryProps {
  survey: MovieSurveyResponse;
  onEdit: () => void;
}

const formatOptionLabel = (value: string): string =>
  value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());

const MovieSurveySummary = ({ survey, onEdit }: MovieSurveySummaryProps) => {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-6 shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-400">
            Feedback Submitted
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Overall {survey.overallRating}/10
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Submitted {new Date(survey.submittedAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={onEdit}
          className="rounded-lg border border-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-black"
        >
          Edit Feedback
        </button>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-gray-200 md:grid-cols-2">
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="font-semibold text-white">Recommendation</p>
          <p className="mt-1">{survey.wouldRecommend ? "Would recommend" : "Would not recommend"}</p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="font-semibold text-white">Sentiment</p>
          <p className="mt-1">{formatOptionLabel(survey.sentimentTag)}</p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="font-semibold text-white">Watch context</p>
          <p className="mt-1">{formatOptionLabel(survey.watchContext)}</p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="font-semibold text-white">Discovery source</p>
          <p className="mt-1">{formatOptionLabel(survey.discoverySource)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {[
          ["Story", survey.storyRating],
          ["Acting", survey.actingRating],
          ["Visuals", survey.visualsRating],
          ["Music", survey.musicRating],
          ["Pacing", survey.pacingRating],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-gray-900/70 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 text-xl font-bold text-yellow-400">{value}/5</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="text-sm font-semibold text-white">What worked well</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {survey.whatWorkedWell}
          </p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="text-sm font-semibold text-white">What could be better</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {survey.whatCouldBeBetter}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieSurveySummary;
