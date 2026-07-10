# Release Notes

## 2026-07-10

- Added the GH-600 exam-hardness standard and automated `npm run qa:exam-hard` release gate.
- Rebalanced all 505 lesson quiz questions so correct-answer positions are evenly distributed.
- Removed the lesson quiz pattern where the longest answer was usually correct.
- Strengthened simulator explanations and wrong-answer rationales so they name the relevant domain control, evidence, approval, trace, memory, tool, handoff, policy, or audit reason.
- Added six advanced domain case-study drills for Microsoft-style scenario practice.
- Added exam-hardness QA to the weekly source-currentness workflow and the full `npm run check` release path.
- Documented the assessment difficulty gate in the README and data accuracy framework.
- Expanded advanced case-study drills from 6 to 18, with three case studies per official exam domain.
- Added product-behavior and tempting-distractor teaching notes to every case-study question.
- Added 72 source-grounded expert-calibrated lesson questions, balanced at 12 per domain.
- Added Microsoft Practice Assessments as an official calibration source and documented the calibration limits.
- Hardened `npm run qa:exam-hard` so release now fails if case studies or calibrated lesson questions fall below the new bar.

## 2026-06-11

- Added the GH-600 data accuracy and validation framework for issue #2.
- Added deterministic semantic evidence checks for lessons, quizzes, simulator questions, labs, flashcards, glossary entries, scenarios, mock exams, and coverage rows.
- Added source fingerprint monitoring with final URL, `Last-Modified`, `ETag`, content hash, page title, and extracted source keywords.
- Added source-linked accuracy metadata to instructional and assessment content records.
- Added maintainer-facing reports and a data accuracy action log.
- Added an end-user issue form for suspected content drift or inaccuracies.
- Added the agent documentation template library, including task intake, repository instructions, planning, handoffs, approval gates, MCP/tool governance, evaluation, trace review, memory/state, and release retrospective templates.
