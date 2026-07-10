# Release Checklist

- [x] Source research log created.
- [x] Coverage matrix created.
- [x] Vite app structure created.
- [x] Lessons, quizzes, mock exams, flashcards, labs, glossary, study plan, cram guide, and readiness data generated.
- [x] npm install completed.
- [x] npm run build completed.
- [x] Browser smoke test completed across home, blueprint, domains, lesson, labs, quiz, mock exam, flashcards, glossary, readiness, study plan, and cram guide.
- [x] Source URL availability check completed: all sources returned HTTP 200 or redirect statuses, no 5xx or network failures.
- [x] ZIP artifact created.

- [x] 101 lesson case studies rendered and browser-smoke-tested.
- [x] Currentness check surfaced in the cram/readiness flow.
- [x] Production build completed without chunk-size warnings after Vite configuration tuning.
- [x] Original GitHub UI workflow walkthroughs added and routed.
- [x] Data accuracy framework documented and linked.
- [x] `npm run data:accuracy` added to the release check path.
- [x] `npm run qa:exam-hard` added to the release check path.
- [x] Source fingerprint monitoring added to weekly currentness workflow.
- [x] Content drift issue form added for learners and instructors.
- [ ] Before each release, run `npm run qa:exam-hard` and confirm assessment difficulty, answer balance, simulator form weights, and case studies pass.
- [ ] Before each release, confirm `docs/DATA_ACCURACY_REPORT.md` has no unresolved high-severity review item.
- [ ] Before each release, record any source drift or content correction decision in `docs/DATA_ACCURACY_ACTION_LOG.md`.
