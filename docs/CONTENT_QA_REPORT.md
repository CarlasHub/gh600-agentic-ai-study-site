# Content QA Report

Date: 2026-06-04

## Scope

This QA pass checked the student-facing data that powers the Vite/React study site in `src/data`.

Checked:

- Official GH-600 domain names and weightings.
- Official skill bullet mapping from `src/data/examBlueprint.json` to `src/data/coverageMatrix.json`.
- Lesson, quiz, lab, flashcard, scenario, glossary, source, cram guide, study plan, and exam simulator references.
- Source ID integrity across student-facing content.
- Exam simulator form size, domain distribution, answer-position balance, wrong-answer rationales, and longest-answer bias.
- Local build readiness through `npm run qa:content` and `npm run build`.

Not checked by this local script:

- Live web availability for every source URL.
- Semantic fact review of every sentence against the current documentation.
- Changes that Microsoft or GitHub publish after this QA date.

## Official Guide Currentness

The official Microsoft GH-600 study guide was rechecked on 2026-06-04:

- URL: https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600
- Publisher: Microsoft Learn
- Page last updated by Microsoft: 2026-05-13
- Result: the six official domains, domain weights, and 65 official skill bullets in the repository match the current Microsoft guide checked on this date.

## QA Fixes Made

- Added `scripts/qa-content.mjs` as a repeatable content integrity gate.
- Added `npm run qa:content`.
- Updated `npm run check` so it runs content QA before the production build.
- Fixed broken source references in `src/data/examSimulatorQuestions.json`.
- Updated the official GH-600 guide source metadata to reflect the 2026-06-04 recheck.
- Updated `docs/CURRENTNESS_REVIEW.md` so future source reviews require the content QA script.

## Current Data Counts

- Sources: 24
- Official domains: 6
- Official skills: 65
- Coverage rows: 65
- Lessons: 101
- Lesson quiz questions: 505
- Exam simulator questions: 180
- Mock exam records: 3
- Labs: 24
- Flashcards: 303
- Glossary terms: 40
- Scenarios: 60

## QA Result

`npm run qa:content` passed with:

- 0 errors
- 0 warnings

The QA script confirms:

- Every official skill in the local blueprint has a coverage row.
- Every coverage row maps to at least one lesson, quiz question, lab, flashcard, source, and revision note.
- Every referenced lesson, quiz, lab, flashcard, source, glossary lesson, and scenario lesson exists.
- Every lesson has source references and the required teaching fields used by the UI.
- Every quiz and simulator question has four options, a valid correct answer, explanations, wrong-answer rationales, a source reference, and an exam trap.
- Each simulator form has 60 questions with this domain distribution: 10 / 14 / 8 / 10 / 10 / 8.
- Simulator answer positions are balanced and do not make the longest answer the correct answer too often.

## Accuracy Position

This repository is now structurally source-mapped and internally consistent against the official GH-600 study guide checked on 2026-06-04. It should not claim permanent 100% accuracy because Microsoft, GitHub, Copilot, MCP, and responsible AI documentation can change.

To keep the site trustworthy, run the currentness workflow before major releases and before recommending the site for an exam attempt.

Minimum release QA:

```bash
npm install
npm run qa:content
npm run build
```

## Remaining Risks

- Product behavior and documentation can change after the recorded source access date.
- The QA script proves mapping and data integrity; it does not replace human editorial review of every teaching sentence.
- Some broader surrounding knowledge is included because Microsoft states related topics may be covered. Those areas should remain clearly source-linked and periodically reviewed.
