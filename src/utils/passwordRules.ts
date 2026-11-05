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
