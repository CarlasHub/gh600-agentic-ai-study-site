# Resume Checkpoint

## Goal

Create a checkpoint that lets an agent resume safely after interruption or context compaction.

## Suggested Use

Use for long tasks, paused sessions, or handoffs.

## Placeholders

- `{{goal}}`: replace with the expected value for this repository, task, or workflow.
- `{{completed}}`: replace with the expected value for this repository, task, or workflow.
- `{{current_state}}`: replace with the expected value for this repository, task, or workflow.
- `{{next_step}}`: replace with the expected value for this repository, task, or workflow.
- `{{open_questions}}`: replace with the expected value for this repository, task, or workflow.
- `{{validation_status}}`: replace with the expected value for this repository, task, or workflow.
- `{{stale_context_check}}`: replace with the expected value for this repository, task, or workflow.

## Template

| Field | Value | Evidence or owner |
| --- | --- | --- |
| goal | `{{goal}}` | `{{goal_evidence_or_owner}}` |
| completed | `{{completed}}` | `{{completed_evidence_or_owner}}` |
| current state | `{{current_state}}` | `{{current_state_evidence_or_owner}}` |
| next step | `{{next_step}}` | `{{next_step_evidence_or_owner}}` |
| open questions | `{{open_questions}}` | `{{open_questions_evidence_or_owner}}` |
| validation status | `{{validation_status}}` | `{{validation_status_evidence_or_owner}}` |
| stale context check | `{{stale_context_check}}` | `{{stale_context_check_evidence_or_owner}}` |

## Expectations

- Resume state is current.
- Next action is concrete.
- Stale context is checked before continuing.

## Review Checklist

- [ ] The goal is specific and observable.
- [ ] Required evidence is linked or named.
- [ ] Approval or ownership is explicit.
- [ ] Stale assumptions, sensitive data, and tool boundaries were reviewed.
