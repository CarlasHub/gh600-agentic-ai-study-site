# Agent Handoff

## Goal

Summarize current state and transfer work to another agent or human reviewer.

## Suggested Use

Use for resumed work, specialist transitions, or multi-agent workflows.

## Placeholders

- `{{goal}}`: replace with the expected value for this repository, task, or workflow.
- `{{completed_work}}`: replace with the expected value for this repository, task, or workflow.
- `{{changed_files}}`: replace with the expected value for this repository, task, or workflow.
- `{{validation}}`: replace with the expected value for this repository, task, or workflow.
- `{{open_risks}}`: replace with the expected value for this repository, task, or workflow.
- `{{next_owner}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| goal | `{{goal}}` | `{{goal_evidence_or_owner}}` |
| completed work | `{{completed_work}}` | `{{completed_work_evidence_or_owner}}` |
| changed files | `{{changed_files}}` | `{{changed_files_evidence_or_owner}}` |
| validation | `{{validation}}` | `{{validation_evidence_or_owner}}` |
| open risks | `{{open_risks}}` | `{{open_risks_evidence_or_owner}}` |
| next owner | `{{next_owner}}` | `{{next_owner_evidence_or_owner}}` |

## Expectations

- The receiver can continue without chat history.
- Open risks and decisions are explicit.
- Ownership of the next action is clear.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
