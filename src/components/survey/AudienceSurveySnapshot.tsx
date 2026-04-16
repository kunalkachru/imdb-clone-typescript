import type {
  AudienceSnapshotMetrics,
  AudienceSurveyEntry,
} from "../../types/survey";

interface AudienceSurveySnapshotProps {
  metrics: AudienceSnapshotMetrics;
  comments: AudienceSurveyEntry[];
}

const formatOptionLabel = (value: string): string =>
  value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());

const AudienceSurveySnapshot = ({
  metrics,
  comments,
}: AudienceSurveySnapshotProps) => {
  return (
    <div className="mt-6 rounded-2xl border border-gray-700 bg-gray-800/70 p-6 shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-yellow-400">
        Audience Snapshot
      </p>
      <h3 className="mt-2 text-2xl font-bold text-white">
        Community feedback highlights
      </h3>
      <p className="mt-2 text-sm text-gray-400">
        Sample audience feedback for this movie, combined with your latest submission
        when available.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Responses</p>
          <p className="mt-2 text-xl font-bold text-yellow-400">{metrics.responses}</p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Average overall</p>
          <p className="mt-2 text-xl font-bold text-yellow-400">
            {metrics.averageOverallRating}/10
          </p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Would recommend</p>
          <p className="mt-2 text-xl font-bold text-yellow-400">
            {metrics.recommendRate}%
          </p>
        </div>
        <div className="rounded-xl bg-gray-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Top sentiment</p>
          <p className="mt-2 text-xl font-bold text-yellow-400">
            {formatOptionLabel(metrics.topSentiment)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {[
          ["Story", metrics.averageStoryRating],
          ["Acting", metrics.averageActingRating],
          ["Visuals", metrics.averageVisualsRating],
          ["Music", metrics.averageMusicRating],
          ["Pacing", metrics.averagePacingRating],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-gray-900/70 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 text-lg font-bold text-yellow-400">{value}/5</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white">Recent comments</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {comments.map((comment, index) => (
            <div key={`${comment.reviewerName}-${index}`} className="rounded-xl bg-gray-900/70 p-4">
              <p className="text-sm font-semibold text-yellow-400">
                {comment.reviewerName}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {comment.whatWorkedWell}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Could improve: {comment.whatCouldBeBetter}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudienceSurveySnapshot;
