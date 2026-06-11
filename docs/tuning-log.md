# Tuning Log

## Goal

Record prompt, model, tool, route, or guardrail changes and their evaluation impact.

## Suggested Use

Use when improving agent behavior after evals, failures, or source-drift findings.

## Placeholders

- `{{change}}`: replace with the expected value for this repository, task, or workflow.
- `{{reason}}`: replace with the expected value for this repository, task, or workflow.
- `{{baseline_result}}`: replace with the expected value for this repository, task, or workflow.
- `{{new_result}}`: replace with the expected value for this repository, task, or workflow.
- `{{risk}}`: replace with the expected value for this repository, task, or workflow.
- `{{decision}}`: replace with the expected value for this repository, task, or workflow.
- `{{rollback}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| change | `{{change}}` | `{{change_evidence_or_owner}}` |
| reason | `{{reason}}` | `{{reason_evidence_or_owner}}` |
| baseline result | `{{baseline_result}}` | `{{baseline_result_evidence_or_owner}}` |
| new result | `{{new_result}}` | `{{new_result_evidence_or_owner}}` |
| risk | `{{risk}}` | `{{risk_evidence_or_owner}}` |
| decision | `{{decision}}` | `{{decision_evidence_or_owner}}` |
| rollback | `{{rollback}}` | `{{rollback_evidence_or_owner}}` |

## Expectations

- Tuning changes are evidence-backed.
- Baseline and new results are compared.
- Rollback is possible.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
