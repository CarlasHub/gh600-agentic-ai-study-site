# Accessibility Checklist

## Goal

Define accessibility expectations and evidence for UI or documentation changes.

## Suggested Use

Use when agent work changes visible UI, navigation, forms, tables, or learning content.

## Placeholders

- `{{affected_routes}}`: replace with the expected value for this repository, task, or workflow.
- `{{wcag_criteria}}`: replace with the expected value for this repository, task, or workflow.
- `{{keyboard_checks}}`: replace with the expected value for this repository, task, or workflow.
- `{{screen_reader_checks}}`: replace with the expected value for this repository, task, or workflow.
- `{{contrast_checks}}`: replace with the expected value for this repository, task, or workflow.
- `{{evidence}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| affected routes | `{{affected_routes}}` | `{{affected_routes_evidence_or_owner}}` |
| wcag criteria | `{{wcag_criteria}}` | `{{wcag_criteria_evidence_or_owner}}` |
| keyboard checks | `{{keyboard_checks}}` | `{{keyboard_checks_evidence_or_owner}}` |
| screen reader checks | `{{screen_reader_checks}}` | `{{screen_reader_checks_evidence_or_owner}}` |
| contrast checks | `{{contrast_checks}}` | `{{contrast_checks_evidence_or_owner}}` |
| evidence | `{{evidence}}` | `{{evidence_evidence_or_owner}}` |

## Expectations

- Accessibility checks are tied to affected routes.
- Keyboard and responsive behavior are checked.
- Evidence is linked from the PR.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
