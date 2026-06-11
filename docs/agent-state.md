# Agent State Record

## Goal

Capture durable workflow state for long-running agent tasks.

## Suggested Use

Use when lessons mention state, checkpoints, resumes, or external memory.

## Placeholders

- `{{current_state}}`: replace with the expected value for this repository, task, or workflow.
- `{{completed_steps}}`: replace with the expected value for this repository, task, or workflow.
- `{{pending_steps}}`: replace with the expected value for this repository, task, or workflow.
- `{{external_ids}}`: replace with the expected value for this repository, task, or workflow.
- `{{assumptions}}`: replace with the expected value for this repository, task, or workflow.
- `{{next_action}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| current state | `{{current_state}}` | `{{current_state_evidence_or_owner}}` |
| completed steps | `{{completed_steps}}` | `{{completed_steps_evidence_or_owner}}` |
| pending steps | `{{pending_steps}}` | `{{pending_steps_evidence_or_owner}}` |
| external ids | `{{external_ids}}` | `{{external_ids_evidence_or_owner}}` |
| assumptions | `{{assumptions}}` | `{{assumptions_evidence_or_owner}}` |
| next action | `{{next_action}}` | `{{next_action_evidence_or_owner}}` |

## Expectations

- State is auditable outside chat.
- Pending work is concrete.
- Assumptions are marked as assumptions.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
