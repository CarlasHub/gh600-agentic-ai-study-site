# Audit Trail

## Goal

Record agent decisions, tool calls, approvals, and evidence in a durable trail.

## Suggested Use

Use when accountability, compliance, or multi-agent traceability matters.

## Placeholders

- `{{event_time}}`: replace with the expected value for this repository, task, or workflow.
- `{{actor}}`: replace with the expected value for this repository, task, or workflow.
- `{{action}}`: replace with the expected value for this repository, task, or workflow.
- `{{tool}}`: replace with the expected value for this repository, task, or workflow.
- `{{evidence}}`: replace with the expected value for this repository, task, or workflow.
- `{{decision}}`: replace with the expected value for this repository, task, or workflow.
- `{{reviewer}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| event time | `{{event_time}}` | `{{event_time_evidence_or_owner}}` |
| actor | `{{actor}}` | `{{actor_evidence_or_owner}}` |
| action | `{{action}}` | `{{action_evidence_or_owner}}` |
| tool | `{{tool}}` | `{{tool_evidence_or_owner}}` |
| evidence | `{{evidence}}` | `{{evidence_evidence_or_owner}}` |
| decision | `{{decision}}` | `{{decision_evidence_or_owner}}` |
| reviewer | `{{reviewer}}` | `{{reviewer_evidence_or_owner}}` |

## Expectations

- Events are chronological.
- Tool use and approvals are visible.
- Sensitive data is redacted.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
