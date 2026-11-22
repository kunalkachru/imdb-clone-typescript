## T1: Add the forgot-password link and demo reset message

Checks: AC-1, AC-2

Files:
- src/pages/Login.tsx

Tests:
- src/test/pages/Login.test.tsx

How to show: Add an accessible `Forgot password?` link directly beneath the password field. Handle activation locally so the login form is not submitted, the route remains `/login`, and the exact message `Password reset is not available in this demo` becomes visible.

## T2: Add focused forgot-password interaction coverage

Checks: AC-1, AC-2

Files:
- src/test/pages/Login.test.tsx

Tests:
- src/test/pages/Login.test.tsx::renders the Forgot password link under the password field
- src/test/pages/Login.test.tsx::shows the demo reset message without submitting or navigating when Forgot password is clicked
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Login.test.tsx

How to show: Render the login flow, assert the link is accessible by its exact label and follows the password field in the form, then click it and assert the exact demo message is displayed, the mocked login service was not called, and the login route remains rendered.

## T3: Verify existing login and application behavior remains unchanged

Checks: AC-3

Files:
- src/pages/Login.tsx
- src/test/pages/Login.test.tsx

Tests:
- src/test/pages/Login.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Run the full Vitest suite and confirm the existing successful-login, failed-login, password-visibility, helper-text, registration-link, and unrelated application tests continue to pass with the new focused coverage.
