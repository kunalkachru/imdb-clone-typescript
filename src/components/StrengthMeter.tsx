import { scorePassword } from "../utils/passwordRules";

// Shows a rule-based strength label for a password. Renders nothing when empty.
const LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"] as const;
const COLOURS = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-500", "bg-green-500"] as const;

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
