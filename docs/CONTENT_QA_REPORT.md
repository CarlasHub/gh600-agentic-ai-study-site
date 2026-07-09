# Content QA Report

Date: 2026-07-09

## Scope

This QA pass checked the student-facing data that powers the Vite/React study site in `src/data`.

Checked:

- Official GH-600 domain names and weightings.
- Official skill bullet mapping from `src/data/examBlueprint.json` to `src/data/coverageMatrix.json`.
- Lesson, quiz, lab, flashcard, scenario, glossary, source, cram guide, study plan, and exam simulator references.
- Source ID integrity across student-facing content.
- Lesson actionability fields: concrete action overview, step-by-step actions, files/settings/artifacts, copyable agent request, enterprise checklist, anti-patterns to avoid, exam drill, and key terms.
- Exam simulator form size, domain distribution, answer-position balance, wrong-answer rationales, and longest-answer bias.
- Agent documentation template library metadata and file existence.
- Local build readiness through `npm run qa:content` and `npm run build`.

Not checked by this local script:

- Live web availability for every source URL.
- Full human semantic review of every sentence against the current documentation.
- Changes that Microsoft or GitHub publish after this QA date unless `npm run check:sources` and `npm run data:accuracy` are run.

## Official Guide Currentness

The official Microsoft GH-600 study guide and source pack were rechecked by automated currentness scan on 2026-07-09:

- URL: https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/gh-600
- Publisher: Microsoft Learn
- Page last updated by Microsoft: 2026-05-13
- Result: all 32 tracked official sources were reachable with no source-review-needed flags. The six official domains, domain weights, and 65 official skill bullets remain mapped in the repository.

## QA Fixes Made

- Added `scripts/qa-content.mjs` as a repeatable content integrity gate.
- Added `npm run qa:content`.
- Updated `npm run check` so it runs content QA before the production build.
- Fixed broken source references in `src/data/examSimulatorQuestions.json`.
- Updated the official GH-600 guide source metadata to reflect the 2026-06-04 recheck.
- Updated `docs/CURRENTNESS_REVIEW.md` so future source reviews require the content QA script.
- Expanded the simulator from 180 to 300 questions across five 60-question forms.
- Expanded labs from 24 to 40, including capstone issue-to-PR workflows.
- Added adaptive quiz tracking, spaced repetition flashcard scheduling, visual reference aids, and weekly source currentness automation.
- Added explicit action-manual sections to all lessons so each skill explains what to create, configure, request from an agent, validate, and avoid.
- Expanded glossary coverage with common acronyms and short names such as SDLC, PR, CI, MCP, CODEOWNERS, RAI, HITL, RBAC, SAST, SBOM, RCA, DoD, and RACI.
- Raised `npm run qa:content` so a lesson cannot pass without the practical action fields used by the lesson reader.
- Added `scripts/check-data-accuracy.mjs` for source-grounding evidence checks, item-level accuracy metadata, rationales, lab validation evidence, and manual review reporting.
- Added source fingerprint monitoring in `scripts/check-source-currentness.mjs`.
- Added `docs/LESSON_TEMPLATE_RECOMMENDATION_AUDIT.md` and expanded lesson template recommendations so every lesson has domain-specific production artifacts.
- Expanded the template library from 42 to 53 templates, including branch scope, MCP allow-list, least-privilege, sensitive action, policy violation, regression, arbitration, duplicate-effort, lifecycle, step-map, and anti-pattern records.
- Added QA checks that fail when lesson artifact recommendations do not resolve to the template library, use only the generic issue template, or mismatch branch/MCP/domain expectations.

## Current Data Counts

- Sources: 32
- Official domains: 6
- Official skills: 65
- Coverage rows: 65
- Lessons: 101
- Lesson quiz questions: 505
- Exam simulator questions: 300
- Mock exam records: 3
- Exam simulator forms: 5
- Labs: 141
- Flashcards: 303
- Glossary terms: 58
- Scenarios: 101
- Template library sections: 7
- Agent documentation templates: 53

## QA Result

`npm run qa:content` passed with:

- 0 errors
- 0 warnings

The QA script confirms:

- Every official skill in the local blueprint has a coverage row.
- Every coverage row maps to at least one lesson, quiz question, lab, flashcard, source, and revision note.
- Every referenced lesson, quiz, lab, flashcard, source, glossary lesson, and scenario lesson exists.
- Every lesson has source references and the required teaching fields used by the UI.
- Every lesson has concrete action steps, file/artifact guidance, an agent request template, enterprise checks, mistakes to avoid, exam drill notes, and key terms.
- Every quiz and simulator question has four options, a valid correct answer, explanations, wrong-answer rationales, a source reference, and an exam trap.
- Each simulator form has 60 questions with this domain distribution: 10 / 14 / 8 / 10 / 10 / 8.
- Simulator answer positions are balanced and do not make the longest answer the correct answer too often.
- The agent documentation template library has valid section references and every listed template file exists.
- The source currentness check reached 32 of 32 configured sources on 2026-07-09.

## Accuracy Position

This repository is now structurally source-mapped and internally consistent against the official GH-600 study guide checked on 2026-06-04. It should not claim permanent 100% accuracy because Microsoft, GitHub, Copilot, MCP, and responsible AI documentation can change.

To keep the site trustworthy, run the currentness workflow before major releases and before recommending the site for an exam attempt.

Minimum release QA:

```bash
npm install
npm run qa:content
npm run check:sources
npm run data:accuracy
npm run build
```

## Remaining Risks

- Product behavior and documentation can change after the recorded source access date.
- The QA script proves mapping and data integrity; it does not replace human editorial review of every teaching sentence.
- Some broader surrounding knowledge is included because Microsoft states related topics may be covered. Those areas should remain clearly source-linked and periodically reviewed.
