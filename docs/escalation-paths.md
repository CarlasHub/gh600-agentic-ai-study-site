# Escalation Paths

## Goal

Define how agents escalate ambiguity, risk, tool failures, and approval needs.

## Suggested Use

Use when agent tasks can encounter blocked tools, unclear requirements, or sensitive decisions.

## Placeholders

- `{{trigger}}`: replace with the expected value for this repository, task, or workflow.
- `{{escalation_owner}}`: replace with the expected value for this repository, task, or workflow.
- `{{channel}}`: replace with the expected value for this repository, task, or workflow.
- `{{required_context}}`: replace with the expected value for this repository, task, or workflow.
- `{{sla}}`: replace with the expected value for this repository, task, or workflow.
- `{{fallback}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| trigger | `{{trigger}}` | `{{trigger_evidence_or_owner}}` |
| escalation owner | `{{escalation_owner}}` | `{{escalation_owner_evidence_or_owner}}` |
| channel | `{{channel}}` | `{{channel_evidence_or_owner}}` |
| required context | `{{required_context}}` | `{{required_context_evidence_or_owner}}` |
| sla | `{{sla}}` | `{{sla_evidence_or_owner}}` |
| fallback | `{{fallback}}` | `{{fallback_evidence_or_owner}}` |

## Expectations

- Escalation triggers are concrete.
- Owners and channels are named.
- Fallback behavior is safe.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
