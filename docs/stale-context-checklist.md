# Stale Context Checklist

## Goal

Check whether assumptions, sources, memory, or instructions have expired.

## Suggested Use

Use before resuming long-running work or relying on prior source-grounded content.

## Placeholders

- `{{context_item}}`: replace with the expected value for this repository, task, or workflow.
- `{{last_checked}}`: replace with the expected value for this repository, task, or workflow.
- `{{expiry_trigger}}`: replace with the expected value for this repository, task, or workflow.
- `{{current_source}}`: replace with the expected value for this repository, task, or workflow.
- `{{decision}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| context item | `{{context_item}}` | `{{context_item_evidence_or_owner}}` |
| last checked | `{{last_checked}}` | `{{last_checked_evidence_or_owner}}` |
| expiry trigger | `{{expiry_trigger}}` | `{{expiry_trigger_evidence_or_owner}}` |
| current source | `{{current_source}}` | `{{current_source_evidence_or_owner}}` |
| decision | `{{decision}}` | `{{decision_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |

## Expectations

- Stale assumptions are surfaced.
- Current sources are checked.
- Decisions are recorded.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
