# Copilot Repository Instructions

This file is both the active instruction file for this repository and a template learners can adapt.
Template placeholders use `{{placeholder_name}}`. Do not treat placeholders as missing work unless the current issue asks you to instantiate this template.

## Goal

Help agents work in this repository with clear scope, validation, evidence, and safety boundaries.

Repository purpose:

`{{project_purpose_or_current_repository_summary}}`

For this repository: GH-600 Agentic AI Study Platform, a source-grounded Vite/React study site with structured JSON content, docs, validation scripts, and GitHub Pages deployment.

## Suggested Use

Use this file when:

- onboarding Copilot cloud agent or another coding agent to the repository;
- changing build, content, validation, or docs workflows;
- defining source-grounded content rules;
- making future nested instruction files for specific directories.

## Commands

Install:

```bash
npm install
```

Local development:

```bash
npm run dev
```

Validation:

```bash
npm run qa:content
npm run data:accuracy
npm run check:sources
npm run check
```

Template placeholders for another repository:

- `{{install_command}}`
- `{{dev_command}}`
- `{{unit_test_command}}`
- `{{integration_test_command}}`
- `{{release_check_command}}`

## Architecture Map

- `src/main.jsx`: primary React application and hash routes.
- `src/data/*.json`: exam, lesson, source, quiz, lab, flashcard, glossary, and library data.
- `src/styles/main.css`: responsive site styling.
- `scripts/`: content QA, source currentness, and data accuracy checks.
- `docs/`: maintainer docs, reports, and template library.
- `.github/workflows/`: GitHub Pages and currentness automation.

For another repository, replace this with:

- `{{entrypoint}}`
- `{{data_or_domain_model}}`
- `{{test_location}}`
- `{{deployment_location}}`
- `{{docs_location}}`

## Working Rules

1. Read the issue or task contract first.
2. Produce a plan before non-trivial edits.
3. Name the files you will touch and the files you will not touch.
4. Keep changes scoped to the requested task.
5. Run the narrowest useful checks, then the full release check when the change affects shared behavior.
6. Include evidence in the PR body.
7. Stop for human approval before touching sensitive paths, secrets, deployment settings, auth, permissions, or data retention behavior.

## Sensitive Areas

Treat these as approval-gated unless the issue explicitly authorizes them:

- `.github/workflows/`
- `.github/ISSUE_TEMPLATE/`
- `scripts/check-source-currentness.mjs`
- `scripts/check-data-accuracy.mjs`
- `src/data/sources.json`
- source accuracy reports and release metadata

Template placeholders:

- `{{sensitive_path}}`
- `{{required_approver}}`
- `{{approval_record_location}}`

## Evidence Policy

Every agent PR should include:

- changed scope;
- commands run;
- output summary;
- screenshots for visible UI changes;
- source links for content updates;
- known risks;
- rollback path.

Do not use agent confidence as evidence. Use checks, traces, logs, screenshots, source diffs, or reviewer-visible artifacts.
