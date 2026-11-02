import { useState } from "react";

// Password field with a show/hide toggle button drawn inside the input box.
// All native input props (name, value, onChange, placeholder, required, ...)
// are passed straight through to the <input>; `type` is controlled here.
type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const PasswordInput = ({ className = "", ...inputProps }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  const label = visible ? "Hide password" : "Show password";

  return (
    <div className="relative w-full">
      <input
        {...inputProps}
        type={visible ? "text" : "password"}
        className={`w-full pl-4 pr-12 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 ${className}`}
      />
      <button
        type="button"
        aria-label={label}
        aria-pressed={visible}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
      >
        {visible ? (
          // eye-off icon
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        ) : (
          // eye icon
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
