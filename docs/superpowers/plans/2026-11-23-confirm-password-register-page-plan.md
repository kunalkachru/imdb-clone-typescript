## T1: Add confirmation state, field, and submit validation

Checks: AC-1, AC-2, AC-3

Files:
- src/pages/Register.tsx

Tests:
- src/test/pages/Register.test.tsx

How to show: Add a required field labeled `Confirm password` with form-only state. On submit, compare it with the entered password before password-strength validation and before calling `register`; when they differ, display the exact `Passwords do not match` error and return without registration. When they match, retain the existing strength and registration flow and pass only the existing registration credentials to `register`.

## T2: Update register-page unit coverage for confirmation behavior

Checks: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7

Files:
- src/test/pages/Register.test.tsx

Tests:
- src/test/pages/Register.test.tsx::renders the Confirm password field
- src/test/pages/Register.test.tsx::rejects mismatched passwords without registering
- src/test/pages/Register.test.tsx::registers matching passwords without sending confirmation
- src/test/pages/Register.test.tsx::blocks a weak password with an alert and registers a strong one
- src/test/pages/Register.test.tsx::keeps the helper text visible while an error is shown
- src/test/pages/Register.test.tsx::navigates home on successful registration
- src/test/pages/Register.test.tsx::shows error and does not navigate on failed registration
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Register.test.tsx

How to show: Extend the register-page unit tests to assert the field is rendered, mismatched values show the exact error and leave the registration mock untouched, and matching values call registration without a `confirmPassword` property. Supply matching confirmation values in each existing submit-flow test so weak-password blocking, helper-text persistence, successful navigation, and failed-registration behavior remain covered.

## T3: Update helper-text label coverage

Checks: AC-8

Files:
- src/test/pages/RegisterHelper.test.tsx

Tests:
- src/test/pages/RegisterHelper.test.tsx::keeps the labels and an enabled Create Account button

How to show: Extend the existing helper test to assert the `Confirm password` label is present while the Create Account button remains enabled.

## T4: Run full regression verification

Checks: AC-9

Files:
- src/pages/Register.tsx
- src/test/pages/Register.test.tsx
- src/test/pages/RegisterHelper.test.tsx

Tests:
- src/test/App.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Run the complete Vitest suite and confirm all existing application tests pass together with the updated register-page unit coverage, demonstrating that behavior outside confirmation handling remains unchanged.
