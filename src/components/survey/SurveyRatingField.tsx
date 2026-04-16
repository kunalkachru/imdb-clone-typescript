interface SurveyRatingFieldProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  helper?: string;
}

const SurveyRatingField = ({
  label,
  min,
  max,
  value,
  onChange,
  helper,
}: SurveyRatingFieldProps) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      {helper && <span className="text-xs text-gray-400">{helper}</span>}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-yellow-400"
        />
        <span className="min-w-10 rounded-md bg-gray-700 px-2 py-1 text-center text-sm font-bold text-yellow-400">
          {value}
        </span>
      </div>
    </label>
  );
};

export default SurveyRatingField;
