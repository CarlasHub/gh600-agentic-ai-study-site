# Data Accuracy And Validation Framework

This repository uses a layered validation framework for GH-600 study content.

The goal is not to claim permanent correctness. GH-600, GitHub Copilot, MCP, GitHub Actions, and Microsoft Learn content can change. The goal is to keep each lesson, assessment, lab, flashcard, and glossary item traceable to current sources and to surface drift quickly.

## Automated Layers

1. Structural QA: `npm run qa:content`
   - Validates required fields, source IDs, official skill mapping, lesson actionability, quiz rationales, simulator balance, and content references.

2. Data accuracy scan: `npm run data:accuracy`
   - Validates accuracy metadata on all instructional and assessment records.
   - Compares cited content against source titles, source rationale, and extracted source keywords.
   - Flags low source evidence, thin rationales, stale source status, and drift review triggers.
   - Writes `docs/DATA_ACCURACY_REPORT.md` and `src/data/accuracyStatus.json`.

3. Exam-hardness scan: `npm run qa:exam-hard`
   - Checks assessment difficulty, scenario depth, official-source grounding, correct-answer distribution, longest-answer bias, wrong-answer rationale depth, simulator form weights, and domain case-study coverage.
   - Enforces the standard in `docs/GH600_EXAM_HARD_STANDARD.md`.

4. Source currentness monitor: `npm run check:sources`
   - Fetches official source URLs.
   - Tracks HTTP status, redirects, `Last-Modified`, `ETag`, content hash, page title, and source keywords.
   - Records raw hash drift but only blocks release review when semantic source keywords also indicate objective-level drift.
   - Writes `docs/SOURCE_CURRENTNESS_REPORT.md` and updates `src/data/sourceStatus.json`.

5. Release check: `npm run check`
   - Runs production build, source currentness, content QA, exam-hardness QA, lesson quality QA, remediation QA, data accuracy scanning, and lesson audit.

## Human Review Rules

Run human editorial review when:

- the Microsoft GH-600 study guide changes;
- any cited source fingerprint, final URL, `ETag`, or `Last-Modified` value changes in a meaningful way;
- a learner or instructor reports content drift;
- source keyword overlap is low for a lesson, question, lab, flashcard, glossary item, scenario, or coverage row;
- Microsoft or GitHub renames, removes, or moves GH-600-adjacent documentation.

Record every decision in `docs/DATA_ACCURACY_ACTION_LOG.md`.

## Content Metadata

Every lesson and assessment-bearing content record carries accuracy metadata:

```json
"accuracy": {
  "reviewedAt": "2026-06-11",
  "sourceSnapshot": "gh600-source-baseline-2026-06-11",
  "verification": "source-mapped",
  "reviewRequiredOnSourceChange": true
}
```

The `sourceSnapshot` links each item to the source baseline in `src/data/sourceStatus.json`. The item-level `sourceIds` then identify the exact Microsoft or GitHub source records used for the content.

## Reporting Drift

End users and instructors can report suspected inaccuracies using the GitHub issue form:

https://github.com/CarlasHub/gh600-agentic-ai-study-site/issues/new?template=content-drift.yml

Maintainers should link accepted reports to the action log and update affected content plus reports before closing the issue.
