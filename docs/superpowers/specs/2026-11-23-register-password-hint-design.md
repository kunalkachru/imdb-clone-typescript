# Spec v1: S-160

## Goal
Show a password requirement hint directly under the Register page password field before the user submits the form. The hint should state: “Use at least 8 characters, including a letter and a digit.” Existing password validation, strength feedback, registration, and navigation behavior remain unchanged.

## Acceptance checks
- AC-1: The Register page displays “Use at least 8 characters, including a letter and a digit.” directly below the password field before any form submission (how to see it: test: src/test/pages/Register.test.tsx::Register page > shows the password requirement hint before submission)
- AC-2: The password requirement hint remains displayed after the user enters a password and before the form is submitted (how to see it: test: src/test/pages/Register.test.tsx::Register page > keeps the password requirement hint visible while entering a password)
- AC-3: Existing application behavior remains unchanged outside the password hint (how to see it: test: the full suite)

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
