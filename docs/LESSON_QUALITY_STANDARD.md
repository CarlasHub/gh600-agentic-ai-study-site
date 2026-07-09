# GH-600 Lesson Quality Standard

This standard applies to every lesson marked final with:

```json
"accuracy": {
  "verification": "human-reviewed"
}
```

Final lessons must teach a specific GH-600 skill as a primary learning resource. They must not be generic summaries, duplicated templates, or broad exam reminders.

## Required Lesson Shape

A final lesson must include:

- A lesson-specific `whyExam` that explains how the skill appears in GH-600 scenarios.
- A `plainLanguage` section with at least two original teaching paragraphs.
- At least five `core` paragraphs that define the concept, explain the GitHub implementation, and separate right answers from common wrong answers.
- A `githubDetail` paragraph that names real GitHub controls, files, settings, policies, or artifacts.
- A concrete `practicalExample` with a repository-style situation, boundaries, and evidence.
- A `scenario` with title, body, strong answer, and trap.
- A `workedExamQuestion` with a scenario, four answer choices, a correct index, a strong-answer explanation, and wrong-answer rationales.
- A `teachingTable` that implements the lesson's audit recommendation, such as an anti-pattern table, risk matrix, memory/state table, conflict decision tree, evidence threshold table, tuning before/after table, or scenario-to-control walkthrough.
- A `topicSpecificExplanation` that explains what is actually different about the lesson topic, with at least three paragraphs and three topic-specific distinctions.
- A `uiConfigExample` when the lesson is flagged for current UI, CLI, MCP, workflow, or configuration examples.
- A `practicalLabTask` with topic-specific hands-on steps rendered inside the lesson page.
- At least five GitHub artifacts/templates in `filesToCreate`.
- At least seven action steps, five enterprise checks, three "what not to do" points, three exam drills, and five key terms.
- At least five source IDs, including the official GH-600 study guide and lesson-specific Microsoft Learn or GitHub Docs pages.
- A `documentationProfile` that names the primary-source pack used to teach the lesson.
- An `auditRecommendation` record tied to the latest teaching-quality workbook review.

## Documentation Pack Standard

Final lessons must be based on primary documentation, not secondary summaries. The `documentationProfile` must include:

- `level: "primary-source-pack"`.
- At least five `primarySourceIds`.
- `ms-gh600-guide`.
- At least one GitHub Docs implementation source.
- At least one Microsoft Learn, Microsoft certification, or Microsoft Responsible AI source.
- At least two topic-specific sources beyond broad exam or training overview pages.
- At least three `selectionRationale` entries explaining why those sources are the right evidence for this lesson.

Every primary source in the profile must:

- Also appear in `lesson.sourceIds`.
- Be published by GitHub Docs, Microsoft Learn, or Microsoft.
- Be reachable and marked `current` in `src/data/sourceStatus.json`.
- Support a concrete lesson claim, GitHub control, artifact, policy, permission, workflow, or exam behavior.

If a final lesson needs a source outside official GitHub or Microsoft documentation, do not mark it final until a human reviewer records why the non-official source is authoritative for that specific exam skill.

## Required Practice Shape

A final lesson must include:

- Exactly five `relatedQuiz` IDs that resolve to questions for that lesson.
- At least one `relatedLabs` ID that resolves to a gold lab for that exact lesson.
- One rendered worked exam-style question inside the lesson body, separate from the quiz engine.
- Quiz questions that are scenario based, lesson-specific, and not generated from the phrase "A team wants an agent to handle...".
- Wrong-answer rationales that explain the risk, not merely say the answer is wrong.
- A lab with `qualityTier: "gold"`, `lessonIds` containing the lesson ID, concrete deliverables, validation evidence, common failure, recovery path, and official source IDs.

## Audit Recommendation Standard

Each final lesson must implement the recommendation family assigned in `gh600_lesson_teaching_quality_audit.xlsx`:

- `worked-scenario`: richer scenario plus one worked exam-style question.
- `anti-pattern`: symptom, risk, mitigation, and GitHub control table.
- `risk-matrix`: action risk, autonomy level, approval path, and evidence table.
- `source-config`: current GitHub/MCP documentation review plus concrete UI/config evidence.
- `memory-state`: memory/state artifacts with expiry, pruning, reset, and review evidence.
- `conflict-tree`: conflict signal, decision path, owner, and merge/handoff evidence.
- `evidence-thresholds`: signal, pass threshold, fail signal, and evidence artifact.
- `tuning-before-after`: before/after tuning change, regression safeguard, and evidence.

The lesson page and static SEO page must render the worked question, table, and configuration example when present. Metadata alone is not enough.

## Rendering Rule

The app must render the curated lesson fields first:

- `lesson.plainLanguage` over the fallback intro.
- `lesson.scenario` over generic scenario data.
- `lesson.relatedLabs` over broad `skillId` lab matching.
- `lesson.relatedQuiz` over broad lesson query matching.
- `lesson.topicSpecificExplanation`, `lesson.workedExamQuestion`, `lesson.teachingTable`, and `lesson.uiConfigExample` as first-class teaching sections.

Every final lesson page must visibly label these five teaching roles:

- `Official skill`
- `GitHub product behaviour`
- `Exam strategy`
- `Original teaching example`
- `Practical lab task`
- `What is different about this topic`

The same labels must appear in the interactive React lesson page and generated static SEO lesson pages.

## Topic Specificity Standard

Lessons must not rely only on repeated wording such as "make it scoped, reviewable, and evidence-driven." That pattern may be correct, but it is not enough teaching.

Every final lesson must explain the actual mechanism for its topic category:

- MCP lessons must distinguish server approval, registry or allow-list trust, toolset narrowing, and tool-call evidence.
- Memory/state lessons must distinguish short-lived context, durable repository state, reusable memory, expiry, pruning, and reset triggers.
- Repository and branch lessons must distinguish issues, branches, pull requests, repository instructions, CODEOWNERS, rulesets, and branch protection.
- Workflow lessons must distinguish setup, runner permissions, logs, retries, rollback, and trace evidence.
- Evaluation lessons must distinguish signals, thresholds, scans, traces, failure classification, tuning, and regression checks.
- Multi-agent lessons must distinguish roles, branch or file ownership, handoffs, conflict arbitration, degraded behavior, and retirement.
- Responsible AI and guardrail lessons must distinguish least privilege, human judgment, policy blocking, approval friction, compliance, and accountability.

Final lesson `actionSteps`, `examActionDrill`, and `practicalLabTask.steps` must be topic-specific. The lesson QA must fail exact duplicated action steps and old generic patterns such as broad input/scope naming, generic human approval, generic PR handoff, and generic validation language.

## Anti-Patterns

Final lessons must fail review when they:

- Repeat the same `whyExam`, `core`, `practicalExample`, `examTrap`, scenario, or quiz pattern used by another final lesson.
- Use broad advice without naming the GitHub artifact that proves the work.
- Link generic labs that do not exercise the lesson skill.
- Cite only broad overview docs when a lesson-specific source exists.
- Treat human review as a substitute for least privilege, evidence, or scoped execution.

## Required Checks

Before marking a lesson final, run:

```bash
npm run qa:lessons
npm run qa:content
npm run check:sources
npm run data:accuracy
npm run build
```

If official source metadata changes, run:

```bash
npm run check:sources
```

Record the source links, validation output, known risks, and rollback path in the handoff.
