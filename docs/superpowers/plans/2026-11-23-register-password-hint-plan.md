## T1: Add the password requirement hint below the Register password field

Checks: AC-1, AC-2

Files:
- src/pages/Register.tsx

Tests:
- src/test/pages/Register.test.tsx::Register page > shows the password requirement hint before submission
- src/test/pages/Register.test.tsx::Register page > keeps the password requirement hint visible while entering a password

How to show: Render the Register page and place the exact text `Use at least 8 characters, including a letter and a digit.` directly below the password field, before the existing strength feedback and password error. Keep the hint present on the initial empty form and after password input changes, without tying its visibility to submission state or changing existing validation and registration behavior.

## T2: Add focused coverage for the pre-submit and while-typing hint states

Checks: AC-1, AC-2

Files:
- src/test/pages/Register.test.tsx

Tests:
- src/test/pages/Register.test.tsx::Register page > shows the password requirement hint before submission
- src/test/pages/Register.test.tsx::Register page > keeps the password requirement hint visible while entering a password
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run src/test/pages/Register.test.tsx

How to show: In the first test, render the Register page without submitting and assert the exact hint text is visible directly below the password input. In the second, type a password and assert the same hint remains visible before submission while the existing password interactions continue to work.

## T3: Verify unchanged application behavior with the complete test suite

Checks: AC-3

Files:
- src/pages/Register.tsx
- src/test/pages/Register.test.tsx

Tests:
- src/test/pages/Register.test.tsx
- VITE_TMDB_API_KEY=test-key VITE_TMDB_BASE_URL=https://api.themoviedb.org/3 npm run test:run

How to show: Run the full Vitest suite and confirm all existing Register, authentication, navigation, validation, and unrelated application tests pass with the new hint coverage, demonstrating that behavior outside the password hint remains unchanged.
