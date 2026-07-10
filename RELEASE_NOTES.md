# Release Notes

## 2026-07-10

- Added the GH-600 exam-hardness standard and automated `npm run qa:exam-hard` release gate.
- Rebalanced all 505 lesson quiz questions so correct-answer positions are evenly distributed.
- Removed the lesson quiz pattern where the longest answer was usually correct.
- Strengthened simulator explanations and wrong-answer rationales so they name the relevant domain control, evidence, approval, trace, memory, tool, handoff, policy, or audit reason.
- Added six advanced domain case-study drills for Microsoft-style scenario practice.
- Added exam-hardness QA to the weekly source-currentness workflow and the full `npm run check` release path.
- Documented the assessment difficulty gate in the README and data accuracy framework.

## 2026-06-11

- Added the GH-600 data accuracy and validation framework for issue #2.
- Added deterministic semantic evidence checks for lessons, quizzes, simulator questions, labs, flashcards, glossary entries, scenarios, mock exams, and coverage rows.
- Added source fingerprint monitoring with final URL, `Last-Modified`, `ETag`, content hash, page title, and extracted source keywords.
- Added source-linked accuracy metadata to instructional and assessment content records.
- Added maintainer-facing reports and a data accuracy action log.
- Added an end-user issue form for suspected content drift or inaccuracies.
- Added the agent documentation template library, including task intake, repository instructions, planning, handoffs, approval gates, MCP/tool governance, evaluation, trace review, memory/state, and release retrospective templates.
