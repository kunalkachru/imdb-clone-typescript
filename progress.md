# Progress: Add a footer on every page that says "Movie data from TMDB", with a test (S-17)

## Stages
- INTAKE 2026-11-13 08:26 UTC
- SETUP 2026-11-13 08:26 UTC
- SPEC 2026-11-13 08:26 UTC
- SPEC_GATE 2026-11-13 08:27 UTC
- TASKS 2026-11-13 08:27 UTC
- BUILD 2026-11-13 08:28 UTC
- PROVE 2026-11-13 08:36 UTC
- REVIEW 2026-11-13 08:37 UTC
- FIX 2026-11-13 08:37 UTC
- PROVE 2026-11-13 08:39 UTC
- REVIEW 2026-11-13 08:39 UTC
- FIX 2026-11-13 08:39 UTC

## Decisions, gotchas, what failed and why
- T1 touched files outside its list: src/App.css, src/App.tsx, src/components/Footer.tsx

## Tasks
- [x] T1 Add the shared footer to the application route shell (a601f1a)
- [x] T2 Add route-shell regression coverage for rendering and navigation (3e8dce0)
- [x] FIX-1 Make the failing tests pass and every acceptance check visible (5c9961c)
