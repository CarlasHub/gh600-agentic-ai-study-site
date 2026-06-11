# Agent Memory Policy

## Goal

Define what agent memory may store, reuse, redact, or forget.

## Suggested Use

Use when lessons cover short-term, long-term, external, or shared memory.

## Placeholders

- `{{memory_type}}`: replace with the expected value for this repository, task, or workflow.
- `{{allowed_content}}`: replace with the expected value for this repository, task, or workflow.
- `{{forbidden_content}}`: replace with the expected value for this repository, task, or workflow.
- `{{retention}}`: replace with the expected value for this repository, task, or workflow.
- `{{redaction}}`: replace with the expected value for this repository, task, or workflow.
- `{{review_owner}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| memory type | `{{memory_type}}` | `{{memory_type_evidence_or_owner}}` |
| allowed content | `{{allowed_content}}` | `{{allowed_content_evidence_or_owner}}` |
| forbidden content | `{{forbidden_content}}` | `{{forbidden_content_evidence_or_owner}}` |
| retention | `{{retention}}` | `{{retention_evidence_or_owner}}` |
| redaction | `{{redaction}}` | `{{redaction_evidence_or_owner}}` |
| review owner | `{{review_owner}}` | `{{review_owner_evidence_or_owner}}` |

## Expectations

- Memory policy separates facts from assumptions.
- Sensitive data is blocked or redacted.
- Retention and review cadence are explicit.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
