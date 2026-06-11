# Error Analysis

## Goal

Classify errors and convert failures into evals, tests, or template updates.

## Suggested Use

Use after wrong answers, bad PRs, failed checks, tool mistakes, or source drift.

## Placeholders

- `{{failure}}`: replace with the expected value for this repository, task, or workflow.
- `{{expected}}`: replace with the expected value for this repository, task, or workflow.
- `{{actual}}`: replace with the expected value for this repository, task, or workflow.
- `{{root_cause}}`: replace with the expected value for this repository, task, or workflow.
- `{{fix}}`: replace with the expected value for this repository, task, or workflow.
- `{{regression_case}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| failure | `{{failure}}` | `{{failure_evidence_or_owner}}` |
| expected | `{{expected}}` | `{{expected_evidence_or_owner}}` |
| actual | `{{actual}}` | `{{actual_evidence_or_owner}}` |
| root cause | `{{root_cause}}` | `{{root_cause_evidence_or_owner}}` |
| fix | `{{fix}}` | `{{fix_evidence_or_owner}}` |
| regression case | `{{regression_case}}` | `{{regression_case_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |

## Expectations

- Root cause is specific.
- A regression check is added.
- Ownership is explicit.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
