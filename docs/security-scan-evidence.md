# Security Scan Evidence

## Goal

Record static, dependency, secret, or policy scan evidence for agent changes.

## Suggested Use

Use when agent work touches code, workflows, dependencies, secrets, or deploy paths.

## Placeholders

- `{{scan_type}}`: replace with the expected value for this repository, task, or workflow.
- `{{command}}`: replace with the expected value for this repository, task, or workflow.
- `{{scope}}`: replace with the expected value for this repository, task, or workflow.
- `{{result}}`: replace with the expected value for this repository, task, or workflow.
- `{{findings}}`: replace with the expected value for this repository, task, or workflow.
- `{{owner}}`: replace with the expected value for this repository, task, or workflow.
- `{{remediation}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| scan type | `{{scan_type}}` | `{{scan_type_evidence_or_owner}}` |
| command | `{{command}}` | `{{command_evidence_or_owner}}` |
| scope | `{{scope}}` | `{{scope_evidence_or_owner}}` |
| result | `{{result}}` | `{{result_evidence_or_owner}}` |
| findings | `{{findings}}` | `{{findings_evidence_or_owner}}` |
| owner | `{{owner}}` | `{{owner_evidence_or_owner}}` |
| remediation | `{{remediation}}` | `{{remediation_evidence_or_owner}}` |

## Expectations

- Scan scope matches changed files.
- Findings have owners.
- Evidence is linked in the PR.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
