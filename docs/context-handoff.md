# Context Handoff

## Goal

Transfer relevant context between sessions without carrying stale or private data.

## Suggested Use

Use when compacting, resuming, or handing off agent work.

## Placeholders

- `{{goal}}`: replace with the expected value for this repository, task, or workflow.
- `{{relevant_context}}`: replace with the expected value for this repository, task, or workflow.
- `{{excluded_context}}`: replace with the expected value for this repository, task, or workflow.
- `{{stale_context_risk}}`: replace with the expected value for this repository, task, or workflow.
- `{{next_action}}`: replace with the expected value for this repository, task, or workflow.
- `{{review_date}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| goal | `{{goal}}` | `{{goal_evidence_or_owner}}` |
| relevant context | `{{relevant_context}}` | `{{relevant_context_evidence_or_owner}}` |
| excluded context | `{{excluded_context}}` | `{{excluded_context_evidence_or_owner}}` |
| stale context risk | `{{stale_context_risk}}` | `{{stale_context_risk_evidence_or_owner}}` |
| next action | `{{next_action}}` | `{{next_action_evidence_or_owner}}` |
| review date | `{{review_date}}` | `{{review_date_evidence_or_owner}}` |

## Expectations

- Only relevant context is carried forward.
- Stale context is flagged.
- Sensitive context is excluded.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
