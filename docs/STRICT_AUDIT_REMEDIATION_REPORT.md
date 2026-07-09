# Strict Audit Remediation Report

Implemented: 2026-07-09

This is an implementation evidence report for the strict GH-600 lesson quality audit. It does not replace the audit or change scoring rules.

## Lessons Changed

- domain-1-lesson-04-configure-agent-planning-to-be-distinct-from-agent-execution: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Configure agent planning to be distinct from agent execution.
- domain-1-lesson-09-configure-agent-to-produce-inspectable-artifacts-within-standard-development-too: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Configure agent to produce inspectable artifacts within standard development tooling.
- domain-1-lesson-10-configure-human-intervention-for-autonomous-agents-without-slowing-delivery: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Configure human intervention for autonomous agents without slowing delivery.
- domain-1-lesson-11-agentic-workflows-versus-ordinary-automation: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Agentic workflows versus ordinary automation.
- domain-2-lesson-08-evaluate-the-execution-context-for-an-agent: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Evaluate the execution context for an agent.
- domain-2-lesson-20-tool-risk-classification: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Tool risk classification.
- domain-2-lesson-28-traceability-through-session-logs-and-audit-evidence: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Traceability through session logs and audit evidence.
- domain-3-lesson-13-memory-reset-and-expiry-decisions: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Memory reset and expiry decisions.
- domain-4-lesson-06-classify-root-causes-including-reasoning-errors-tool-misuse-and-context-or-envir: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Classify root causes, including reasoning errors, tool misuse, and context or environment issues.
- domain-4-lesson-10-static-analysis-codeql-secret-scanning-dependency-checks: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Static analysis, CodeQL, secret scanning, dependency checks.
- domain-4-lesson-11-accessibility-scans-as-evaluation-signals: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Accessibility scans as evaluation signals.
- domain-6-lesson-05-scope-permissions-and-execution-contexts-to-enforce-least-privilege-access: rewrote teaching body, scenario, case study, action steps, artifacts, lab, quizzes, flashcards, source IDs, and documentation profile for Scope permissions and execution contexts to enforce least-privilege access.

## Fields Changed Per Lesson

- plainLanguage, core, githubDetail, practicalExample, examTrap, scenario, caseStudy, actionOverview, actionSteps, filesToCreate, agentRequestTemplate, enterpriseChecklist, whatNotToDo, examActionDrill, takeaways, revisionQuestions, sourceIds, documentationProfile, workedExamQuestion, teachingTable, topicSpecificExplanation, practicalLabTask.
- Linked labs, scenarios, all five linked quiz questions, and three linked flashcards per targeted skill were updated.

## Artifacts And Templates Added

- docs/agent-plan-approval-record.md
- docs/pr-evidence-table.md
- docs/workflow-evidence-record.md
- docs/agentic-vs-automation-decision-table.md
- docs/execution-context-checklist.md
- docs/tool-risk-classification.md
- docs/agent-session-log-review.md
- docs/memory-reset-decision.md
- docs/root-cause-classification.md
- docs/accessibility-scan-evidence.md

## Artifacts Corrected

- domain-2 lesson 08 now uses execution-context-checklist, tool permission matrix, environment constraints, setup workflow, and validation workflow instead of broad guardrail artifacts.
- domain-4 lesson 06 now uses root-cause-classification and agent-failure-analysis as primary artifacts instead of generic evaluation artifacts.
- domain-6 lesson 05 now centers least-privilege-access-review, tool permission matrix, approval policy, execution context, and audit trail.

## Source IDs Added Or Corrected

- gh-code-scanning: About code scanning (GitHub Docs)
- gh-codeql-code-scanning: Code scanning with CodeQL (GitHub Docs)
- gh-secret-scanning: Secret scanning (GitHub Docs)
- gh-dependency-review: Dependency review (GitHub Docs)
- gh-dependency-review-action: Configuring the dependency review action (GitHub Docs)
- ms-accessibility-evaluation-testing: Accessibility evaluation and testing (Microsoft Learn)
- ms-accessibility-testing: Accessibility testing (Microsoft Learn)
- ms-edge-accessibility-testing: Resources for accessibility testing (Microsoft Learn)

## Teaching-Efficacy Improvements

- Each remediated lesson now states the official skill or support behavior in plain language.
- Each lesson names a concrete GitHub product control, artifact, evidence standard, approval/recovery point, and exam trap.
- Worked examples use repository scenarios rather than generic scope/review/evidence wording.
- Practice items require the learner to choose an artifact, inspect evidence, and reject a tempting wrong answer.

## Before And After Examples

### domain-2-lesson-08

- Before: execution context wording leaned on broad workflow and guardrail language, and the primary artifacts did not force repo, branch, runner, token, secret, environment, MCP/tool, data, and approval boundaries.
- After: the lesson requires docs/execution-context-checklist.md, docs/agent-tool-permission-matrix.md, docs/environment-constraints.md, setup logs, workflow run URL, token permissions, secret/environment decisions, MCP toolset list, and approval record.

### domain-4-lesson-06

- Before: the lesson could sound like generic error analysis and did not foreground the root-cause categories before repair.
- After: the lesson teaches reasoning, instruction, missing context, stale context, tool misuse, permission, environment, workflow/check, and evaluation-threshold failures before tuning or permission changes.

### domain-6-lesson-05

- Before: least privilege was partly framed as generic execution control.
- After: the lesson inventories repository, branch, workflow, token, secret, environment, MCP/tool, write, approval, and audit surfaces with allowed, denied, escalated, evidence, owner, validation, and rollback decisions.

## QA Checks Added

- Added scripts/check-remediation-quality.mjs to fail on missing targeted artifacts, missing exact source IDs, generic language, duplicated scenario/example/trap text, missing templates, weak practice items, and missing report.
- Updated lesson/content QA domain artifact allowlists for the new specialist artifacts.

## Commands Run

- `npm install` passed. npm reported one high-severity advisory; no forced dependency update was applied because that is separate dependency-risk remediation.
- `npm run check:sources` passed: 40 sources reachable, 0 unreachable, 0 review-needed, 0 baseline-established after the second currentness pass.
- `npm run qa:content` passed: 101 lessons, 505 lesson quiz questions, 141 labs, 303 flashcards, 63 templates, 396 sitemap URLs, 0 errors.
- `npm run qa:lessons` passed: 101 final lessons, 101 gold labs, 505 checked quiz questions, 0 errors.
- `npm run qa:remediation` passed: 12 remediated lessons checked and 10 required new artifacts checked.
- `npm run data:accuracy` passed: 1,577 content items checked, 40 sources checked, 0 review-queue items.
- `npm run build` passed and regenerated public and dist SEO pages. Vite reported a large bundle warning for the app chunk.
- `npm run check` passed end to end, including `audit:lessons`.
- `npm run audit:lessons` final result: 101 lessons audited, average score 8.1, final verdict Ready, 100 Strong, 1 Excellent, 101 Ready with minor edits, 0 mismatched templates, 0 source-verification lessons, 0 too-generic lessons.

## Remaining Risks

- GitHub and Microsoft documentation can drift after the source currentness check date.
- The exact GH-600 exam remains proprietary; lessons are aligned to official public study guide skills and primary documentation, not leaked exam content.
- npm reports one high-severity dependency advisory after `npm install`; dependency remediation was not included in this content task.
- Vite reports a large JavaScript chunk after production build; code-splitting is a performance follow-up, not a lesson-content blocker.
- Browser review is still recommended for visual/course UX acceptance after data validation passes.
