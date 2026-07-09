# Strict Audit Remediation Report

Implemented: 2026-07-09

This is an implementation evidence report for the strict GH-600 lesson quality audit. It does not replace the audit or change scoring rules.

## Lessons Changed

- 101 of 101 lessons regenerated with strict teaching-efficacy fields, lesson-specific artifacts, labs, scenarios, quizzes, flashcards, source IDs, and documentation profiles.
- Full-course status: all lessons remediated.
- 12 priority lessons retain handwritten remediation overrides for the strict-audit findings.

### Priority Handwritten Overrides

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
- Linked labs, scenarios, all five linked quiz questions, and three linked flashcards per skill were updated.

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

- Every lesson now states the official skill or support behavior in plain language.
- Each lesson names a concrete GitHub product control, artifact, evidence standard, approval/recovery point, and exam trap.
- Worked examples use repository scenarios rather than generic scope/review/evidence wording.
- Practice items require the learner to choose an artifact, inspect evidence, and reject a tempting wrong answer.
- Domain and title rules prevent lessons about MCP toolsets, memory expiry, branch scope, scans, multi-agent recovery, and Responsible AI from sharing the same generic explanation.

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

- Added scripts/check-remediation-quality.mjs to fail on missing artifacts, missing source IDs, generic language, duplicated scenario/example/trap text, missing templates, weak practice items, and missing report across all 101 lessons.
- Updated lesson/content QA domain artifact allowlists for the new specialist artifacts.

## Commands Run

- `npm run remediate:strict`: regenerated 101 lessons and preserved 12 handwritten priority overrides.
- `npm run qa:content`: passed with 101 lessons, 505 lesson quiz questions, 101 scenarios, 303 flashcards, 141 labs, 63 templates, 0 warnings, and 0 errors.
- `npm run qa:lessons`: passed with 101 final lessons, 101 gold labs, 505 checked quiz questions, 101 UI config examples, and 0 errors.
- `npm run qa:remediation`: passed with 101 remediated lessons checked, 12 priority overrides checked, and 10 required artifacts checked.
- `npm run data:accuracy`: passed with 1,577 content items checked, 40 sources checked, and 0 manual review flags.
- `npm run audit:lessons`: final verdict Ready, average score 8.8/10, 81 Strong lessons, 20 Excellent lessons, and 0 lessons needing targeted improvement.
- `npm run check`: passed end to end. Vite still reports the existing large bundle warning after production build.

## Remaining Risks

- GitHub and Microsoft documentation can drift after the source currentness check date.
- The exact GH-600 exam remains proprietary; lessons are aligned to official public study guide skills and primary documentation, not leaked exam content.
- Vite still reports a large JavaScript chunk after production build; code-splitting is a performance follow-up, not a lesson-content blocker.
- Browser verification spot-checked the least-privilege lesson; full human visual acceptance across all lesson routes is still recommended.
