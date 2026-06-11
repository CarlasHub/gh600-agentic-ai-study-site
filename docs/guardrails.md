# Guardrails

## Goal

Document behavioral, tool, data, and approval guardrails for agents.

## Suggested Use

Use for safety-sensitive tasks, compliance, responsible AI, or production workflows.

## Placeholders

- `{{risk}}`: replace with the expected value for this repository, task, or workflow.
- `{{guardrail}}`: replace with the expected value for this repository, task, or workflow.
- `{{trigger}}`: replace with the expected value for this repository, task, or workflow.
- `{{blocked_action}}`: replace with the expected value for this repository, task, or workflow.
- `{{allowed_alternative}}`: replace with the expected value for this repository, task, or workflow.
- `{{evidence}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| risk | `{{risk}}` | `{{risk_evidence_or_owner}}` |
| guardrail | `{{guardrail}}` | `{{guardrail_evidence_or_owner}}` |
| trigger | `{{trigger}}` | `{{trigger_evidence_or_owner}}` |
| blocked action | `{{blocked_action}}` | `{{blocked_action_evidence_or_owner}}` |
| allowed alternative | `{{allowed_alternative}}` | `{{allowed_alternative_evidence_or_owner}}` |
| evidence | `{{evidence}}` | `{{evidence_evidence_or_owner}}` |

## Expectations

- Guardrails are testable.
- Blocked behavior is explicit.
- Safe alternatives are provided.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
