# Responsible AI Risk Review

## Goal

Assess fairness, reliability, privacy, safety, transparency, and accountability risks.

## Suggested Use

Use for agent workflows affecting people, sensitive data, decisions, or user-facing automation.

## Placeholders

- `{{use_case}}`: replace with the expected value for this repository, task, or workflow.
- `{{affected_users}}`: replace with the expected value for this repository, task, or workflow.
- `{{rai_risks}}`: replace with the expected value for this repository, task, or workflow.
- `{{mitigations}}`: replace with the expected value for this repository, task, or workflow.
- `{{human_oversight}}`: replace with the expected value for this repository, task, or workflow.
- `{{monitoring}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| use case | `{{use_case}}` | `{{use_case_evidence_or_owner}}` |
| affected users | `{{affected_users}}` | `{{affected_users_evidence_or_owner}}` |
| rai risks | `{{rai_risks}}` | `{{rai_risks_evidence_or_owner}}` |
| mitigations | `{{mitigations}}` | `{{mitigations_evidence_or_owner}}` |
| human oversight | `{{human_oversight}}` | `{{human_oversight_evidence_or_owner}}` |
| monitoring | `{{monitoring}}` | `{{monitoring_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |

## Expectations

- Human oversight is defined.
- Risks map to mitigations.
- Monitoring and accountability are explicit.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
