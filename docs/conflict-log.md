# Conflict Log

## Goal

Track conflicts between agents, tools, requirements, or source documents.

## Suggested Use

Use when multi-agent work or source-grounded content produces incompatible recommendations.

## Placeholders

- `{{conflict}}`: replace with the expected value for this repository, task, or workflow.
- `{{source_a}}`: replace with the expected value for this repository, task, or workflow.
- `{{source_b}}`: replace with the expected value for this repository, task, or workflow.
- `{{impact}}`: replace with the expected value for this repository, task, or workflow.
- `{{decision_owner}}`: replace with the expected value for this repository, task, or workflow.
- `{{resolution}}`: replace with the expected value for this repository, task, or workflow.
- `{{follow_up}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| conflict | `{{conflict}}` | `{{conflict_evidence_or_owner}}` |
| source a | `{{source_a}}` | `{{source_a_evidence_or_owner}}` |
| source b | `{{source_b}}` | `{{source_b_evidence_or_owner}}` |
| impact | `{{impact}}` | `{{impact_evidence_or_owner}}` |
| decision owner | `{{decision_owner}}` | `{{decision_owner_evidence_or_owner}}` |
| resolution | `{{resolution}}` | `{{resolution_evidence_or_owner}}` |
| follow up | `{{follow_up}}` | `{{follow_up_evidence_or_owner}}` |

## Expectations

- Conflicts are not hidden.
- A decision owner is named.
- Resolution is linked to evidence.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
