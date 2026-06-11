# Decision Log

## Goal

Record durable decisions and why they were made.

## Suggested Use

Use when lessons mention governance, state, memory, review, or source-drift decisions.

## Placeholders

- `{{decision}}`: replace with the expected value for this repository, task, or workflow.
- `{{options_considered}}`: replace with the expected value for this repository, task, or workflow.
- `{{evidence}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.
- `{{date}}`: replace with the expected value for this repository, task, or workflow.
- `{{review_trigger}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| decision | `{{decision}}` | `{{decision_evidence_or_owner}}` |
| options considered | `{{options_considered}}` | `{{options_considered_evidence_or_owner}}` |
| evidence | `{{evidence}}` | `{{evidence_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |
| date | `{{date}}` | `{{date_evidence_or_owner}}` |
| review trigger | `{{review_trigger}}` | `{{review_trigger_evidence_or_owner}}` |

## Expectations

- Decisions include rationale and owner.
- Review triggers are explicit.
- The log separates evidence from preference.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
