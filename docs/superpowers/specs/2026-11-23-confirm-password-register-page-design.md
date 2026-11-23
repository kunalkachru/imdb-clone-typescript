# Spec v2: S-161

## Goal
Add a required `Confirm password` field to the register page. When the form is submitted with a confirmation value different from the entered password, show the exact error `Passwords do not match` and do not attempt registration. When the values match, preserve the existing password-strength validation and registration flow; the confirmation value is form-only and is not registration credential data.

## Acceptance checks
- AC-1: The register-page unit test verifies that `/register` renders a `Confirm password` field in addition to the existing registration fields (how to see it: test: src/test/pages/Register.test.tsx)
- AC-2: Submitting the register form with different values in `Password` and `Confirm password` displays the exact text `Passwords do not match` and does not call the registration action (how to see it: test: src/test/pages/Register.test.tsx)
- AC-3: Submitting the register form with matching password values continues through the existing password-strength and registration flow, and the registration action receives no confirmation field (how to see it: test: src/test/pages/Register.test.tsx)
- AC-4: The existing test `Register page > blocks a weak password with an alert and registers a strong one` supplies a matching confirmation value and still proves weak passwords are blocked while a strong matching password registers successfully (how to see it: test: src/test/pages/Register.test.tsx::Register page > blocks a weak password with an alert and registers a strong one)
- AC-5: The existing test `Register page > keeps the helper text visible while an error is shown` supplies a matching confirmation value and still proves the helper text remains visible with a registration error (how to see it: test: src/test/pages/Register.test.tsx::Register page > keeps the helper text visible while an error is shown)
- AC-6: The existing test `Register page > navigates home on successful registration` supplies a matching confirmation value and still proves successful registration navigates home (how to see it: test: src/test/pages/Register.test.tsx::Register page > navigates home on successful registration)
- AC-7: The existing test `Register page > shows error and does not navigate on failed registration` supplies a matching confirmation value and still proves failed registration shows its error without navigating home (how to see it: test: src/test/pages/Register.test.tsx::Register page > shows error and does not navigate on failed registration)
- AC-8: The existing test `Register helper text > keeps the labels and an enabled Create Account button` also verifies the `Confirm password` label while the Create Account button remains enabled (how to see it: test: src/test/pages/RegisterHelper.test.tsx::Register helper text > keeps the labels and an enabled Create Account button)
- AC-9: Existing application behavior remains unchanged outside the register-page confirmation behavior (how to see it: test: the full suite)

## Affected areas
- (none)

## Risks
- (none)

## New packages
- (none)

## Choices
- (none)

## Assumptions
- (none)

## Docs used
- (none)
