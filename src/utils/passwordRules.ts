// Minimum password rules: at least 8 characters, a letter and a digit.
export type PasswordRuleResult = {
  ok: boolean;
  failures: string[];
};

export const MIN_PASSWORD_LENGTH = 8;

export const checkPasswordRules = (value: string): PasswordRuleResult => {
  const failures: string[] = [];

  if (value.length < MIN_PASSWORD_LENGTH) {
    failures.push(`at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!/[A-Za-z]/.test(value)) {
    failures.push("a letter");
  }
  if (!/[0-9]/.test(value)) {
    failures.push("a digit");
  }

  return { ok: failures.length === 0, failures };
};

// Rule-based strength score from 0 (Very weak) to 4 (Very strong).
// Points: length 8+ (1), length 12+ (1), lower case (1), upper case (1), digit (1), symbol (1).
export const scorePassword = (value: string): number => {
  if (value === "") {
    return 0;
  }

  let points = 0;
  if (value.length >= MIN_PASSWORD_LENGTH) points += 1;
  if (value.length >= 12) points += 1;
  if (/[a-z]/.test(value)) points += 1;
  if (/[A-Z]/.test(value)) points += 1;
  if (/[0-9]/.test(value)) points += 1;
  if (/[^A-Za-z0-9]/.test(value)) points += 1;

  if (points <= 1) return 0;
  if (points <= 2) return 1;
  if (points <= 4) return 2;
  if (points <= 5) return 3;
  return 4;
};
