# Autonomy Matrix

## Goal

Map agent autonomy levels to allowed actions and approval gates.

## Suggested Use

Use when deciding how much independence an agent should have for a task or domain.

## Placeholders

- `{{autonomy_level}}`: replace with the expected value for this repository, task, or workflow.
- `{{allowed_actions}}`: replace with the expected value for this repository, task, or workflow.
- `{{blocked_actions}}`: replace with the expected value for this repository, task, or workflow.
- `{{approval_gate}}`: replace with the expected value for this repository, task, or workflow.
- `{{evidence}}`: replace with the expected value for this repository, task, or workflow.
- `{{rollback}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| autonomy level | `{{autonomy_level}}` | `{{autonomy_level_evidence_or_owner}}` |
| allowed actions | `{{allowed_actions}}` | `{{allowed_actions_evidence_or_owner}}` |
| blocked actions | `{{blocked_actions}}` | `{{blocked_actions_evidence_or_owner}}` |
| approval gate | `{{approval_gate}}` | `{{approval_gate_evidence_or_owner}}` |
| evidence | `{{evidence}}` | `{{evidence_evidence_or_owner}}` |
| rollback | `{{rollback}}` | `{{rollback_evidence_or_owner}}` |

## Expectations

- Autonomy increases only with evidence.
- High-risk actions require approval.
- Rollback is defined for each tier.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
