# Spec v1: S-152

## Goal
Add a `Forgot password?` link directly under the password field on the login page. Clicking it keeps the visitor on the login page and reveals the exact message `Password reset is not available in this demo`; it does not perform a real password reset or submit the login form.

## Acceptance checks
- AC-1: The login page renders an accessible link labeled `Forgot password?` directly under the password field (how to see it: test: src/test/pages/Login.test.tsx)
- AC-2: Clicking `Forgot password?` on the login page displays `Password reset is not available in this demo` and does not submit the login form or navigate away (how to see it: test: src/test/pages/Login.test.tsx)
- AC-3: Existing login, password visibility, helper-text, registration-link, and unrelated application behavior remain unchanged (how to see it: test: the full suite)

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
