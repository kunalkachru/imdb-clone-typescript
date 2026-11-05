// zxcvbn 4.x ships without TypeScript types; declare the subset we use.
declare module "zxcvbn" {
  export interface ZxcvbnResult {
    score: 0 | 1 | 2 | 3 | 4;
    guesses: number;
    guesses_log10: number;
    crack_times_seconds: Record<string, number>;
    crack_times_display: Record<string, string>;
    feedback: { warning: string; suggestions: string[] };
    sequence: unknown[];
    calc_time: number;
    password: string;
  }

  export default function zxcvbn(password: string, userInputs?: string[]): ZxcvbnResult;
}
