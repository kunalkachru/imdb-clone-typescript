// Shows an in-house strength label for a password. Renders nothing when empty.
const LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"] as const;
const COLOURS = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-500", "bg-green-500"] as const;

type Score = 0 | 1 | 2 | 3 | 4;

// Simple in-house scoring: one point each for length, length 12+, mixed case,
// a digit and a symbol. Capped at 4.
const scorePassword = (value: string): Score => {
  let points = 0;
  if (value.length >= 8) points++;
  if (value.length >= 12) points++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) points++;
  if (/[0-9]/.test(value)) points++;
  if (/[^A-Za-z0-9]/.test(value)) points++;
  return Math.min(points, 4) as Score;
};

type StrengthMeterProps = {
  value: string;
};

const StrengthMeter = ({ value }: StrengthMeterProps) => {
  if (value === "") {
    return null;
  }

  const score = scorePassword(value);
  const label = LABELS[score];

  return (
    <div
      data-testid="strength-meter"
      role="meter"
      aria-label="Password strength"
      aria-valuemin={0}
      aria-valuemax={4}
      aria-valuenow={score}
      aria-valuetext={label}
      className="flex items-center gap-3 text-sm"
    >
      <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
        <div className={`h-full ${COLOURS[score]}`} style={{ width: `${(score + 1) * 20}%` }} />
      </div>
      <span className="text-gray-300">{label}</span>
    </div>
  );
};

export default StrengthMeter;
