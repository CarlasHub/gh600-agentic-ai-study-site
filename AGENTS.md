# Agent Operating Rules

This file defines how AI coding agents should work in this repository.

Template placeholders use `{{placeholder_name}}`. If copying this file to another repository, replace placeholders with local facts.

## Goal

Keep agent work scoped, reviewable, and evidence-backed.

## Suggested Use

Use this file at the repository root. Add nested `AGENTS.md` files when a directory has stricter local rules, such as production infrastructure, security-sensitive code, or regulated content.

## Scope

Default scope for this repository:

- Read project docs, scripts, data, and app code as needed.
- Edit only files required by the issue or task contract.
- Prefer existing patterns in `src/main.jsx`, `src/data`, `docs`, and `scripts`.

Template placeholders:

- `{{agent_scope}}`
- `{{allowed_directories}}`
- `{{blocked_directories}}`

## Required Workflow

1. Restate the task goal.
2. Identify expected files and artifacts.
3. Identify approval gates and stop conditions.
4. Make scoped edits.
5. Run relevant checks.
6. Record evidence and residual risk.

## GH-600 Lesson Quality Rule

When editing lessons, labs, scenarios, quizzes, or source mappings, follow `docs/LESSON_QUALITY_STANDARD.md`.

Lessons marked with `accuracy.verification: "human-reviewed"` are considered final lessons and must pass:

```bash
npm run qa:lessons
```

Do not mark a lesson `human-reviewed` unless its rendered page uses lesson-specific plain-language teaching, curated scenario, related lab, five non-generic quiz questions, concrete GitHub artifacts, and official source support.

## Stop Conditions

Stop and ask for human approval when:

- requirements conflict or are ambiguous;
- a sensitive file must change;
- secrets, credentials, private data, or deployment permissions are involved;
- source documentation has drifted and content accuracy is uncertain;
- validation fails after one focused fix attempt;
- the task would require broad refactoring outside the approved scope.

Template placeholders:

- `{{stop_condition}}`
- `{{approval_owner}}`
- `{{escalation_channel}}`

## Evidence Requirements

Every PR or handoff must include:

- `{{goal}}`
- `{{files_changed}}`
- `{{commands_run}}`
- `{{test_or_build_output}}`
- `{{source_links}}`
- `{{known_risks}}`
- `{{rollback_plan}}`

## Tool Rules

- Use read-only tools first.
- Use write tools only for files in scope.
- Do not push, deploy, delete, rotate secrets, or change permissions unless explicitly authorized.
- Treat MCP servers and browser automation as external tool surfaces that can expose data or act autonomously.
- Record tool and MCP usage in the PR.

## Handoff Format

When handing work to another agent or human reviewer, use:

```text
Goal: {{goal}}
Completed: {{completed_actions}}
Changed files: {{changed_files}}
Validation: {{checks_and_results}}
Open risks: {{open_risks}}
Next decision: {{next_human_decision}}
```
